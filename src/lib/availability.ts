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
};
export function addDays(date: string, days: number): string {
  const d = new Date(date + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
export function initialWeeks(): Week[] {
  const weeks: Week[] = [];
  for (
    let start = '2027-06-12';
    start < '2027-09-11';
    start = addDays(start, 7)
  ) {
    weeks.push({
      start,
      end: addDays(start, 7),
      price:
        rates.find((r) => start >= r.start && start < r.end)?.weeklyPriceEur ??
        null,
      status: 'unconfirmed',
      revision: 0,
    });
  }
  return weeks;
}
export function publicWeek(week: Week): PublicWeek {
  return {
    start: week.start,
    end: week.end,
    price: week.price,
    status:
      week.status === 'available' || week.status === 'unconfirmed'
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
    initialWeeks().some((w) => w.start === v.start) &&
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
