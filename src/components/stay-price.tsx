import { priceLabel, type Locale } from '@/lib/i18n';
import { selectedStay } from '@/lib/stay';
export function StayPrice({
  stay,
  locale,
}: {
  stay: NonNullable<ReturnType<typeof selectedStay>>;
  locale: Locale;
}) {
  const fr = locale === 'fr';
  return (
    <div className="stay-price">
      <strong>
        {stay.count}{' '}
        {fr
          ? stay.count > 1
            ? 'semaines'
            : 'semaine'
          : stay.count > 1
            ? 'weeks'
            : 'week'}{' '}
        · {stay.nights} {fr ? 'nuits' : 'nights'}
      </strong>
      <p>
        {fr ? 'Total du séjour : ' : 'Stay total: '}
        {priceLabel(stay.price, locale)}
      </p>
      <small>
        {stay.price === null
          ? fr
            ? 'Au moins une semaine n’a pas encore de tarif : demandez un devis pour le séjour complet.'
            : 'At least one week has no published rate: request a quote for the full stay.'
          : fr
            ? 'Estimation avant réduction éventuelle, à confirmer avec Véronique.'
            : 'Estimate before any discount, to be confirmed with Véronique.'}
      </small>
      {stay.count > 1 && (
        <small>
          {fr
            ? 'Tarif dégressif dès deux semaines consécutives, sur demande.'
            : 'Reduced rates for two or more consecutive weeks, on request.'}
        </small>
      )}
      <small>
        {fr
          ? 'Ménage en option : forfait de 150 € par séjour, non inclus dans ce total.'
          : 'Optional cleaning: €150 per stay, not included in this total.'}
      </small>
    </div>
  );
}
