# Design & assets

The selected reference is [approved-homepage.jpeg](design/approved-homepage.jpeg), supplied and approved on 1 November 2026.

## Visual language

- Immersive pool hero, white editorial headline “Les beaux jours.” and a quiet transparent header.
- Riviera blue `#163DCC`, warm ivory `#FAF6E9`, lemon yellow `#FFF36E` and deep text `#18332E`.
- Cormorant Garamond regular/italic and DM Sans are bundled locally as starting typefaces. Tune weight, proportions and spacing against the approved image.
- Strong scale contrast; large photographs; asymmetrical house composition with an inset bedroom image; a photographic row for the surroundings.
- Restrained motion that respects `prefers-reduced-motion`. Preserve keyboard navigation and readable contrast over photography.
- Desktop and mobile need deliberate compositions, not simply scaled screenshots.

## What the starter implements

Shared palette and typefaces, navigation, section order, French copy, rates, metadata and responsive layouts. It deliberately uses a simple teal hero background until real photography is available. It is not the final visual implementation.

## Image provenance

The approved image is an AI-generated mockup. Even the views inspired by the real house were reinterpreted. It must stay a reference in `docs/design`, not be presented as a real photograph or sliced into production assets.

Originals needed: pool and deck, exterior, all terraces, garden, four bedrooms, living room, kitchen, two bathrooms. Ask for original files rather than thumbnails or WhatsApp-compressed copies. Keep the property’s true dimensions, fittings and appearance.

For the surroundings, use owned/licensed photography of Grasse, Mandelieu-La Napoule and Gourdon. Previous concept sources were the official tourism/municipal pages; their commercial image licences were not established. Do not hotlink or republish those assets without rights confirmation.

Store final web assets under `public/images/` with meaningful names and documented source, credit, permission and alt text. Use responsive Next.js Image sizes and appropriate compression. Never commit private metadata or precise location details without review.

## Content model

Keep factual details in `src/content/villa.ts`; 2027 pricing is in `src/content/rates.ts`. Unknown capacity is `null`. The August gap has a `null` price and all availability is `unconfirmed`. Contact is optional environment configuration.
