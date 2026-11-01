import type { Metadata } from 'next';
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/400-italic.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import './globals.css';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: site.url,
  title: {
    default: `${site.name} — Les beaux jours`,
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>
        <a className="skip-link" href="#contenu">
          Aller au contenu
        </a>
        {children}
      </body>
    </html>
  );
}
