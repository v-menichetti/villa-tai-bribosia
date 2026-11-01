# Deployment

No public deployment or Vercel project has been created during repository setup.

The app uses standard Next.js conventions. A future Vercel import can use the repository root, framework preset Next.js, Node 24, install command `npm ci` and build command `npm run build`. npm 11 is required by the project; ensure the build image uses that major, or set installation to `npx --yes npm@11 ci` and use `npx --yes npm@11 run build` for the build command.

Before deploying publicly, complete `ROADMAP.md`, set `SITE_URL` to the final HTTPS domain and confirm `CONTACT_EMAIL`. Keep `SITE_INDEXABLE=false` for previews and until launch approval. Turn it on only in the production environment once ready.

There are currently no database migrations, authentication secrets, upload credentials or mail-service keys. Add server-only secrets when the corresponding integration is implemented; do not prefix them with `NEXT_PUBLIC_`.

The optional contact link uses `mailto:`. It does not guarantee delivery or save any enquiry. A real server-backed enquiry form is a later milestone.

Do not add a made-up public URL, placeholder legal identity, fabricated ratings or unverified accommodation structured data.
