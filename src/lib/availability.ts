import { firstSaturday, parisDate, seasonYear } from './season';
import { rates } from '@/content/rates';
export const statuses = [
  'unconfirmed',
  'available',
  'option',
  'booked',
  'blocked',
] as const;
export type WeekStatus = (typeof statuses)[number];
export type Week = {
  start: string;
  end: string;
  price: number | null;
  status: WeekStatus;
  revision: number;
};
export type PublicWeek = Omit<Week, 'status' | 'revision'> & {
  status: 'unconfirmed' | 'available' | 'unavailable';
  expired: boolean;
};
export function addDays(date: string, days: number): string {
  const d = new Date(date + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
export function initialWeeks(year = seasonYear()): Week[] {
  const weeks: Week[] = [];
  for (
    let start = firstSaturday(year, 6);
    start < addDays(firstSaturday(year, 9), 14);
    start = addDays(start, 7)
  ) {
    weeks.push({
      start,
      end: addDays(start, 7),
      price:
        year === 2027
          ? (rates.find((r) => start >= r.start && start < r.end)
              ?.weeklyPriceEur ?? null)
          : null,
      status: 'available',
      revision: 0,
    });
  }
  return weeks;
}
export function publicWeek(week: Week, now = new Date()): PublicWeek {
  return {
    start: week.start,
    end: week.end,
    price: week.price,
    expired: week.start <= parisDate(now),
    status:
      week.start > parisDate(now) &&
      (week.status === 'available' || week.status === 'unconfirmed')
        ? week.status
        : 'unavailable',
  };
}
export function validWeekUpdate(
  value: unknown,
): value is Pick<Week, 'start' | 'price' | 'status' | 'revision'> {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    initialWeeks().some((w) => w.start === v.start && w.start > parisDate()) &&
    statuses.includes(v.status as WeekStatus) &&
    (v.price === null ||
      (typeof v.price === 'number' &&
        Number.isInteger(v.price) &&
        v.price > 0 &&
        v.price <= 20000)) &&
    typeof v.revision === 'number' &&
    Number.isInteger(v.revision) &&
    v.revision >= 0
  );
}
