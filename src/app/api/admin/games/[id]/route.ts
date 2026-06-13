import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { requireAdmin } from "@/lib/admin-auth";
import { getDb, initDb } from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await initDb();
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const body = await req.json();
  const db = getDb();

  const fields: string[] = [];
  const args: any[] = [];
  for (const key of ["title", "category", "description", "rtp", "volatility", "status", "published", "thumbnail"]) {
    if (body[key] !== undefined) { fields.push(`${key} = ?`); args.push(body[key]); }
  }
  if (fields.length === 0) return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  args.push(id);

  await db.execute({ sql: `UPDATE games SET ${fields.join(", ")} WHERE id = ?`, args });
  await db.execute({ sql: `INSERT INTO audit_logs (id, user_id, action, resource, resource_id) VALUES (?, ?, ?, ?, ?)`, args: [uuidv4(), admin.id as string, "game.updated", "game", id] });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await initDb();
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const db = getDb();
  await db.execute({ sql: "DELETE FROM games WHERE id = ?", args: [id] });
  await db.execute({ sql: `INSERT INTO audit_logs (id, user_id, action, resource, resource_id) VALUES (?, ?, ?, ?, ?)`, args: [uuidv4(), admin.id as string, "game.deleted", "game", id] });
  return NextResponse.json({ ok: true });
}
