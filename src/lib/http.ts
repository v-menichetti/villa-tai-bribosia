import { createHash } from 'node:crypto';
import { site } from './site';
export function sameOrigin(request: Request) {
  return (
    request.headers.get('origin') ===
    (process.env.NODE_ENV === 'production'
      ? site.url.origin
      : new URL(request.url).origin)
  );
}
export function clientKey(request: Request) {
  // Enable only behind a proxy that replaces, rather than appends, this header.
  const ip =
    process.env.TRUST_PROXY === 'true'
      ? request.headers.get('x-forwarded-for')?.split(',')[0].trim()
      : 'shared';
  return createHash('sha256')
    .update(ip || 'shared')
    .digest('hex');
}
export async function readJson(request: Request): Promise<unknown> {
  const reader = request.body?.getReader();
  if (!reader) throw new Error('Empty body');
  let size = 0;
  const parts: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > 16000) {
      await reader.cancel();
      throw new Error('Body too large');
    }
    parts.push(value);
  }
  return JSON.parse(Buffer.concat(parts).toString('utf8'));
}
