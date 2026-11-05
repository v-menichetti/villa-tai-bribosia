import { afterEach, describe, expect, it, vi } from 'vitest';
import { sameOrigin } from './http';
afterEach(() => vi.unstubAllEnvs());
const request = (origin: string, extra: Record<string, string> = {}) =>
  new Request('http://localhost:3000/api/admin/login', {
    headers: { origin, ...extra },
  });
describe('request origin behind Codespaces', () => {
  it('uses browser provenance across internal port rewrites and domain changes', () => {
    vi.stubEnv('CODESPACES', '');
    vi.stubEnv('NODE_ENV', 'production');
    for (const origin of [
      'https://glorious-succotash-77r7r7vjg6pcrjvp-3000.app.github.dev',
      'https://villa.example',
      'https://new-villa.example:8443',
    ]) {
      expect(
        sameOrigin(
          new Request('http://0.0.0.0:80/api/admin/login', {
            headers: { origin, 'sec-fetch-site': 'same-origin' },
          }),
        ),
      ).toBe(true);
    }
  });
  it('rejects cross-site and sibling-subdomain requests even if an origin fallback matches', () => {
    vi.stubEnv('NODE_ENV', 'development');
    for (const value of ['cross-site', 'same-site', 'none', 'invalid']) {
      expect(
        sameOrigin(
          request('http://localhost:3000', { 'sec-fetch-site': value }),
        ),
      ).toBe(false);
      expect(
        sameOrigin(
          request('https://attacker.invalid', { 'sec-fetch-site': value }),
        ),
      ).toBe(false);
    }
    for (const origin of [
      'null',
      'garbage',
      'https://villa.example/path',
      'https://name:secret@villa.example',
      'file:///tmp/test',
    ])
      expect(
        sameOrigin(request(origin, { 'sec-fetch-site': 'same-origin' })),
      ).toBe(false);
  });
  it('accepts this codespace HTTPS origin despite a localhost request URL', () => {
    vi.stubEnv('CODESPACES', 'true');
    vi.stubEnv('CODESPACE_NAME', 'villa-test-abc');
    vi.stubEnv('GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN', 'app.github.dev');
    vi.stubEnv('PORT', '3000');
    expect(
      sameOrigin(request('https://villa-test-abc-3000.app.github.dev')),
    ).toBe(true);
    vi.stubEnv('NODE_ENV', 'production');
    expect(
      sameOrigin(request('https://villa-test-abc-3000.app.github.dev')),
    ).toBe(true);
  });
  it('rejects other workspaces, ports, schemes and forged forwarded headers', () => {
    vi.stubEnv('CODESPACES', 'true');
    vi.stubEnv('CODESPACE_NAME', 'villa-test-abc');
    vi.stubEnv('GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN', 'app.github.dev');
    vi.stubEnv('PORT', '3000');
    for (const origin of [
      'https://other-3000.app.github.dev',
      'https://villa-test-abc-4000.app.github.dev',
      'http://villa-test-abc-3000.app.github.dev',
      'https://villa-test-abc-3000.app.github.dev.attacker.invalid',
      'null',
    ])
      expect(
        sameOrigin(
          request(origin, {
            'x-forwarded-host': new URL('https://attacker.invalid').host,
          }),
        ),
      ).toBe(false);
    expect(
      sameOrigin(
        request('https://attacker.invalid', {
          host: 'attacker.invalid',
          'x-forwarded-host': 'attacker.invalid',
        }),
      ),
    ).toBe(false);
  });
  it('keeps ordinary local checks and requires the Codespaces environment', () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('CODESPACES', '');
    expect(sameOrigin(request('http://localhost:3000'))).toBe(true);
    expect(
      sameOrigin(request('https://villa-test-abc-3000.app.github.dev')),
    ).toBe(false);
    expect(
      sameOrigin(new Request('http://localhost:3000/api/admin/login')),
    ).toBe(false);
  });
});
