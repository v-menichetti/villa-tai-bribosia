import type { PublicWeek } from './availability';
export function selectedStay(
  weeks: PublicWeek[],
  arrival: string | null,
  departure: string | null,
) {
  if (!arrival || !departure || departure <= arrival) return null;
  const selected = weeks
    .filter((w) => w.start >= arrival && w.start < departure)
    .sort((a, b) => a.start.localeCompare(b.start));
  if (
    !selected.length ||
    selected[0].start !== arrival ||
    selected.at(-1)?.end !== departure ||
    selected.some(
      (w, i) =>
        w.expired ||
        w.status === 'unavailable' ||
        (i > 0 && selected[i - 1].end !== w.start),
    )
  )
    return null;
  return {
    start: arrival,
    end: departure,
    weeks: selected,
    count: selected.length,
    nights: selected.length * 7,
    price: selected.some((w) => w.price === null)
      ? null
      : selected.reduce((sum, w) => sum + w.price!, 0),
  };
}
