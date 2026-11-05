import { Star } from 'lucide-react';
import { guestReviews, reviewSource } from '@/content/reviews';
import type { Locale } from '@/lib/i18n';
export function GuestReviews({ locale }: { locale: Locale }) {
  const reviews = guestReviews;
  if (!reviews.length) return null;
  return (
    <section id="avis" className="container section guest-reviews">
      <p className="eyebrow">
        {locale === 'fr'
          ? 'Ils ont séjourné à la villa'
          : 'They stayed at the villa'}
      </p>
      <h2>
        {locale === 'fr'
          ? 'Les avis de nos voyageurs.'
          : 'What our guests say.'}
      </h2>
      <p>
        {locale === 'fr'
          ? 'Une sélection de commentaires publiés sur Airbnb, transmis par la propriétaire.'
          : 'A selection of Airbnb reviews supplied by the owner. Translated from French.'}
      </p>
      <div className="reviews-grid">
        {reviews.map((r) => (
          <figure key={r.name + r.month}>
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
              {r.name} ·{' '}
              <time dateTime={r.month}>
                {new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-GB', {
                  month: 'long',
                  year: 'numeric',
                  timeZone: 'UTC',
                }).format(new Date(r.month + '-01T12:00:00Z'))}
              </time>{' '}
              · Airbnb
            </figcaption>
          </figure>
        ))}
      </div>
      <a
        className="text-link"
        href={reviewSource}
        target="_blank"
        rel="noreferrer"
      >
        {locale === 'fr'
          ? 'Voir tous les avis sur Airbnb'
          : 'Read all reviews on Airbnb'}{' '}
        ↗
      </a>
    </section>
  );
}
