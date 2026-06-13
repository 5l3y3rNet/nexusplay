import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { getDb } from "./db";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "nexusplay-dev-secret-change-in-production-32chars"
);

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function signToken(payload: Record<string, unknown>, expiresIn = "7d") {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

export function generateApiKey(env: "live" | "test") {
  const prefix = env === "live" ? "nxp_live_sk_" : "nxp_test_sk_";
  const random = Array.from(crypto.getRandomValues(new Uint8Array(24)))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
  return `${prefix}${random}`;
}

export function generateSessionToken() {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function hashApiKey(key: string) {
  return bcrypt.hash(key, 8);
}

export async function verifyApiKey(key: string, hash: string) {
  return bcrypt.compare(key, hash);
}

export async function getUserFromRequest(request: Request) {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const token = auth.slice(7);
  const payload = await verifyToken(token);
  if (!payload?.sub) return null;

  const db = getDb();
  const result = await db.execute({
    sql: "SELECT id, email, name, company, role, status FROM users WHERE id = ?",
    args: [payload.sub as string],
  });
  return result.rows[0] ?? null;
}
