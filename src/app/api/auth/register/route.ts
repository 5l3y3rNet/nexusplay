import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { hashPassword, signToken, generateApiKey, hashApiKey } from "@/lib/auth";
import { getDb, initDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    await initDb();
    const db = getDb();
    const { email, password, name, company, website, country, licenseNumber } = await req.json();

    if (!email || !password || !name || !company) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const existing = await db.execute({ sql: "SELECT id FROM users WHERE email = ?", args: [email] });
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const userId = uuidv4();
    const passwordHash = await hashPassword(password);

    await db.execute({
      sql: `INSERT INTO users (id, email, password_hash, name, company, website, country, license_number, role, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'operator', 'pending')`,
      args: [userId, email, passwordHash, name, company, website || null, country || null, licenseNumber || null],
    });

    // Auto-generate a test API key
    const rawKey = generateApiKey("test");
    const keyHash = await hashApiKey(rawKey);
    const keyId = uuidv4();
    await db.execute({
      sql: `INSERT INTO api_keys (id, user_id, name, key_hash, key_prefix, env)
            VALUES (?, ?, 'Default Test Key', ?, ?, 'test')`,
      args: [keyId, userId, keyHash, rawKey.slice(0, 20)],
    });

    const token = await signToken({ sub: userId, email, role: "operator" });
    const resp = NextResponse.json({
      user: { id: userId, email, name, company, role: "operator", status: "pending" },
      token,
      apiKey: rawKey, // Show once on registration
    });
    resp.cookies.set("auth_token", token, { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 7 });
    return resp;
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
