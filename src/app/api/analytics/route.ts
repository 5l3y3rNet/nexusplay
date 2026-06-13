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
  const userId = user.id as string;

  const [totalSessions, activeSessions, keyCount, topGames] = await Promise.all([
    db.execute({ sql: "SELECT COUNT(*) as count FROM game_sessions WHERE user_id = ?", args: [userId] }),
    db.execute({ sql: "SELECT COUNT(*) as count FROM game_sessions WHERE user_id = ? AND status = 'active'", args: [userId] }),
    db.execute({ sql: "SELECT COUNT(*) as count FROM api_keys WHERE user_id = ?", args: [userId] }),
    db.execute({ sql: "SELECT game_id, COUNT(*) as count FROM game_sessions WHERE user_id = ? GROUP BY game_id ORDER BY count DESC LIMIT 10", args: [userId] }),
  ]);

  return NextResponse.json({
    totalSessions: totalSessions.rows[0].count,
    activeSessions: activeSessions.rows[0].count,
    apiKeys: keyCount.rows[0].count,
    topGames: topGames.rows,
  });
}
