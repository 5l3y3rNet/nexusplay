import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { getDb, initDb } from "@/lib/db";
import { getAssignedGameIds } from "@/lib/assignments";

export async function GET(req: NextRequest) {
  await initDb();
  const token = req.cookies.get("auth_token")?.value || req.headers.get("authorization")?.slice(7);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = await verifyToken(token);
  if (!payload?.sub) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  const userRes = await db.execute({ sql: "SELECT role FROM users WHERE id = ?", args: [payload.sub as string] });
  const user = userRes.rows[0];
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Admins see all games; users see only assigned
  if (user.role === "admin") {
    const all = await db.execute("SELECT * FROM games ORDER BY created_at DESC");
    return NextResponse.json({ games: all.rows });
  }

  const assignedIds = await getAssignedGameIds(payload.sub as string);
  if (assignedIds.length === 0) return NextResponse.json({ games: [] });
  const placeholders = assignedIds.map(() => "?").join(",");
  const r = await db.execute({ sql: `SELECT * FROM games WHERE id IN (${placeholders})`, args: assignedIds });
  return NextResponse.json({ games: r.rows });
}
