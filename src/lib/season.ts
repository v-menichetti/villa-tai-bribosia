/** Rental dates follow the villa's local date, including around midnight. */
export function parisDate(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Paris',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}
export function seasonYear(now = new Date()): number {
  const today = parisDate(now);
  return Number(today.slice(0, 4)) + (Number(today.slice(5, 7)) >= 10 ? 1 : 0);
}
export function firstSaturday(year: number, month: number): string {
  const date = new Date(Date.UTC(year, month - 1, 1, 12));
  date.setUTCDate(1 + ((6 - date.getUTCDay() + 7) % 7));
  return date.toISOString().slice(0, 10);
}
