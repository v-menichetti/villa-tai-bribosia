'use client';
import { BrandMark } from './brand-mark';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { paths, labels, type Locale, type PageKey } from '@/lib/i18n';
export function SiteHeader({
  locale,
  page,
}: {
  locale: Locale;
  page: PageKey;
}) {
  const [open, setOpen] = useState(false);
  const search = useSearchParams();
  const query = new URLSearchParams();
  for (const key of ['arrival', 'departure']) {
    const v = search.get(key);
    if (v && /^\d{4}-\d{2}-\d{2}$/.test(v)) query.set(key, v);
  }
  const suffix = query.size ? '?' + query.toString() : '';
  const items: PageKey[] = [
    'house',
    'photos',
    'area',
    'availability',
    'contact',
  ];
  return (
    <header className="site-header">
      <Link
        className="brand"
        href={paths[locale].home}
        aria-label="Villa Tai Bribosia"
      >
        <BrandMark />
        <span>Villa Tai Bribosia</span>
      </Link>
      <nav
        className="desktop-nav"
        aria-label={
          locale === 'fr' ? 'Navigation principale' : 'Main navigation'
        }
      >
        {items.map((key) => (
          <Link
            key={key}
            href={paths[locale][key]}
            aria-current={page === key ? 'page' : undefined}
          >
            {labels[locale][key]}
          </Link>
        ))}
      </nav>
      <div className="header-actions">
        <div
          className="languages"
          aria-label={locale === 'fr' ? 'Langue' : 'Language'}
        >
          {(['fr', 'en'] as const).map((l) => (
            <a
              key={l}
              href={paths[l][page] + suffix}
              lang={l}
              hrefLang={l}
              aria-current={locale === l ? 'true' : undefined}
            >
              {l.toUpperCase()}
            </a>
          ))}
        </div>
        <Link className="button header-cta" href={paths[locale].availability}>
          {locale === 'fr' ? 'Préparer mon séjour' : 'Plan my stay'}
        </Link>
        <button
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={
            open
              ? locale === 'fr'
                ? 'Fermer le menu'
                : 'Close menu'
              : locale === 'fr'
                ? 'Ouvrir le menu'
                : 'Open menu'
          }
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav id="mobile-menu" className="mobile-nav">
          {items.map((key) => (
            <Link
              key={key}
              href={paths[locale][key]}
              onClick={() => setOpen(false)}
            >
              {labels[locale][key]}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
