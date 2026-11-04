'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import { photographs } from '@/content/villa';
import type { Locale } from '@/lib/i18n';
export function Gallery({ locale }: { locale: Locale }) {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLButtonElement | null>(null);
  const fr = locale === 'fr';
  const visible = photographs.filter(
    (p) => filter === 'all' || p.category === filter,
  );
  useEffect(() => {
    if (selected !== null) {
      dialog.current?.showModal();
      document.body.style.overflow = 'hidden';
    } else {
      dialog.current?.close();
      document.body.style.overflow = '';
      returnFocus.current?.focus();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selected]);
  function step(delta: number) {
    setSelected((i) =>
      i === null ? null : (i + delta + visible.length) % visible.length,
    );
  }
  return (
    <>
      <div
        className="gallery-filters"
        aria-label={fr ? 'Filtrer les photos' : 'Filter photos'}
      >
        {[
          ['all', fr ? 'Toutes les photos' : 'All photos'],
          ['outdoors', fr ? 'Les extérieurs' : 'Outdoors'],
          ['aerial', fr ? 'Vues du ciel' : 'Aerial views'],
          ['bedrooms', fr ? 'Les chambres' : 'Bedrooms'],
          ['indoors', fr ? 'La vie dedans' : 'Indoors'],
        ].map(([id, label]) => (
          <button
            key={id}
            aria-pressed={filter === id}
            onClick={() => setFilter(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="gallery-grid">
        {visible.map((p, i) => (
          <button
            key={p.id}
            className="gallery-item"
            onClick={(e) => {
              returnFocus.current = e.currentTarget;
              setSelected(i);
            }}
          >
            <span className="gallery-image">
              <Image
                src={`/images/${p.id}.webp?v=20261104`}
                alt={p[locale]}
                fill
                sizes="(max-width: 700px) 100vw, 50vw"
              />
              <Expand size={20} aria-hidden="true" />
            </span>
            <span>{p[locale]}</span>
          </button>
        ))}
      </div>
      <dialog
        ref={dialog}
        className="lightbox"
        aria-label={fr ? 'Photo agrandie' : 'Enlarged photo'}
        onCancel={() => setSelected(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setSelected(null);
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') step(-1);
          if (e.key === 'ArrowRight') step(1);
        }}
      >
        {selected !== null && (
          <div className="lightbox-content">
            <button
              className="lightbox-close"
              onClick={() => setSelected(null)}
              aria-label={fr ? 'Fermer' : 'Close'}
            >
              <X />
            </button>
            <div className="lightbox-photo">
              <Image
                src={`/images/${visible[selected].id}.webp?v=20261104`}
                alt={visible[selected][locale]}
                fill
                sizes="90vw"
              />
            </div>
            <div className="lightbox-caption">
              <button
                onClick={() => step(-1)}
                aria-label={fr ? 'Précédente' : 'Previous'}
              >
                <ChevronLeft />
              </button>
              <p>
                {visible[selected][locale]}
                <small>
                  {selected + 1} / {visible.length}
                </small>
              </p>
              <button
                onClick={() => step(1)}
                aria-label={fr ? 'Suivante' : 'Next'}
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
