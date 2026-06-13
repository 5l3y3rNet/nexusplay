import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getUserFromRequest, generateApiKey, hashApiKey, verifyToken } from "@/lib/auth";
import { getDb, initDb } from "@/lib/db";

async function getUser(req: NextRequest) {
  let user = await getUserFromRequest(req);
  if (!user) {
    const token = req.cookies.get("auth_token")?.value;
    if (token) {
      const payload = await verifyToken(token);
      if (payload?.sub) {
        const db = getDb();
        const r = await db.execute({ sql: "SELECT * FROM users WHERE id = ?", args: [payload.sub as string] });
        user = r.rows[0] ?? null;
      }
    }
  }
  return user;
}

export async function GET(req: NextRequest) {
  await initDb();
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  const result = await db.execute({
    sql: "SELECT id, name, key_prefix, env, last_used_at, request_count, created_at FROM api_keys WHERE user_id = ? ORDER BY created_at DESC",
    args: [user.id as string],
  });

  return NextResponse.json({ keys: result.rows });
}

export async function POST(req: NextRequest) {
  await initDb();
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, env = "test" } = await req.json();
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

  const rawKey = generateApiKey(env as "live" | "test");
  const keyHash = await hashApiKey(rawKey);
  const keyId = uuidv4();

  const db = getDb();
  await db.execute({
    sql: "INSERT INTO api_keys (id, user_id, name, key_hash, key_prefix, env) VALUES (?, ?, ?, ?, ?, ?)",
    args: [keyId, user.id as string, name, keyHash, rawKey.slice(0, 20), env],
  });

  return NextResponse.json({ key: { id: keyId, name, key: rawKey, env, created_at: new Date().toISOString() } });
}
