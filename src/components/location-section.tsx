import { MapPin, Mountain, Waves, ShoppingBag } from 'lucide-react';
import type { Locale } from '@/lib/i18n';
export function LocationSection({ locale }: { locale: Locale }) {
  const fr = locale === 'fr';
  const query = encodeURIComponent('Chemin de la Tête de Lion, Grasse, France');
  return (
    <section className="location-section section">
      <div className="container">
        <p className="eyebrow">
          {fr
            ? 'Votre point de départ dans le Sud'
            : 'Your starting point in the South'}
        </p>
        <h2>
          {fr
            ? 'Au calme, près de la mer et de la montagne.'
            : 'A peaceful setting, close to the sea and mountains.'}
        </h2>
        <p className="location-address">
          <MapPin size={18} />
          Chemin de la Tête de Lion · Grasse Saint-Jacques
        </p>
        <div className="travel-times">
          {[
            {
              icon: Mountain,
              time: '25 min',
              label: fr ? 'de la montagne' : 'to the mountains',
            },
            {
              icon: Waves,
              time: '20 min',
              label: fr ? 'de la mer' : 'to the sea',
            },
            {
              icon: ShoppingBag,
              time: '3 min',
              label: fr ? 'des commerces' : 'to local shops',
            },
          ].map(({ icon: Icon, time, label }) => (
            <div key={label}>
              <Icon strokeWidth={1.3} />
              <strong>{time}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
      <iframe
        title={
          fr
            ? 'Localisation : chemin de la Tête de Lion à Grasse'
            : 'Location: Chemin de la Tête de Lion in Grasse'
        }
        src={`https://maps.google.com/maps?q=${query}&z=14&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      <a
        className="text-link"
        href={`https://www.google.com/maps/search/?api=1&query=${query}`}
        target="_blank"
        rel="noreferrer"
      >
        {fr ? 'Ouvrir dans Google Maps' : 'Open in Google Maps'} ↗
      </a>
    </section>
  );
}
