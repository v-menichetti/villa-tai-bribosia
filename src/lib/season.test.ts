import { describe, it, expect } from 'vitest';
import { seasonYear, parisDate, firstSaturday } from './season';
import { initialWeeks, publicWeek } from './availability';
describe('Paris rental season', () => {
  it('rolls over at midnight in Paris on October 1', () => {
    expect(seasonYear(new Date('2027-09-30T21:59:59Z'))).toBe(2027);
    expect(seasonYear(new Date('2027-09-30T22:00:00Z'))).toBe(2028);
    expect(seasonYear(new Date('2028-01-01T12:00:00Z'))).toBe(2028);
    expect(parisDate(new Date('2028-06-02T22:05:00Z'))).toBe('2028-06-03');
  });
  it('generates correct Saturdays through leap years without inventing future prices', () => {
    for (const year of [2027, 2028, 2029, 2030, 2032]) {
      const weeks = initialWeeks(year);
      expect(weeks[0].start).toBe(firstSaturday(year, 6));
      expect(
        weeks.every(
          (w) =>
            new Date(w.start).getUTCDay() === 6 &&
            Date.parse(w.end) - Date.parse(w.start) === 7 * 86400000,
        ),
      ).toBe(true);
      expect(Number(weeks.at(-1)!.start.slice(8))).toBeGreaterThanOrEqual(8);
      expect(Number(weeks.at(-1)!.start.slice(8))).toBeLessThanOrEqual(14);
      if (year !== 2027)
        expect(weeks.every((w) => w.price === null)).toBe(true);
    }
  });
  it('closes a stay on its arrival day and all older stays, regardless of stored availability', () => {
    const week = initialWeeks(2027)[0];
    expect(publicWeek(week, new Date('2027-06-04T12:00:00Z'))).toMatchObject({
      expired: false,
      status: 'available',
    });
    expect(publicWeek(week, new Date('2027-06-04T22:00:00Z'))).toMatchObject({
      expired: true,
      status: 'unavailable',
    });
    expect(publicWeek(week, new Date('2027-07-01T12:00:00Z'))).toMatchObject({
      expired: true,
      status: 'unavailable',
    });
  });
});
