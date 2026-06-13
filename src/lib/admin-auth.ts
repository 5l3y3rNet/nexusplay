import { NextRequest } from "next/server";
import { verifyToken } from "./auth";
import { getDb } from "./db";

export async function requireAdmin(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value || req.headers.get("authorization")?.slice(7);
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload?.sub) return null;
  const db = getDb();
  const r = await db.execute({ sql: "SELECT * FROM users WHERE id = ?", args: [payload.sub as string] });
  const user = r.rows[0];
  if (!user || user.role !== "admin") return null;
  return user;
}
