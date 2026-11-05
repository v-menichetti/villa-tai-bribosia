import { createHash } from 'node:crypto';
import { site } from './site';
export function sameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin || origin === 'null') return false;
  try {
    const parsed = new URL(origin);
    if (
      !['http:', 'https:'].includes(parsed.protocol) ||
      parsed.origin !== origin
    )
      return false;
  } catch {
    return false;
  }
  // Browser-controlled Fetch Metadata describes the PUBLIC origin relationship,
  // unaffected by reverse-proxy rewrites, port mappings or domain changes.
  // Web page JavaScript cannot set Sec-* headers. Never accept same-site here:
  // another subdomain must not be able to submit owner operations.
  const fetchSite = request.headers.get('sec-fetch-site');
  if (fetchSite === 'same-origin') return true;
  if (fetchSite !== null) return false;
  // Older clients without Fetch Metadata retain the explicit-origin checks.
  const local = new URL(request.url);
  // Codespaces terminates HTTPS before forwarding to the local Next server.
  // Derive the exact trusted public host from platform environment variables,
  // never from caller-controlled Host or X-Forwarded-Host headers.
  const name = process.env.CODESPACE_NAME;
  const domain = process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN;
  const port = process.env.PORT || local.port || '3000';
  if (
    process.env.CODESPACES === 'true' &&
    name &&
    /^[a-z0-9-]+$/.test(name) &&
    domain &&
    /^[a-z0-9.-]+$/.test(domain) &&
    /^\d+$/.test(port) &&
    Number(port) > 0 &&
    Number(port) <= 65535 &&
    origin === `https://${name}-${port}.${domain}`
  )
    return true;
  return (
    origin ===
    (process.env.NODE_ENV === 'production' ? site.url.origin : local.origin)
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
