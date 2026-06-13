import { createClient } from "@libsql/client";
import path from "path";

let _db: ReturnType<typeof createClient> | null = null;

export function getDb() {
  if (!_db) {
    const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), "nexusplay.db");
    _db = createClient({ url: `file:${dbPath}` });
  }
  return _db;
}

export async function initDb() {
  const db = getDb();

  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL,
      name TEXT NOT NULL, company TEXT NOT NULL, website TEXT, country TEXT,
      license_number TEXT, role TEXT NOT NULL DEFAULT 'operator',
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS api_keys (
      id TEXT PRIMARY KEY, user_id TEXT NOT NULL, name TEXT NOT NULL,
      key_hash TEXT NOT NULL, key_prefix TEXT NOT NULL, env TEXT NOT NULL DEFAULT 'test',
      last_used_at TEXT, request_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS game_sessions (
      id TEXT PRIMARY KEY, user_id TEXT NOT NULL, game_id TEXT NOT NULL,
      player_id TEXT NOT NULL, currency TEXT NOT NULL DEFAULT 'USD',
      balance REAL NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT 'active',
      launch_token TEXT UNIQUE NOT NULL, expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')), ended_at TEXT
    );
    CREATE TABLE IF NOT EXISTS webhooks (
      id TEXT PRIMARY KEY, user_id TEXT NOT NULL, url TEXT NOT NULL,
      events TEXT NOT NULL, secret TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'active',
      delivery_count INTEGER NOT NULL DEFAULT 0, last_delivery_at TEXT,
      last_delivery_status TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY, user_id TEXT, action TEXT NOT NULL, resource TEXT,
      resource_id TEXT, meta TEXT, ip TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS games (
      id TEXT PRIMARY KEY, slug TEXT UNIQUE NOT NULL, title TEXT NOT NULL,
      filename TEXT NOT NULL, category TEXT NOT NULL, description TEXT,
      rtp TEXT, volatility TEXT, status TEXT NOT NULL DEFAULT 'active',
      published INTEGER NOT NULL DEFAULT 1, thumbnail TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // Seed admin
  const existing = await db.execute("SELECT id FROM users WHERE email = 'admin@nexusplay.io'");
  if (existing.rows.length === 0) {
    const bcrypt = await import("bcryptjs");
    const { v4: uuidv4 } = await import("uuid");
    const hash = await bcrypt.hash("Admin1234!", 10);
    await db.execute({
      sql: `INSERT INTO users (id, email, password_hash, name, company, role, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [uuidv4(), "admin@nexusplay.io", hash, "Platform Admin", "NexusPlay", "admin", "active"],
    });
  }

  // Seed games from the static catalog (so admin can manage them in DB)
  const gameCount = await db.execute("SELECT COUNT(*) as c FROM games");
  if ((gameCount.rows[0].c as number) === 0) {
    const { games } = await import("./games");
    for (const g of games) {
      await db.execute({
        sql: `INSERT INTO games (id, slug, title, filename, category, description, rtp, volatility, status, published, thumbnail)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
        args: [g.id, g.slug, g.title, g.filename, g.category, g.description, g.rtp, g.volatility, g.status, g.thumbnail],
      });
    }
  }
}
