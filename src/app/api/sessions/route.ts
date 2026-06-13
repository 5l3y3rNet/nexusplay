import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { getDb, initDb } from "@/lib/db";

async function getUser(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value || req.headers.get("authorization")?.slice(7);
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload?.sub) return null;
  const db = getDb();
  const r = await db.execute({ sql: "SELECT * FROM users WHERE id = ?", args: [payload.sub as string] });
  return r.rows[0] ?? null;
}

export async function GET(req: NextRequest) {
  await initDb();
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getDb();
  const result = await db.execute({
    sql: "SELECT id, game_id, player_id, currency, balance, status, created_at, ended_at FROM game_sessions WHERE user_id = ? ORDER BY created_at DESC LIMIT 50",
    args: [user.id as string],
  });
  return NextResponse.json({ sessions: result.rows });
}
