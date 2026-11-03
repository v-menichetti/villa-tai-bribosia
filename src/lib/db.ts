import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { initialWeeks, publicWeek, type Week } from './availability';

let database: DatabaseSync | undefined;
export function db() {
  if (database) return database;
  const path = resolve(
    /* turbopackIgnore: true */ process.env.DATABASE_PATH ||
      'data/villa.sqlite',
  );
  mkdirSync(dirname(path), { recursive: true });
  database = new DatabaseSync(path);
  database.exec(`PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;
    CREATE TABLE IF NOT EXISTS weeks (start TEXT PRIMARY KEY, end TEXT NOT NULL, price INTEGER, status TEXT NOT NULL, revision INTEGER NOT NULL DEFAULT 0);
    CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, expires INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires INTEGER NOT NULL);`);
  const insert = database.prepare(
    'INSERT OR IGNORE INTO weeks (start,end,price,status,revision) VALUES (?,?,?,?,?)',
  );
  for (const w of initialWeeks())
    insert.run(w.start, w.end, w.price, w.status, 0);
  return database;
}
export function getWeeks(): Week[] {
  return db()
    .prepare('SELECT * FROM weeks ORDER BY start')
    .all() as unknown as Week[];
}
export function getPublicWeeks() {
  return getWeeks().map(publicWeek);
}
export function updateWeek(
  v: Pick<Week, 'start' | 'price' | 'status' | 'revision'>,
) {
  return (
    Number(
      db()
        .prepare(
          'UPDATE weeks SET price=?, status=?, revision=revision+1 WHERE start=? AND revision=?',
        )
        .run(v.price, v.status, v.start, v.revision).changes,
    ) === 1
  );
}
export function consumeLimit(key: string, maximum: number, windowMs: number) {
  const now = Date.now();
  db().prepare('DELETE FROM limits WHERE expires <= ?').run(now);
  const row = db()
    .prepare(
      `INSERT INTO limits (key,count,expires) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count`,
    )
    .get(key, now + windowMs) as { count: number };
  return row.count <= maximum;
}
