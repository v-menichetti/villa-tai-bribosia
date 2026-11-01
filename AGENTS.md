# Les Jours de Grasse

Read `README.md`, `docs/DESIGN.md` and `docs/ROADMAP.md` before changing the project.

## Scope and design

- The approved visual source is `docs/design/approved-homepage.jpeg`: “Les beaux jours”, turquoise photography, cobalt blue, warm ivory and lemon yellow. Preserve this direction; the other concepts were not selected.
- This repository is a development foundation. Do not describe its initial homepage as the finished photographic implementation.
- French visitor-facing copy; English code identifiers and repository documentation.
- Images in the approved mockup are generated or reinterpreted. They are design references, not verified photographs of the rental. Do not extract them and market them as real photos.
- Unknown data stays unknown. Never infer availability from a price, maximum guests from bed count, or a 7–21 August tariff from neighbouring weeks.

## Engineering

- Node 24, npm 11; use the committed npm lockfile and `npm ci`.
- Next.js App Router, strict TypeScript, Server Components by default. Add client boundaries only for actual interaction.
- Business content belongs in `src/content`, site configuration in `src/lib/site.ts`, shared tokens in `src/app/globals.css`.
- Keep native navigation, visible keyboard focus, semantic headings, meaningful image alternatives and reduced-motion support.
- Do not add a database, authentication, payments, CMS, analytics or external mail delivery before the feature needs them.
- Never commit credentials, `.env.local`, `.next`, dependencies or owner contact details that have not been approved for publication.
- Local development and build require no Vercel account or secrets.
- Keep indexing disabled until the launch checklist is complete.

## Verification

Run `npm run check` and `npm run build` before handing off changes. Check desktop and mobile for layout changes. Report unrun or failed checks honestly.
