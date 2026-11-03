# Deployment

Use a single Node 24 server with a persistent disk. Run `npm ci`, `npm run check`, `npm run build`, then `npm start`. Set `DATABASE_PATH` to an absolute path on the persistent disk, outside release directories. SQLite creates and seeds its schema automatically, without overwriting edited weeks.

This implementation is **not suitable for ephemeral serverless filesystems or horizontally replicated instances**. Migrate the database/session/rate-limit adapter before using such hosting. No production infrastructure is provisioned.

Set `SITE_URL` to the exact public HTTPS origin, `ADMIN_PASSWORD_HASH`, and email variables from `.env.example`. HTTPS is required for production session cookies. Keep `SITE_INDEXABLE=false` until launch approval. Do not expose the database or environment files through the web server.

`TRUST_PROXY=true` is safe only when the reverse proxy replaces x-forwarded-for with the verified client address. Otherwise leave it false: abuse limits share a single bucket. Back up SQLite using SQLite's backup API or while the application is stopped; copying a live WAL database file alone is not a valid backup. Verify restoration before launch.

Owner password setup: `node scripts/admin-password.mjs`. Store the printed password privately and the hash only in server configuration. To revoke all sessions on password rotation, stop the app, delete rows from `sessions`, then restart with the new hash.

Confirm email delivery end to end with the owner before opening the form. Complete operator/hosting legal identity, privacy retention details, prices/fees/terms, and approve all photographs. No payment or automatic reservation is implemented.
