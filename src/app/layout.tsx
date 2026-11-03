import type { Metadata } from 'next';
import '@fontsource/lora/400.css';
import '@fontsource/lora/500.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import './globals.css';
import { site } from '@/lib/site';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  metadataBase: site.url,
  title: {
    default: `${site.name} — Vacances à Grasse`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  robots: { index: site.indexable, follow: site.indexable },
  openGraph: {
    title: site.name,
    description: site.description,
    locale: 'fr_FR',
    type: 'website',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale =
    (await headers()).get('x-site-language') === 'en' ? 'en' : 'fr';
  return (
    <html lang={locale}>
      <body>
        <a className="skip-link" href="#contenu">
          {locale === 'fr' ? 'Aller au contenu' : 'Skip to content'}
        </a>
        {children}
      </body>
    </html>
  );
}
