import { NextResponse } from "next/server";
import { getDb, initDb } from "@/lib/db";

export async function GET() {
  await initDb();
  const db = getDb();
  const r = await db.execute("SELECT * FROM games WHERE published = 1 ORDER BY created_at DESC");
  return NextResponse.json({ games: r.rows });
}
