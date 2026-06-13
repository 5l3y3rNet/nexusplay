import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { requireAdmin } from "@/lib/admin-auth";
import { getDb, initDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  await initDb();
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const db = getDb();
  const r = await db.execute("SELECT * FROM games ORDER BY created_at DESC");
  return NextResponse.json({ games: r.rows });
}

export async function POST(req: NextRequest) {
  await initDb();
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { title, slug, filename, category, description, rtp, volatility, status = "active", thumbnail } = body;
  if (!title || !slug || !filename || !category) {
    return NextResponse.json({ error: "Missing required fields (title, slug, filename, category)" }, { status: 400 });
  }

  const db = getDb();
  const id = slug.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const existing = await db.execute({ sql: "SELECT id FROM games WHERE slug = ? OR id = ?", args: [slug, id] });
  if (existing.rows.length > 0) {
    return NextResponse.json({ error: "A game with that slug already exists" }, { status: 409 });
  }

  await db.execute({
    sql: `INSERT INTO games (id, slug, title, filename, category, description, rtp, volatility, status, published, thumbnail)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
    args: [id, slug, title, filename, category, description || "", rtp || "96.00%", volatility || "Medium", status, thumbnail || "/thumbs/elevator.svg"],
  });

  await db.execute({
    sql: `INSERT INTO audit_logs (id, user_id, action, resource, resource_id) VALUES (?, ?, ?, ?, ?)`,
    args: [uuidv4(), admin.id as string, "game.created", "game", id],
  });

  return NextResponse.json({ game: { id, slug, title, filename, category, description, rtp, volatility, status, published: 1, thumbnail } });
}
