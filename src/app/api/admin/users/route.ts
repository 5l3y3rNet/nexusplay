import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { requireAdmin } from "@/lib/admin-auth";
import { getDb, initDb } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

// List all non-admin users with their assigned games
export async function GET(req: NextRequest) {
  await initDb();
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const db = getDb();
  const users = await db.execute("SELECT id, email, name, company, status, created_at FROM users WHERE role != 'admin' ORDER BY created_at DESC");
  const assignments = await db.execute("SELECT user_id, game_id FROM game_assignments");
  const byUser: Record<string, string[]> = {};
  for (const a of assignments.rows) {
    const uid = a.user_id as string;
    (byUser[uid] = byUser[uid] || []).push(a.game_id as string);
  }
  const result = users.rows.map(u => ({ ...u, games: byUser[u.id as string] || [] }));
  return NextResponse.json({ users: result });
}

// Create a new user with credentials + game assignments
export async function POST(req: NextRequest) {
  await initDb();
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { email, password, name, company, games = [] } = await req.json();
  if (!email || !password || !name || !company) {
    return NextResponse.json({ error: "Email, password, name, and company are required" }, { status: 400 });
  }
  if (password.length < 6) return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });

  const db = getDb();
  const existing = await db.execute({ sql: "SELECT id FROM users WHERE email = ?", args: [email] });
  if (existing.rows.length > 0) return NextResponse.json({ error: "Email already exists" }, { status: 409 });

  const userId = uuidv4();
  const hash = await hashPassword(password);
  await db.execute({
    sql: `INSERT INTO users (id, email, password_hash, name, company, role, status) VALUES (?, ?, ?, ?, ?, 'operator', 'active')`,
    args: [userId, email, hash, name, company],
  });

  // Assign games
  for (const gameId of games) {
    await db.execute({
      sql: "INSERT OR IGNORE INTO game_assignments (id, user_id, game_id) VALUES (?, ?, ?)",
      args: [uuidv4(), userId, gameId],
    });
  }

  // Auto-create a test API key for the user
  const { generateApiKey, hashApiKey } = await import("@/lib/auth");
  const rawKey = generateApiKey("test");
  await db.execute({
    sql: `INSERT INTO api_keys (id, user_id, name, key_hash, key_prefix, env) VALUES (?, ?, 'Default Key', ?, ?, 'test')`,
    args: [uuidv4(), userId, await hashApiKey(rawKey), rawKey.slice(0, 20)],
  });

  await db.execute({
    sql: `INSERT INTO audit_logs (id, user_id, action, resource, resource_id) VALUES (?, ?, ?, ?, ?)`,
    args: [uuidv4(), admin.id as string, "user.created", "user", userId],
  });

  const loginUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ""}/login`;
  return NextResponse.json({ user: { id: userId, email, name, company }, apiKey: rawKey, loginUrl });
}
