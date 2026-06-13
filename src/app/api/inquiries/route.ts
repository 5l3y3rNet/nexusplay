import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getDb, initDb } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

// Public: submit a partner inquiry
export async function POST(req: NextRequest) {
  await initDb();
  const { name, email, company, role, gamesInterested, message } = await req.json();
  if (!name || !email) return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
  const db = getDb();
  const id = uuidv4();
  await db.execute({
    sql: `INSERT INTO partner_inquiries (id, name, email, company, role, games_interested, message)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [id, name, email, company || null, role || null, JSON.stringify(gamesInterested || []), message || null],
  });
  return NextResponse.json({ ok: true });
}

// Admin: list inquiries
export async function GET(req: NextRequest) {
  await initDb();
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const db = getDb();
  const r = await db.execute("SELECT * FROM partner_inquiries ORDER BY created_at DESC");
  const inquiries = r.rows.map(row => ({ ...row, games_interested: JSON.parse((row.games_interested as string) || "[]") }));
  return NextResponse.json({ inquiries });
}
