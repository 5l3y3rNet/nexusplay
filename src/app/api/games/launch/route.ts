import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { verifyToken, generateSessionToken } from "@/lib/auth";
import { getDb, initDb } from "@/lib/db";
import { games } from "@/lib/games";

async function getUser(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value || req.headers.get("authorization")?.slice(7);
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload?.sub) return null;
  const db = getDb();
  const r = await db.execute({ sql: "SELECT * FROM users WHERE id = ?", args: [payload.sub as string] });
  return r.rows[0] ?? null;
}

export async function POST(req: NextRequest) {
  await initDb();

  // Allow unauthenticated demo launches from the public game pages
  const body = await req.json();
  const { gameId, playerId = "demo_player", currency = "USD", balance = 1000, demo = false } = body;

  if (!gameId) return NextResponse.json({ error: "gameId required" }, { status: 400 });

  const game = games.find(g => g.id === gameId || g.slug === gameId);
  if (!game) return NextResponse.json({ error: "Game not found" }, { status: 404 });

  const user = await getUser(req);
  // For demo mode, we allow without auth
  if (!demo && !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  const sessionId = uuidv4();
  const launchToken = generateSessionToken();
  const expiresAt = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(); // 4 hours

  await db.execute({
    sql: `INSERT INTO game_sessions (id, user_id, game_id, player_id, currency, balance, status, launch_token, expires_at)
          VALUES (?, ?, ?, ?, ?, ?, 'active', ?, ?)`,
    args: [sessionId, user?.id as string ?? "demo", gameId, playerId, currency, balance, launchToken, expiresAt],
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const launchUrl = `${baseUrl}/play/${launchToken}`;

  return NextResponse.json({ sessionId, launchUrl, launchToken, expiresAt, game: { id: game.id, title: game.title } });
}
