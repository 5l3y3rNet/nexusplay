import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { requireAdmin } from "@/lib/admin-auth";
import { getDb, initDb } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await initDb();
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const body = await req.json();
  const db = getDb();

  // Update game assignments
  if (body.games !== undefined) {
    await db.execute({ sql: "DELETE FROM game_assignments WHERE user_id = ?", args: [id] });
    for (const gameId of body.games) {
      await db.execute({ sql: "INSERT OR IGNORE INTO game_assignments (id, user_id, game_id) VALUES (?, ?, ?)", args: [uuidv4(), id, gameId] });
    }
  }
  // Update status
  if (body.status !== undefined) {
    await db.execute({ sql: "UPDATE users SET status = ? WHERE id = ?", args: [body.status, id] });
  }
  // Reset password
  if (body.password) {
    await db.execute({ sql: "UPDATE users SET password_hash = ? WHERE id = ?", args: [await hashPassword(body.password), id] });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await initDb();
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const db = getDb();
  await db.execute({ sql: "DELETE FROM game_assignments WHERE user_id = ?", args: [id] });
  await db.execute({ sql: "DELETE FROM api_keys WHERE user_id = ?", args: [id] });
  await db.execute({ sql: "DELETE FROM users WHERE id = ?", args: [id] });
  return NextResponse.json({ ok: true });
}
