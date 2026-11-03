import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { Footer } from '@/components/shared';
import { PublicPage } from '@/components/public-pages';
import { getPublicWeeks } from '@/lib/db';
import { emailConfigured } from '@/lib/enquiry';
import { labels, paths, resolvePage } from '@/lib/i18n';
export const dynamic = 'force-dynamic';
type Props = {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const current = resolvePage((await params).slug);
  if (!current) return {};
  const { locale, page } = current;
  return {
    title:
      page === 'home'
        ? locale === 'fr'
          ? 'Villa Tai Bribosia — Vos vacances à Grasse'
          : 'Villa Tai Bribosia — Your holiday in Grasse'
        : labels[locale][page],
    description:
      locale === 'fr'
        ? 'Une villa familiale au calme à Grasse Saint-Jacques. 10 personnes, 4 chambres, piscine privée et terrasses. Découvrez la maison et préparez votre été 2027.'
        : 'A peaceful family villa in Grasse Saint-Jacques. 10 guests, 4 bedrooms, a private pool and terraces. Explore the villa and plan your summer 2027.',
    alternates: {
      canonical: paths[locale][page],
      languages: {
        fr: paths.fr[page],
        en: paths.en[page],
        'x-default': paths.fr[page],
      },
    },
    openGraph: {
      locale: locale === 'fr' ? 'fr_FR' : 'en_GB',
      images: [{ url: '/images/pool.webp' }],
    },
  };
}
export default async function Page({ params, searchParams }: Props) {
  const [route, query] = await Promise.all([params, searchParams]);
  const current = resolvePage(route.slug);
  if (!current) notFound();
  const { locale, page } = current;
  return (
    <>
      <SiteHeader key={locale + page} locale={locale} page={page} />
      <main id="contenu">
        <PublicPage
          locale={locale}
          page={page}
          weeks={getPublicWeeks()}
          arrival={
            typeof query.arrival === 'string' ? query.arrival : undefined
          }
          departure={
            typeof query.departure === 'string' ? query.departure : undefined
          }
          mailReady={emailConfigured()}
        />
      </main>
      <Footer locale={locale} />
    </>
  );
}
