import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getDb, initDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  await initDb();
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const db = getDb();
  const [partners, games, sessions, keys, audit] = await Promise.all([
    db.execute("SELECT COUNT(*) as c FROM users WHERE role != 'admin'"),
    db.execute("SELECT COUNT(*) as c FROM games"),
    db.execute("SELECT COUNT(*) as c FROM game_sessions"),
    db.execute("SELECT COUNT(*) as c FROM api_keys"),
    db.execute("SELECT a.action, a.created_at, u.email FROM audit_logs a LEFT JOIN users u ON a.user_id = u.id ORDER BY a.created_at DESC LIMIT 10"),
  ]);
  return NextResponse.json({
    partners: partners.rows[0].c,
    games: games.rows[0].c,
    sessions: sessions.rows[0].c,
    apiKeys: keys.rows[0].c,
    recentActivity: audit.rows,
  });
}
