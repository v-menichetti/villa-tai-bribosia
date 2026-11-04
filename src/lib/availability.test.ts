import { beforeAll, afterAll, describe, expect, it, vi } from 'vitest';
import { initialWeeks, publicWeek, validWeekUpdate } from './availability';
import { parseEnquiry } from './enquiry';
import { paths, resolvePage } from './i18n';
beforeAll(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-11-04T12:00:00Z'));
});
afterAll(() => vi.useRealTimers());
describe('weekly stays', () => {
  it('opens Saturday stays from early June through the second September week', () => {
    const weeks = initialWeeks();
    expect(weeks).toHaveLength(15);
    expect(
      weeks.every(
        (w) => new Date(w.start).getUTCDay() === 6 && w.status === 'available',
      ),
    ).toBe(true);
    expect(weeks.filter((w) => w.price === null).map((w) => w.start)).toEqual([
      '2027-06-05',
      '2027-08-07',
      '2027-08-14',
      '2027-09-11',
    ]);
    expect(weeks.at(-1)?.end).toBe('2027-09-18');
  });
  it('keeps private booking reasons and revisions out of the public response', () => {
    for (const status of ['option', 'booked', 'blocked'] as const)
      expect(publicWeek({ ...initialWeeks()[0], status })).toEqual({
        start: '2027-06-05',
        end: '2027-06-12',
        price: null,
        expired: false,
        status: 'unavailable',
      });
  });
  it('rejects forged weeks, free rates and invalid statuses', () => {
    const week = initialWeeks()[0];
    expect(validWeekUpdate(week)).toBe(true);
    for (const delta of [
      { start: '2027-06-13' },
      { price: 0 },
      { price: -20 },
      { price: 1.2 },
      { price: 20001 },
      { status: 'hacked' },
      { revision: -1 },
    ])
      expect(validWeekUpdate({ ...week, ...delta })).toBe(false);
  });
});
describe('enquiry validation', () => {
  const value = {
    name: 'Test Visitor',
    email: 'visitor@example.invalid',
    phone: '',
    arrival: '2027-07-17',
    departure: '2027-07-31',
    adults: '4',
    children: '2',
    message: 'A question about the villa.',
    website: '',
    locale: 'en',
  };
  it('accepts consecutive weeks and optional dates', () => {
    expect(parseEnquiry(value)?.adults).toBe(4);
    expect(
      parseEnquiry({ ...value, arrival: '', departure: '' }),
    ).not.toBeNull();
  });
  it('rejects excess guests, non-Saturday/out-of-season/incomplete dates and malformed email', () => {
    for (const delta of [
      { adults: 9, children: 2 },
      { adults: 0 },
      { children: -1 },
      { adults: 2.5 },
      { arrival: '2027-07-18' },
      { departure: '2028-07-31' },
      { departure: '' },
      { departure: '2027-07-10' },
      { email: 'test\r\nbcc@example.com' },
    ])
      expect(parseEnquiry({ ...value, ...delta })).toBeNull();
  });
});
it('resolves every language route and rejects invented pages', () => {
  for (const locale of ['fr', 'en'] as const)
    for (const [page, path] of Object.entries(paths[locale]))
      expect(resolvePage(path.split('/').filter(Boolean))).toEqual({
        locale,
        page,
      });
  expect(resolvePage(['not-a-page'])).toBeNull();
});
