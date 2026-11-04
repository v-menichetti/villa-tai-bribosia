import { parisDate } from './season';
import { initialWeeks } from './availability';
export type Enquiry = {
  name: string;
  email: string;
  phone: string;
  arrival: string;
  departure: string;
  adults: number;
  children: number;
  message: string;
  website: string;
  locale: 'fr' | 'en';
};
export function parseEnquiry(input: unknown): Enquiry | null {
  if (!input || typeof input !== 'object') return null;
  const v = input as Record<string, unknown>;
  const strings = [
    'name',
    'email',
    'phone',
    'arrival',
    'departure',
    'message',
    'website',
  ] as const;
  if (strings.some((k) => typeof v[k] !== 'string')) return null;
  const e = Object.fromEntries(
    strings.map((k) => [k, (v[k] as string).trim()]),
  ) as unknown as Enquiry;
  e.adults = Number(v.adults);
  e.children = Number(v.children);
  e.locale = v.locale === 'en' ? 'en' : 'fr';
  if (
    e.name.length < 2 ||
    e.name.length > 100 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.email) ||
    e.email.length > 254 ||
    /[\r\n]/.test(e.email) ||
    e.phone.length > 40 ||
    e.message.length < 10 ||
    e.message.length > 4000 ||
    !Number.isInteger(e.adults) ||
    !Number.isInteger(e.children) ||
    e.adults < 1 ||
    e.children < 0 ||
    e.adults + e.children > 10
  )
    return null;
  if (Boolean(e.arrival) !== Boolean(e.departure)) return null;
  if (
    e.arrival &&
    (!initialWeeks().some((w) => w.start === e.arrival) ||
      !initialWeeks().some((w) => w.end === e.departure) ||
      e.departure <= e.arrival ||
      e.arrival <= parisDate())
  )
    return null;
  return e;
}
export const contactRecipient =
  process.env.CONTACT_EMAIL?.trim() || 'Vmenichetti@hotmail.com';
export function emailConfigured() {
  return Boolean(
    process.env.RESEND_API_KEY && contactRecipient && process.env.MAIL_FROM,
  );
}
