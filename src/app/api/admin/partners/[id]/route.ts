import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { requireAdmin } from "@/lib/admin-auth";
import { getDb, initDb } from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await initDb();
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const { status } = await req.json();
  if (!["active", "pending", "suspended"].includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  const db = getDb();
  await db.execute({ sql: "UPDATE users SET status = ? WHERE id = ?", args: [status, id] });
  await db.execute({ sql: `INSERT INTO audit_logs (id, user_id, action, resource, resource_id, meta) VALUES (?, ?, ?, ?, ?, ?)`, args: [uuidv4(), admin.id as string, "partner.status_changed", "user", id, status] });
  return NextResponse.json({ ok: true });
}
