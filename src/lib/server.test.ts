import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { scryptSync } from 'node:crypto';
const state = vi.hoisted(() => ({ token: '' }));
vi.mock('next/headers', () => ({
  cookies: async () => ({
    get: () => (state.token ? { value: state.token } : undefined),
  }),
}));
import { db, getWeeks } from './db';
import { authenticated } from './auth';
import { POST as login } from '@/app/api/admin/login/route';
import { POST as logout } from '@/app/api/admin/logout/route';
import { PATCH as update } from '@/app/api/admin/weeks/route';
import { POST as contact } from '@/app/api/contact/route';
const dir = mkdtempSync(join(tmpdir(), 'villa-test-'));
const password = 'test-only-not-a-real-credential';
function request(
  path: string,
  body: unknown,
  origin = 'http://localhost:3000',
  method = 'POST',
) {
  return new Request('http://localhost:3000' + path, {
    method,
    headers: { origin, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}
beforeAll(() => {
  vi.stubEnv('DATABASE_PATH', join(dir, 'test.sqlite'));
  const salt = '0123456789abcdef0123456789abcdef';
  vi.stubEnv(
    'ADMIN_PASSWORD_HASH',
    `scrypt:${salt}:${scryptSync(password, salt, 64).toString('hex')}`,
  );
});
beforeEach(() => {
  state.token = '';
  db().exec('DELETE FROM sessions; DELETE FROM limits');
  vi.unstubAllGlobals();
});
afterAll(() => {
  db().close();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  rmSync(dir, { recursive: true, force: true });
});
describe('protected owner calendar', () => {
  it('rejects unauthenticated edits and cross-origin login', async () => {
    expect(
      (
        await update(
          request('/api/admin/weeks', getWeeks()[0], undefined, 'PATCH'),
        )
      ).status,
    ).toBe(401);
    expect(
      (
        await login(
          request('/api/admin/login', { password }, 'https://attacker.invalid'),
        )
      ).status,
    ).toBe(403);
  });
  it('persists edits, prevents stale overwrites and invalidates the session on logout', async () => {
    const response = await login(request('/api/admin/login', { password }));
    expect(response.status).toBe(200);
    state.token = response.cookies.get('villa_session')!.value;
    expect(await authenticated()).toBe(true);
    const week = getWeeks()[0];
    const body = { ...week, status: 'available', price: 1050 };
    expect(
      (await update(request('/api/admin/weeks', body, undefined, 'PATCH')))
        .status,
    ).toBe(200);
    expect(getWeeks()[0]).toMatchObject({
      status: 'available',
      price: 1050,
      revision: 1,
    });
    expect(
      (await update(request('/api/admin/weeks', body, undefined, 'PATCH')))
        .status,
    ).toBe(409);
    await logout(request('/api/admin/logout', {}));
    expect(await authenticated()).toBe(false);
  });
  it('throttles repeated password attempts', async () => {
    for (let i = 0; i < 5; i++)
      expect(
        (await login(request('/api/admin/login', { password: 'wrong' })))
          .status,
      ).toBe(401);
    expect(
      (await login(request('/api/admin/login', { password }))).status,
    ).toBe(429);
  });
});
describe('mail delivery', () => {
  const enquiry = {
    name: 'Test Visitor',
    email: 'visitor@example.invalid',
    phone: '',
    arrival: '',
    departure: '',
    adults: 2,
    children: 0,
    message: 'A question about the villa.',
    website: '',
    locale: 'fr',
  };
  it('never reports success without configuration, or when the provider fails', async () => {
    vi.stubEnv('RESEND_API_KEY', '');
    expect((await contact(request('/api/contact', enquiry))).status).toBe(503);
    vi.stubEnv('RESEND_API_KEY', 'test-not-real');
    vi.stubEnv('CONTACT_EMAIL', 'owner@example.invalid');
    vi.stubEnv('MAIL_FROM', 'Villa <test@example.invalid>');
    const send = vi.fn().mockResolvedValue(new Response('{}', { status: 500 }));
    vi.stubGlobal('fetch', send);
    expect((await contact(request('/api/contact', enquiry))).status).toBe(502);
    send.mockResolvedValue(new Response('{"id":"test"}', { status: 200 }));
    expect((await contact(request('/api/contact', enquiry))).status).toBe(200);
    expect(JSON.parse(send.mock.calls[0][1].body)).toMatchObject({
      to: ['owner@example.invalid'],
      reply_to: 'visitor@example.invalid',
    });
  });
  it('blocks honeypots and newly unavailable dates before sending', async () => {
    expect(
      (await contact(request('/api/contact', { ...enquiry, website: 'spam' })))
        .status,
    ).toBe(400);
    db()
      .prepare('UPDATE weeks SET status=? WHERE start=?')
      .run('booked', '2027-07-17');
    expect(
      (
        await contact(
          request('/api/contact', {
            ...enquiry,
            arrival: '2027-07-17',
            departure: '2027-07-24',
          }),
        )
      ).status,
    ).toBe(409);
  });
});
