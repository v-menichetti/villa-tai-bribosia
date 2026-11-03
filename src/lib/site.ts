const siteUrl = new URL(process.env.SITE_URL || 'http://localhost:3000');
const indexable =
  process.env.SITE_INDEXABLE === 'true' &&
  siteUrl.protocol === 'https:' &&
  !['localhost', '127.0.0.1'].includes(siteUrl.hostname);

export const site = {
  name: 'Villa Tai Bribosia',
  description:
    'Une villa familiale au calme à Grasse Saint-Jacques. Quatre chambres, une piscine privée et trois terrasses pour savourer l’été.',
  url: siteUrl,
  indexable,
  contactEmail: process.env.CONTACT_EMAIL?.trim() || null,
};
