# Deployment

Codespaces forwarded-port origins are recognised automatically using `CODESPACES`, `CODESPACE_NAME`, `GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN` and the local port. This fixes owner login returning “Origine non autorisée” when HTTPS forwarding reaches the local HTTP server. Only the exact workspace/port origin is accepted; arbitrary forwarded-host headers are not trusted. Outside Codespaces, production still requires `SITE_URL` to match the public origin. See [GitHub's environment-variable reference](https://docs.github.com/en/codespaces/developing-in-a-codespace/default-environment-variables-for-your-codespace).

Use a single Node 24 server with a persistent disk. Run `npm ci`, `npm run check`, `npm run build`, then `npm start`. Set `DATABASE_PATH` to an absolute path on the persistent disk, outside release directories. SQLite creates and seeds its schema automatically, without overwriting edited weeks.

This implementation is **not suitable for ephemeral serverless filesystems or horizontally replicated instances**. Migrate the database/session/rate-limit adapter before using such hosting. No production infrastructure is provisioned.

Set `SITE_URL` to the exact public HTTPS origin and email variables from `.env.example`. HTTPS is required for production session cookies. Keep `SITE_INDEXABLE=false` until launch approval. Do not expose the database or environment files through the web server.

`TRUST_PROXY=true` is safe only when the reverse proxy replaces x-forwarded-for with the verified client address. Otherwise leave it false: abuse limits share a single bucket. Back up SQLite using SQLite's backup API or while the application is stopped; copying a live WAL database file alone is not a valid backup. Verify restoration before launch.

Change the bootstrap owner password in `/admin` → **Mot de passe** before public launch. Rotation requires the current password, writes a salted scrypt hash to SQLite and revokes previous sessions. The saved database hash takes precedence over `ADMIN_PASSWORD_HASH`; the environment only overrides the initial bootstrap hash. Preserve and back up the database, including its settings table, across deployments.

Confirm email delivery end to end with the owner before opening the form. Complete operator/hosting legal identity, privacy retention details, prices/fees/terms, and approve all photographs. No payment or automatic reservation is implemented.
