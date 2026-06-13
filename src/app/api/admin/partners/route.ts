import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getDb, initDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  await initDb();
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const db = getDb();
  const r = await db.execute("SELECT id, email, name, company, country, license_number, role, status, created_at FROM users WHERE role != 'admin' ORDER BY created_at DESC");
  return NextResponse.json({ partners: r.rows });
}
