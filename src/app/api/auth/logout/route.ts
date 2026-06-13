import { NextResponse } from "next/server";
export async function POST() {
  const resp = NextResponse.json({ ok: true });
  resp.cookies.delete("auth_token");
  return resp;
}
