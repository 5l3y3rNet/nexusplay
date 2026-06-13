import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest, verifyToken } from "@/lib/auth";
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await initDb();
  const { id } = await params;
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getDb();
  await db.execute({ sql: "DELETE FROM api_keys WHERE id = ? AND user_id = ?", args: [id, user.id as string] });
  return NextResponse.json({ ok: true });
}
