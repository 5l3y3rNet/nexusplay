import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, signToken } from "@/lib/auth";
import { getDb, initDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    await initDb();
    const db = getDb();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const result = await db.execute({
      sql: "SELECT * FROM users WHERE email = ?",
      args: [email],
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const user = result.rows[0];
    const valid = await verifyPassword(password, user.password_hash as string);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    if (user.status === "suspended") {
      return NextResponse.json({ error: "Account suspended" }, { status: 403 });
    }

    const token = await signToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    const resp = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, company: user.company, role: user.role, status: user.status },
      token,
    });
    resp.cookies.set("auth_token", token, { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 7 });
    return resp;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
