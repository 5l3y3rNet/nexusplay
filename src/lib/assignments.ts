import { getDb } from "./db";

export async function getAssignedGameIds(userId: string): Promise<string[]> {
  const db = getDb();
  const r = await db.execute({ sql: "SELECT game_id FROM game_assignments WHERE user_id = ?", args: [userId] });
  return r.rows.map(row => row.game_id as string);
}

export async function isGameAssigned(userId: string, gameId: string): Promise<boolean> {
  const db = getDb();
  const r = await db.execute({ sql: "SELECT 1 FROM game_assignments WHERE user_id = ? AND game_id = ? LIMIT 1", args: [userId, gameId] });
  return r.rows.length > 0;
}
