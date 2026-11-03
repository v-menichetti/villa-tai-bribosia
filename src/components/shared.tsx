import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sprout } from 'lucide-react';
import { paths, type Locale } from '@/lib/i18n';
export function Photo({
  id,
  alt,
  className = '',
  priority = false,
}: {
  id: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={`photo ${className}`}>
      <Image
        src={`/images/${id}.webp`}
        alt={alt}
        fill
        sizes="(max-width: 700px) 100vw, (max-width: 1100px) 70vw, 1200px"
        priority={priority}
      />
    </div>
  );
}
export function TextLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link className="text-link" href={href}>
      {children}
      <ArrowRight size={18} aria-hidden="true" />
    </Link>
  );
}
export function ContactBanner({ locale }: { locale: Locale }) {
  return (
    <section className="contact-banner">
      <Sprout className="banner-sprout" aria-hidden="true" />
      <h2>
        {locale === 'fr' ? 'Parlons de votre séjour' : 'Let’s plan your stay'}
      </h2>
      <Link className="button light" href={paths[locale].contact}>
        {locale === 'fr' ? 'Contacter la propriétaire' : 'Contact the owner'}
      </Link>
    </section>
  );
}
export function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="site-footer">
      <Link className="footer-brand" href={paths[locale].home}>
        Villa Tai Bribosia
      </Link>
      <span>
        Grasse Saint-Jacques ·{' '}
        {locale === 'fr' ? 'Location estivale' : 'Summer stays'}
      </span>
      <Link href={paths[locale].privacy}>
        {locale === 'fr' ? 'Confidentialité & crédits' : 'Privacy & credits'}
      </Link>
    </footer>
  );
}
export function PageIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="page-intro container">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {children && <p className="lead">{children}</p>}
    </div>
  );
}
