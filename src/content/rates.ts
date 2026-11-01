/** Price information is NOT an availability calendar. End dates are exclusive. */
export type RatePeriod = {
  start: string;
  end: string;
  label: string;
  weeklyPriceEur: number | null;
  availability: 'unconfirmed';
};

export const rates: readonly RatePeriod[] = [
  {
    start: '2027-06-12',
    end: '2027-07-03',
    label: '12 juin → 3 juillet',
    weeklyPriceEur: 990,
    availability: 'unconfirmed',
  },
  {
    start: '2027-07-03',
    end: '2027-07-10',
    label: '3 → 10 juillet',
    weeklyPriceEur: 1290,
    availability: 'unconfirmed',
  },
  {
    start: '2027-07-10',
    end: '2027-07-17',
    label: '10 → 17 juillet',
    weeklyPriceEur: 1590,
    availability: 'unconfirmed',
  },
  {
    start: '2027-07-17',
    end: '2027-08-07',
    label: '17 juillet → 7 août',
    weeklyPriceEur: 1990,
    availability: 'unconfirmed',
  },
  {
    start: '2027-08-07',
    end: '2027-08-21',
    label: '7 → 21 août',
    weeklyPriceEur: null,
    availability: 'unconfirmed',
  },
  {
    start: '2027-08-21',
    end: '2027-08-28',
    label: '21 → 28 août',
    weeklyPriceEur: 1590,
    availability: 'unconfirmed',
  },
  {
    start: '2027-08-28',
    end: '2027-09-11',
    label: '28 août → 11 septembre',
    weeklyPriceEur: 990,
    availability: 'unconfirmed',
  },
];

export const startingWeeklyPriceEur = Math.min(
  ...rates.flatMap(({ weeklyPriceEur }) =>
    weeklyPriceEur === null ? [] : [weeklyPriceEur],
  ),
);

export function formatWeeklyPrice(price: number | null): string {
  return price === null
    ? 'Nous consulter'
    : new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
      }).format(price);
}
