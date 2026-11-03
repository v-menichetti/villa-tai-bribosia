export type Locale = 'fr' | 'en';
export type PageKey =
  'home' | 'house' | 'photos' | 'area' | 'availability' | 'contact' | 'privacy';
export const paths: Record<Locale, Record<PageKey, string>> = {
  fr: {
    home: '/',
    house: '/la-maison',
    photos: '/photos',
    area: '/alentours',
    availability: '/disponibilites',
    contact: '/contact',
    privacy: '/confidentialite',
  },
  en: {
    home: '/en',
    house: '/en/the-villa',
    photos: '/en/photos',
    area: '/en/explore',
    availability: '/en/availability',
    contact: '/en/contact',
    privacy: '/en/privacy',
  },
};
export const labels: Record<Locale, Record<PageKey, string>> = {
  fr: {
    home: 'Accueil',
    house: 'La maison',
    photos: 'Photos',
    area: 'Les alentours',
    availability: 'Disponibilités',
    contact: 'Contact',
    privacy: 'Confidentialité',
  },
  en: {
    home: 'Home',
    house: 'The villa',
    photos: 'Photos',
    area: 'Explore',
    availability: 'Availability',
    contact: 'Contact',
    privacy: 'Privacy',
  },
};
export function resolvePage(
  slug: string[] = [],
): { locale: Locale; page: PageKey } | null {
  const path = '/' + slug.join('/');
  for (const locale of ['fr', 'en'] as const)
    for (const page of Object.keys(paths[locale]) as PageKey[])
      if (paths[locale][page] === path) return { locale, page };
  return null;
}
export function dateLabel(
  value: string,
  locale: Locale,
  options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' },
) {
  return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-GB', {
    ...options,
    timeZone: 'UTC',
  }).format(new Date(value + 'T12:00:00Z'));
}
export function priceLabel(value: number | null, locale: Locale) {
  return value === null
    ? locale === 'fr'
      ? 'Nous consulter'
      : 'Please enquire'
    : new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-GB', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
      }).format(value);
}
