import { describe, expect, it } from 'vitest';
import { formatWeeklyPrice, rates, startingWeeklyPriceEur } from './rates';

describe('summer 2027 source data', () => {
  it('does not turn the missing August price into a free or available stay', () => {
    const unknown = rates.find((period) => period.start === '2027-08-07');
    expect(unknown?.weeklyPriceEur).toBeNull();
    expect(unknown?.availability).toBe('unconfirmed');
    expect(formatWeeklyPrice(unknown?.weeklyPriceEur ?? null)).toBe(
      'Nous consulter',
    );
  });
  it('covers the season in consecutive, non-overlapping periods', () => {
    expect(rates[0].start).toBe('2027-06-12');
    expect(rates.at(-1)?.end).toBe('2027-09-11');
    rates.forEach((period, index) => {
      expect(period.start < period.end).toBe(true);
      if (index > 0) expect(period.start).toBe(rates[index - 1].end);
    });
  });
  it('keeps all availability unconfirmed and excludes missing rates from the advertised minimum', () => {
    expect(rates.every((period) => period.availability === 'unconfirmed')).toBe(
      true,
    );
    expect(startingWeeklyPriceEur).toBe(990);
  });
});
