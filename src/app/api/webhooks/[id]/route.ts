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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await initDb();
  const { id } = await params;
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getDb();
  await db.execute({ sql: "DELETE FROM webhooks WHERE id = ? AND user_id = ?", args: [id, user.id as string] });
  return NextResponse.json({ ok: true });
}
