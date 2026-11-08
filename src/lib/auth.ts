import { createHash, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { cookies } from 'next/headers';
import { query, transaction } from './db';
const derive = promisify(scrypt);
export const cookieName = 'villa_session';
export const sessionSeconds = 60 * 60 * 24;
const digest = (value: string) =>
  createHash('sha256').update(value).digest('hex');
const bootstrapHash =
  'scrypt:36411989cee91376c80e4874fc3e4dd6:729e36d96aa7dc147de5637b6fe948c22b2bc214a6308c490b2b71fb184ff7b4106669a8796d35834697a8af7a26d003bfbf6fc64d04eaf8c333b1b14b765b60';
async function passwordHash() {
  const [saved] = await query(
    "SELECT value FROM settings WHERE key='admin-password'",
  );
  return String(
    saved?.value || process.env.ADMIN_PASSWORD_HASH || bootstrapHash,
  );
}
export async function adminConfigured() {
  return /^scrypt:[a-f0-9]{32}:[a-f0-9]{128}$/.test(await passwordHash());
}
export async function verifyPassword(password: string) {
  if (password.length > 256) return false;
  const stored = await passwordHash();
  if (!/^scrypt:[a-f0-9]{32}:[a-f0-9]{128}$/.test(stored)) return false;
  const [, salt, hash] = stored.split(':');
  const actual = (await derive(password, salt, 64)) as Buffer;
  return timingSafeEqual(actual, Buffer.from(hash, 'hex'));
}
export async function changePassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const hash = (await derive(password, salt, 64)) as Buffer;
  await transaction([
    {
      text: "INSERT INTO settings (key,value) VALUES ('admin-password',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",
      values: [`scrypt:${salt}:${hash.toString('hex')}`],
    },
    { text: 'DELETE FROM sessions' },
  ]);
}
export async function createSession() {
  const token = randomBytes(32).toString('hex');
  await transaction([
    { text: 'DELETE FROM sessions WHERE expires <= ?', values: [Date.now()] },
    {
      text: 'INSERT INTO sessions (token,expires) VALUES (?,?)',
      values: [digest(token), Date.now() + sessionSeconds * 1000],
    },
  ]);
  return token;
}
export async function authenticated() {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return false;
  return (
    (
      await query('SELECT token FROM sessions WHERE token=? AND expires>?', [
        digest(token),
        Date.now(),
      ])
    ).length > 0
  );
}
export async function endSession() {
  const token = (await cookies()).get(cookieName)?.value;
  if (token) await query('DELETE FROM sessions WHERE token=?', [digest(token)]);
}
