import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { getDb, initDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  await initDb();
  const user = await getUserFromRequest(req);
  if (!user) {
    // Try cookie
    const token = req.cookies.get("auth_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { verifyToken } = await import("@/lib/auth");
    const payload = await verifyToken(token);
    if (!payload?.sub) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const db = getDb();
    const r = await db.execute({ sql: "SELECT id, email, name, company, role, status FROM users WHERE id = ?", args: [payload.sub as string] });
    if (!r.rows[0]) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ user: r.rows[0] });
  }
  return NextResponse.json({ user });
}
