import { PGlite } from '@electric-sql/pglite';
import { afterAll, beforeAll, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({ token: '' }));
vi.mock('next/headers', () => ({
  cookies: async () => ({ get: () => ({ value: state.token }) }),
}));
const pg = new PGlite();
// Exercise production SQL with a real Postgres engine. Only the HTTP transport
// and advisory lock (not supported by embedded Postgres) are replaced here.
vi.mock('@neondatabase/serverless', () => ({
  neon: () => ({
    query: (text: string, values: unknown[] = []) => ({ text, values }),
    transaction: (statements: { text: string; values: unknown[] }[]) =>
      pg.transaction(async (tx) => {
        const results = [];
        for (const statement of statements) {
          results.push(
            statement.text.includes('pg_advisory_xact_lock')
              ? []
              : (await tx.query(statement.text, statement.values)).rows,
          );
        }
        return results;
      }),
  }),
}));

beforeAll(async () => {
  await pg.waitReady;
  vi.stubEnv('VERCEL', '1');
  vi.stubEnv('DATABASE_URL', 'postgresql://test.invalid/test');
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-11-08T12:00:00Z'));
});
afterAll(async () => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  await pg.close();
});
it('never falls back to a local file on Vercel without DATABASE_URL', async () => {
  const { getWeeks } = await import('./db');
  vi.stubEnv('DATABASE_URL', '');
  try {
    await expect(getWeeks()).rejects.toThrow(
      'DATABASE_URL is required on Vercel',
    );
  } finally {
    vi.stubEnv('DATABASE_URL', 'postgresql://test.invalid/test');
  }
});
it('persists weeks and credentials across new server instances; rolls back failures', async () => {
  let storage = await import('./db');
  let auth = await import('./auth');
  const week = (await storage.getWeeks())[0];
  expect(
    await storage.updateWeek({ ...week, status: 'booked', price: 1100 }),
  ).toBe(true);
  expect(await storage.updateWeek({ ...week, status: 'available' })).toBe(
    false,
  );
  state.token = await auth.createSession();
  const oldToken = state.token;
  await auth.changePassword('test-postgres-password');
  expect(await auth.authenticated()).toBe(false);
  state.token = await auth.createSession();
  vi.resetModules();
  storage = await import('./db');
  auth = await import('./auth');
  expect(await auth.verifyPassword('test-postgres-password')).toBe(true);
  expect(await auth.authenticated()).toBe(true);
  state.token = oldToken;
  expect(await auth.authenticated()).toBe(false);
  expect((await storage.getPublicWeeks())[0]).toMatchObject({
    status: 'unavailable',
  });
  expect((await storage.getWeeks())[0]).toMatchObject({
    price: 1100,
    status: 'booked',
    revision: 1,
  });
  await expect(
    storage.transaction([
      { text: 'DELETE FROM weeks' },
      { text: 'INSERT INTO nonexistent_table VALUES (1)' },
    ]),
  ).rejects.toThrow();
  expect((await storage.getWeeks())[0].status).toBe('booked');
  expect(await storage.consumeLimit('test', 1, 1000)).toBe(true);
  expect(await storage.consumeLimit('test', 1, 1000)).toBe(false);
  vi.setSystemTime(new Date('2026-11-08T12:00:02Z'));
  expect(await storage.consumeLimit('test', 1, 1000)).toBe(true);
  vi.setSystemTime(new Date('2027-10-01T12:00:00Z'));
  expect(
    (await storage.getWeeks()).every(
      (w) => w.start.startsWith('2028') && w.status === 'available',
    ),
  ).toBe(true);
  expect(
    await storage.query('SELECT status FROM weeks WHERE start=?', [week.start]),
  ).toEqual([{ status: 'booked' }]);
});
