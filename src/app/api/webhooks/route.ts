import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
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

export async function GET(req: NextRequest) {
  await initDb();
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getDb();
  const result = await db.execute({
    sql: "SELECT id, url, events, status, delivery_count, last_delivery_at, last_delivery_status, created_at FROM webhooks WHERE user_id = ? ORDER BY created_at DESC",
    args: [user.id as string],
  });
  const hooks = result.rows.map(r => ({ ...r, events: JSON.parse(r.events as string) }));
  return NextResponse.json({ webhooks: hooks });
}

export async function POST(req: NextRequest) {
  await initDb();
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { url, events } = await req.json();
  if (!url || !events?.length) return NextResponse.json({ error: "URL and events required" }, { status: 400 });
  const secret = Array.from(crypto.getRandomValues(new Uint8Array(16))).map(b => b.toString(16).padStart(2, "0")).join("");
  const id = uuidv4();
  const db = getDb();
  await db.execute({
    sql: "INSERT INTO webhooks (id, user_id, url, events, secret, status) VALUES (?, ?, ?, ?, ?, 'active')",
    args: [id, user.id as string, url, JSON.stringify(events), secret],
  });
  return NextResponse.json({ webhook: { id, url, events, secret, status: "active" } });
}
