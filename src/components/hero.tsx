'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { paths, type Locale } from '@/lib/i18n';
const slides = ['pool', 'terrace', 'terrace-lounge', 'facade'];
export function Hero({ locale }: { locale: Locale }) {
  const [index, setIndex] = useState(0);
  const ready = useRef(new Set<number>());
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (paused || hovered) return;
    const timer = setInterval(() => {
      if (!media.matches && !document.hidden) {
        setIndex((i) =>
          ready.current.has((i + 1) % slides.length)
            ? (i + 1) % slides.length
            : i,
        );
      }
    }, 6500);
    return () => clearInterval(timer);
  }, [paused, hovered]);
  const change = (i: number) => {
    if (ready.current.has(i)) setIndex(i);
  };
  const fr = locale === 'fr';
  return (
    <section
      className="hero"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setHovered(false);
      }}
      aria-label={
        fr ? 'Découvrez la villa en images' : 'Discover the villa in pictures'
      }
    >
      {slides.map((slide, i) => (
        <Image
          key={slide}
          className={`hero-image ${i === index ? 'is-active' : ''}`}
          src={`/images/${slide}.webp?v=20261104`}
          alt={
            i === index
              ? fr
                ? [
                    'La piscine privée',
                    'La terrasse',
                    'Le salon de jardin',
                    'La façade de la villa',
                  ][i]
                : [
                    'The private pool',
                    'The terrace',
                    'The garden lounge',
                    'The villa exterior',
                  ][i]
              : ''
          }
          aria-hidden={i !== index}
          fill
          sizes="100vw"
          loading="eager"
          fetchPriority={i === 0 ? 'high' : 'auto'}
          onLoad={() => {
            ready.current.add(i);
          }}
        />
      ))}
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
        onClick={() => change((index + slides.length - 1) % slides.length)}
      >
        <ChevronLeft />
      </button>
      <button
        className="hero-arrow next"
        aria-label={fr ? 'Photo suivante' : 'Next photo'}
        onClick={() => change((index + 1) % slides.length)}
      >
        <ChevronRight />
      </button>
      <button
        className="hero-playback"
        aria-label={
          paused
            ? fr
              ? 'Reprendre le diaporama'
              : 'Play slideshow'
            : fr
              ? 'Mettre le diaporama en pause'
              : 'Pause slideshow'
        }
        onClick={() => setPaused(!paused)}
      >
        {paused ? <Play size={16} /> : <Pause size={16} />}
      </button>
      <div className="hero-pagination">
        <div>
          {slides.map((id, i) => (
            <button
              key={id}
              aria-label={`${fr ? 'Afficher la photo' : 'Show photo'} ${i + 1}`}
              aria-pressed={i === index}
              onClick={() => change(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
