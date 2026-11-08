import { neon } from '@neondatabase/serverless';
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { seasonYear } from './season';
import { initialWeeks, publicWeek, type Week } from './availability';

type Parameter = string | number | null;
export type Statement = { text: string; values?: Parameter[] };
type Row = Record<string, unknown>;
const schema = [
  'CREATE TABLE IF NOT EXISTS weeks (start TEXT PRIMARY KEY, "end" TEXT NOT NULL, price INTEGER, status TEXT NOT NULL, revision INTEGER NOT NULL DEFAULT 0)',
  'CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, expires BIGINT NOT NULL)',
  'CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)',
  'CREATE TABLE IF NOT EXISTS limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires BIGINT NOT NULL)',
];
let database: DatabaseSync | undefined;
let remote: ReturnType<typeof neon> | undefined;
let ready: Promise<unknown> | undefined;

function usesPostgres() {
  if (process.env.DATABASE_URL) return true;
  if (process.env.VERCEL)
    throw new Error(
      'DATABASE_URL is required on Vercel. Connect a Neon Postgres database and redeploy.',
    );
  return false;
}

// Local development only. Never write to the deployment filesystem on Vercel.
export function db() {
  if (usesPostgres())
    throw new Error('SQLite is disabled when using Postgres.');
  if (database) return database;
  const path = resolve(
    /* turbopackIgnore: true */ process.env.DATABASE_PATH ||
      'data/villa.sqlite',
  );
  mkdirSync(dirname(path), { recursive: true });
  database = new DatabaseSync(path);
  database.exec('PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;');
  database.exec(schema.join(';'));
  if (
    !database
      .prepare("SELECT key FROM settings WHERE key='availability-v2'")
      .get()
  ) {
    database.exec(
      "BEGIN IMMEDIATE; UPDATE weeks SET status='available', revision=revision+1 WHERE status='unconfirmed'; INSERT OR IGNORE INTO settings VALUES ('availability-v2','done'); COMMIT;",
    );
  }
  return database;
}

async function postgres() {
  // Lazy connection: builds need no database credentials.
  remote ??= neon(process.env.DATABASE_URL!);
  const sql = remote;
  ready ??= sql
    .transaction([
      sql.query('SELECT pg_advisory_xact_lock(847295103)'),
      ...schema.map((text) => sql.query(text)),
    ])
    .catch((error: unknown) => {
      ready = undefined;
      throw error;
    });
  await ready;
  return sql;
}

// Only internal, parameterized statements use this adapter. Transactions keep
// password rotation/session revocation and calendar seeding atomic on both backends.
export async function transaction(statements: Statement[]): Promise<Row[][]> {
  if (usesPostgres()) {
    const sql = await postgres();
    return (await sql.transaction(
      statements.map(({ text, values = [] }) => {
        let position = 0;
        return sql.query(
          text.replace(/\?/g, () => `$${++position}`),
          values,
        );
      }),
    )) as Row[][];
  }
  const local = db();
  local.exec('BEGIN IMMEDIATE');
  try {
    const result = statements.map(({ text, values = [] }) =>
      local
        .prepare(text)
        .all(...values)
        .map((row) => ({ ...row })),
    );
    local.exec('COMMIT');
    return result;
  } catch (error) {
    local.exec('ROLLBACK');
    throw error;
  }
}
export async function query(text: string, values: Parameter[] = []) {
  return (await transaction([{ text, values }]))[0];
}

export async function getWeeks(): Promise<Week[]> {
  const statements = initialWeeks().map((w) => ({
    text: 'INSERT INTO weeks (start,"end",price,status,revision) VALUES (?,?,?,?,0) ON CONFLICT(start) DO NOTHING',
    values: [w.start, w.end, w.price, w.status],
  }));
  const result = await transaction([
    ...statements,
    {
      text: 'SELECT * FROM weeks WHERE start LIKE ? ORDER BY start',
      values: [`${seasonYear()}-%`],
    },
  ]);
  return result[result.length - 1] as unknown as Week[];
}
export async function getPublicWeeks() {
  return (await getWeeks()).map((week) => publicWeek(week));
}
export async function updateWeek(
  v: Pick<Week, 'start' | 'price' | 'status' | 'revision'>,
) {
  return (
    (
      await query(
        'UPDATE weeks SET price=?, status=?, revision=revision+1 WHERE start=? AND revision=? RETURNING start',
        [v.price, v.status, v.start, v.revision],
      )
    ).length === 1
  );
}
export async function consumeLimit(
  key: string,
  maximum: number,
  windowMs: number,
) {
  const now = Date.now();
  const result = await transaction([
    { text: 'DELETE FROM limits WHERE expires <= ?', values: [now] },
    {
      text: 'INSERT INTO limits (key,count,expires) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=limits.count+1 RETURNING count',
      values: [key, now + windowMs],
    },
  ]);
  return Number(result[1][0].count) <= maximum;
}
