import { createHash, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { cookies } from 'next/headers';
import { db } from './db';
const derive = promisify(scrypt);
export const cookieName = 'villa_session';
export const sessionSeconds = 60 * 60 * 24;
const digest = (value: string) =>
  createHash('sha256').update(value).digest('hex');
export function adminConfigured() {
  return /^scrypt:[a-f0-9]{32}:[a-f0-9]{128}$/.test(
    process.env.ADMIN_PASSWORD_HASH || '',
  );
}
export async function verifyPassword(password: string) {
  if (!adminConfigured() || password.length > 256) return false;
  const [, salt, hash] = process.env.ADMIN_PASSWORD_HASH!.split(':');
  const actual = (await derive(password, salt, 64)) as Buffer;
  return timingSafeEqual(actual, Buffer.from(hash, 'hex'));
}
export function createSession() {
  const token = randomBytes(32).toString('hex');
  db().prepare('DELETE FROM sessions WHERE expires <= ?').run(Date.now());
  db()
    .prepare('INSERT INTO sessions (token,expires) VALUES (?,?)')
    .run(digest(token), Date.now() + sessionSeconds * 1000);
  return token;
}
export async function authenticated() {
  if (!adminConfigured()) return false;
  const token = (await cookies()).get(cookieName)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return false;
  return Boolean(
    db()
      .prepare('SELECT token FROM sessions WHERE token=? AND expires>?')
      .get(digest(token), Date.now()),
  );
}
export async function endSession() {
  const token = (await cookies()).get(cookieName)?.value;
  if (token)
    db().prepare('DELETE FROM sessions WHERE token=?').run(digest(token));
}
