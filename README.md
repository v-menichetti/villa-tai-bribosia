# Villa Tai Bribosia

**Family holidays, a peaceful home in Grasse.**

A summer rental website for Villa Tai Bribosia in Grasse Saint-Jacques: real house photographs, four bedrooms, a private pool and space for up to ten guests.

## Experience

The approved sand-and-olive design pairs locally bundled Lora and DM Sans with original property photography. The site includes home, villa details, a filterable full-screen gallery, nearby places, weekly availability and contact. French is the default; English is available throughout, preserving selected stay dates.

![Approved design reference](docs/design/approved-sand-olive.png)

## Current status

Implemented and ready for local review; not publicly deployed. At the owner’s request, every new season starts available. The calendar runs from the first Saturday in June through the week beginning on the second Saturday in September. On October 1 (Europe/Paris), the website automatically opens the following year without overwriting existing seasons or edits. Started weeks are no longer bookable. The two weeks from 7 to 21 August have no supplied rate.

The protected `/admin` lets the owner change weekly status and price. SQLite persists changes and revision checks prevent stale edits. Public visitors never see private booking reasons. Contact delivery uses Resend when configured; missing configuration returns an honest error and never displays a fabricated success.

## Run locally

Node 24 and npm 11 are required.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Copy `.env.example` to `.env.local` to configure services. Browsing requires no credentials.

## Owner access and email

Visit `/admin` and use the initial password supplied by the owner in the project conversation. Only its scrypt hash is bundled server-side. An optional `ADMIN_PASSWORD_HASH` overrides this bootstrap value until the first password change. Use the **Mot de passe** tab to change it before public launch. The new salted hash is stored in SQLite, takes precedence over the environment, and revokes old sessions. Sessions expire after 24 hours. Preserve the persistent database across deployments; never expose the initial password in public UI or docs.

For email, configure `RESEND_API_KEY`, a verified-domain `MAIL_FROM`, and the owner's `CONTACT_EMAIL`. Never commit these values. The implementation sends plain-text enquiries with the visitor as Reply-To; confirmation remains manual.

## Hosting

**This version requires one Node 24 server with a persistent disk for SQLite.** It must not be deployed unchanged to ephemeral Vercel/serverless storage or multiple replicas. See [deployment](docs/DEPLOYMENT.md). Hosting and mail services have not been provisioned.

## Quality

```sh
npm run check
npm run build
```

Checks cover lint, strict TypeScript, formatting, source rates, week boundaries, guest/date validation, authentication, rate limiting, persistent edits, stale-write protection and mocked email success/failure. No test sends real mail.

Stack: Next.js 16, React 19, TypeScript, Lucide, local fonts, Sharp/WebP and Node SQLite. Search indexing is disabled until launch. See [design](docs/DESIGN.md), [roadmap](docs/ROADMAP.md) and [photo provenance](public/images/README.md).

Designed & developed by **Nolhan Colas**. No open-source licence is granted for this repository; third-party photographs retain their stated licences.
