import { describe, it, expect } from 'vitest';
import { selectedStay } from './stay';
import type { PublicWeek } from './availability';
const weeks: PublicWeek[] = [
  {
    start: '2027-06-26',
    end: '2027-07-03',
    price: 990,
    status: 'available',
    expired: false,
  },
  {
    start: '2027-07-03',
    end: '2027-07-10',
    price: 1290,
    status: 'available',
    expired: false,
  },
  {
    start: '2027-07-10',
    end: '2027-07-17',
    price: 1590,
    status: 'available',
    expired: false,
  },
];
describe('consecutive stay selection', () => {
  it('totals different weekly prices across months', () => {
    expect(selectedStay(weeks, '2027-06-26', '2027-07-17')).toMatchObject({
      count: 3,
      nights: 21,
      price: 3870,
    });
  });
  it('keeps unknown prices unknown', () => {
    expect(
      selectedStay(
        weeks.map((w, i) => ({ ...w, price: i === 1 ? null : w.price })),
        '2027-06-26',
        '2027-07-17',
      )?.price,
    ).toBeNull();
  });
  it('rejects a booked middle week, expired weeks and missing weeks', () => {
    expect(
      selectedStay(
        weeks.map((w, i) => ({
          ...w,
          status: i === 1 ? 'unavailable' : w.status,
        })),
        '2027-06-26',
        '2027-07-17',
      ),
    ).toBeNull();
    expect(
      selectedStay(
        weeks.map((w, i) => ({ ...w, expired: i === 0 })),
        '2027-06-26',
        '2027-07-17',
      ),
    ).toBeNull();
    expect(
      selectedStay([weeks[0], weeks[2]], '2027-06-26', '2027-07-17'),
    ).toBeNull();
  });
  it('rejects partial, reversed and out-of-season ranges', () => {
    for (const [start, end] of [
      ['2027-06-27', '2027-07-10'],
      ['2027-07-03', '2027-07-03'],
      ['2027-07-03', '2027-06-26'],
      ['2027-06-26', '2027-07-24'],
    ])
      expect(selectedStay(weeks, start, end)).toBeNull();
  });
});
