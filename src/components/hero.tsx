'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { paths, type Locale } from '@/lib/i18n';
const slides = ['pool', 'terrace', 'terrace-lounge', 'facade'];
export function Hero({ locale }: { locale: Locale }) {
  const [index, setIndex] = useState(0);
  const fr = locale === 'fr';
  return (
    <section
      className="hero"
      aria-label={
        fr ? 'Découvrez la villa en images' : 'Discover the villa in pictures'
      }
    >
      <Image
        key={index}
        className="hero-image"
        src={`/images/${slides[index]}.webp`}
        alt={
          fr
            ? [
                'La piscine privée dans son écrin de verdure',
                'La terrasse et son espace repas',
                'Le salon de jardin',
                'La façade de la villa',
              ][index]
            : [
                'The private pool surrounded by greenery',
                'The terrace and dining area',
                'The garden lounge',
                'The villa exterior',
              ][index]
        }
        fill
        sizes="100vw"
        priority={index === 0}
      />
      <div className="hero-shade" />
      <div className="hero-copy">
        <p className="eyebrow">Grasse Saint-Jacques · Côte d’Azur</p>
        <h1>
          {fr ? (
            <>
              Vos vacances en famille,
              <br />
              au calme à Grasse.
            </>
          ) : (
            <>
              Family holidays,
              <br />a peaceful home in Grasse.
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
      <button
        className="hero-arrow previous"
        aria-label={fr ? 'Photo précédente' : 'Previous photo'}
        onClick={() => setIndex((index + slides.length - 1) % slides.length)}
      >
        <ChevronLeft />
      </button>
      <button
        className="hero-arrow next"
        aria-label={fr ? 'Photo suivante' : 'Next photo'}
        onClick={() => setIndex((index + 1) % slides.length)}
      >
        <ChevronRight />
      </button>
      <div className="hero-pagination">
        <span aria-live="polite">
          0{index + 1} / 0{slides.length}
        </span>
        <div>
          {slides.map((id, i) => (
            <button
              key={id}
              aria-label={`${fr ? 'Afficher la photo' : 'Show photo'} ${i + 1}`}
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
