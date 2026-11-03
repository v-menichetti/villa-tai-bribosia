import { Star } from 'lucide-react';
import { guestReviews, exampleReviews } from '@/content/reviews';
import type { Locale } from '@/lib/i18n';
export function GuestReviews({ locale }: { locale: Locale }) {
  const demo = !guestReviews.length && process.env.NODE_ENV === 'development';
  const reviews = demo ? exampleReviews : guestReviews;
  if (!reviews.length) return null;
  return (
    <section className="container section guest-reviews">
      <p className="eyebrow">
        {locale === 'fr'
          ? 'Ils ont séjourné à la villa'
          : 'They stayed at the villa'}
      </p>
      <h2>
        {locale === 'fr'
          ? 'Leurs souvenirs, leurs mots.'
          : 'Their memories, their words.'}
      </h2>
      <div className="reviews-grid">
        {reviews.map((r) => (
          <figure key={r.name + r.source}>
            <div aria-label={`${r.rating} / 5`}>
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  size={17}
                  fill={i < r.rating ? 'currentColor' : 'none'}
                  aria-hidden="true"
                />
              ))}
            </div>
            <blockquote>{r[locale]}</blockquote>
            <figcaption>
              {r.name} · {r.source}
            </figcaption>
          </figure>
        ))}
      </div>
      {demo && (
        <p className="review-demo-label">
          {locale === 'fr'
            ? 'Exemples fictifs pour la maquette — masqués en production.'
            : 'Fictional design examples — hidden in production.'}
        </p>
      )}
    </section>
  );
}
