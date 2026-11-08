# Deployment

Browser POST/PATCH requests use the browser-controlled `Sec-Fetch-Site: same-origin` signal for CSRF protection, so public-domain changes and reverse-proxy port rewrites do not block owner login. Cross-site and sibling-subdomain requests are rejected; a valid HTTP(S) Origin is also required. Password and session checks remain separate and mandatory. See [MDN Fetch Metadata](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Fetch_metadata).

Clients without Fetch Metadata fall back to exact-origin checks: Codespaces environment variables and the local port, or `SITE_URL` in production (the request origin in development). Keep `SITE_URL` updated for this fallback and public metadata. Arbitrary forwarded-host headers are never trusted. See [GitHub's environment-variable reference](https://docs.github.com/en/codespaces/developing-in-a-codespace/default-environment-variables-for-your-codespace).

Use a single Node 24 server with a persistent disk. Run `npm ci`, `npm run check`, `npm run build`, then `npm start`. Set `DATABASE_PATH` to an absolute path on the persistent disk, outside release directories. SQLite creates and seeds its schema automatically, without overwriting edited weeks.

## Vercel with Neon Postgres

Use the Next.js preset, Node 24, default build/output settings and the repository root. In the mother's Vercel project, open **Storage → Create Database → Neon**, create or select a database and connect it to this project for **Production**. Check Environment Variables for the server-only `DATABASE_URL` connection string supplied by Neon. If the integration uses a different prefix, add `DATABASE_URL` using the Neon connection string. Never use a `NEXT_PUBLIC_` prefix or commit this value.

Deploy the updated commit after connecting the database. Environment changes require a new deployment. Postgres tables initialize on first request, under a transaction-scoped advisory lock. The calendar, sessions, password hash and rate limits all share this persistent database. New seasons use insert-if-absent, preserving edits and previous seasons. No filesystem writes or temporary database fallback occur on Vercel. Missing `DATABASE_URL` produces an explicit configuration error.

Use separate Neon databases/branches for previews and development; do not let test deployments edit production availability. A new database starts with the default available season and bootstrap password: **existing SQLite records are not automatically migrated**. If local bookings or password changes must be retained, migrate all four tables before opening the public site, or re-enter and verify availability and change the password in `/admin`. Keep the original SQLite file backed up.

Before opening bookings, verify `/`, `/en`, availability, owner login, a week toggle reflected on the public calendar, password rotation and persistence after redeployment. Configure Neon backups/recovery according to the selected plan. Tests use embedded Postgres to exercise SQL and transactions; the live Neon connection must still be verified after provisioning.

Set `SITE_URL` to the exact public HTTPS origin and email variables from `.env.example`. HTTPS is required for production session cookies. Keep `SITE_INDEXABLE=false` until launch approval. Do not expose the database or environment files through the web server.

`TRUST_PROXY=true` is safe only when the reverse proxy replaces x-forwarded-for with the verified client address. Otherwise leave it false: abuse limits share a single bucket. Back up SQLite using SQLite's backup API or while the application is stopped; copying a live WAL database file alone is not a valid backup. Verify restoration before launch.

Change the bootstrap owner password in `/admin` → **Mot de passe** before public launch. Rotation requires the current password, writes a salted scrypt hash to the database and revokes previous sessions. The saved database hash takes precedence over `ADMIN_PASSWORD_HASH`; the environment only overrides the initial bootstrap hash. Preserve and back up the database, including its settings table, across deployments.

Confirm email delivery end to end with the owner before opening the form. Complete operator/hosting legal identity, privacy retention details, prices/fees/terms, and approve all photographs. No payment or automatic reservation is implemented.
