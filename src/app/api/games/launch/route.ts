import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { verifyToken, generateSessionToken } from "@/lib/auth";
import { getDb, initDb } from "@/lib/db";
import { games } from "@/lib/games";
import { isGameAssigned } from "@/lib/assignments";

async function getUser(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value || req.headers.get("authorization")?.slice(7);
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload?.sub) return null;
  const db = getDb();
  const r = await db.execute({ sql: "SELECT * FROM users WHERE id = ?", args: [payload.sub as string] });
  return r.rows[0] ?? null;
}

export async function POST(req: NextRequest) {
  await initDb();
  const body = await req.json();
  const { gameId, playerId = "demo_player", currency = "USD", balance = 1000, demo = false } = body;
  if (!gameId) return NextResponse.json({ error: "gameId required" }, { status: 400 });

  const db = getDb();
  // Resolve game from DB (includes admin-added games)
  const dbGame = await db.execute({ sql: "SELECT * FROM games WHERE id = ? OR slug = ?", args: [gameId, gameId] });
  const game = dbGame.rows[0] || games.find(g => g.id === gameId || g.slug === gameId);
  if (!game) return NextResponse.json({ error: "Game not found" }, { status: 404 });

  const resolvedGameId = game.id as string;
  const user = await getUser(req);

  // Public demo launches (from the marketing site) are allowed
  if (!demo) {
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // ENFORCE ASSIGNMENT: non-admin users can only launch assigned games
    if (user.role !== "admin") {
      const assigned = await isGameAssigned(user.id as string, resolvedGameId);
      if (!assigned) {
        return NextResponse.json({ error: "This game is not assigned to your account" }, { status: 403 });
      }
    }
  }

  const sessionId = uuidv4();
  const launchToken = generateSessionToken();
  const expiresAt = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString();
  await db.execute({
    sql: `INSERT INTO game_sessions (id, user_id, game_id, player_id, currency, balance, status, launch_token, expires_at)
          VALUES (?, ?, ?, ?, ?, ?, 'active', ?, ?)`,
    args: [sessionId, (user?.id as string) ?? "demo", resolvedGameId, playerId, currency, balance, launchToken, expiresAt],
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  return NextResponse.json({
    sessionId,
    launchUrl: `${baseUrl}/play?game=${resolvedGameId}`,
    launchToken, expiresAt,
    game: { id: resolvedGameId, title: game.title },
  });
}
