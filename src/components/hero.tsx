import Image from 'next/image';
import Link from 'next/link';
import { paths, type Locale } from '@/lib/i18n';
export function Hero({ locale }: { locale: Locale }) {
  const fr = locale === 'fr';
  return (
    <section
      className="hero"
      aria-label={fr ? 'La villa et sa piscine' : 'The villa and its pool'}
    >
      <Image
        className="hero-image is-active"
        src="/images/pool-clear-hero.webp"
        alt={
          fr
            ? 'La villa et sa piscine privée'
            : 'The villa and its private pool'
        }
        fill
        sizes="100vw"
        priority
      />
      <div className="hero-shade" />
      <div className="hero-copy">
        <p className="eyebrow">Grasse Saint-Jacques · Côte d’Azur</p>
        <h1>
          {fr ? (
            <>
              Vos vacances au calme,
              <br />
              près de la mer et de la montagne.
            </>
          ) : (
            <>
              A peaceful holiday,
              <br />
              close to the sea and mountains.
            </>
          )}
        </h1>
        <p>
          {fr
            ? 'Une villa pour 10 personnes avec piscine privée.'
            : 'A villa for 10 guests with a private pool.'}
        </p>
        <Link className="button glass" href={paths[locale].house}>
          {fr ? 'Découvrir la maison' : 'Discover the villa'}
        </Link>
      </div>
    </section>
  );
}
