'use client';
import { DateSelect } from './date-select';
import Link from 'next/link';
import { useState } from 'react';
import { Check, Send } from 'lucide-react';
import { dateLabel, paths, type Locale } from '@/lib/i18n';
import { type PublicWeek } from '@/lib/availability';
export function ContactForm({
  locale,
  weeks,
  initialArrival = '',
  initialDeparture = '',
}: {
  locale: Locale;
  weeks: PublicWeek[];
  initialArrival?: string;
  initialDeparture?: string;
  configured: boolean;
}) {
  const fr = locale === 'fr';
  const [arrival, setArrival] = useState(
    weeks.some((w) => w.start === initialArrival && w.status !== 'unavailable')
      ? initialArrival
      : '',
  );
  const [departure, setDeparture] = useState(
    weeks.some((w) => w.end === initialDeparture) ? initialDeparture : '',
  );
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const errors: Record<string, string> = {
    invalid: fr
      ? 'Vérifiez les champs, les dates et le nombre de voyageurs (10 maximum).'
      : 'Please check the fields, dates and guest count (10 maximum).',
    rate: fr
      ? 'Trop de demandes. Merci de réessayer dans 15 minutes.'
      : 'Too many requests. Please try again in 15 minutes.',
    unavailable: fr
      ? 'Une semaine choisie n’est plus disponible. Choisissez d’autres dates.'
      : 'A selected week is no longer available. Please choose other dates.',
    configuration: fr
      ? 'Le formulaire n’est pas encore ouvert. Merci de revenir prochainement.'
      : 'Enquiries are not open yet. Please check back soon.',
  };
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setPending(true);
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, locale }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setSent(true);
    } catch (e) {
      setError(
        errors[e instanceof Error ? e.message : ''] ||
          (fr
            ? 'L’envoi a échoué. Votre message est conservé dans le formulaire ; réessayez.'
            : 'Sending failed. Your message remains in the form; please try again.'),
      );
    } finally {
      setPending(false);
    }
  }
  if (sent)
    return (
      <div className="form-success" role="status">
        <Check />
        <h2>
          {fr ? 'Merci pour votre message.' : 'Thank you for your message.'}
        </h2>
        <p>
          {fr
            ? 'Votre demande a été transmise. La propriétaire vous répondra par e-mail. Vos dates restent soumises à confirmation.'
            : 'Your enquiry has been submitted. The owner will reply by email. Your dates remain subject to confirmation.'}
        </p>
        <Link className="button outline" href={paths[locale].home}>
          {fr ? 'Revenir à la villa' : 'Back to the villa'}
        </Link>
      </div>
    );
  return (
    <form className="contact-form" onSubmit={submit}>
      <label>
        {fr ? 'Prénom et nom' : 'Full name'} *
        <input
          name="name"
          autoComplete="name"
          required
          minLength={2}
          maxLength={100}
          placeholder={fr ? 'Votre nom' : 'Your name'}
        />
      </label>
      <label>
        {fr ? 'Adresse e-mail' : 'Email address'} *
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          placeholder={fr ? 'vous@exemple.fr' : 'you@example.com'}
        />
      </label>
      <label>
        {fr ? 'Téléphone (facultatif)' : 'Phone (optional)'}
        <input name="phone" type="tel" autoComplete="tel" maxLength={40} />
      </label>
      <div className="field-pair">
        <DateSelect
          name="arrival"
          label={fr ? 'Arrivée' : 'Arrival'}
          value={arrival}
          onChange={(v) => {
            setArrival(v);
            setDeparture('');
          }}
          placeholder={fr ? 'À préciser' : 'Not decided yet'}
          options={weeks
            .filter((w) => w.status !== 'unavailable')
            .map((w) => ({
              value: w.start,
              label: dateLabel(w.start, locale),
            }))}
        />
        <DateSelect
          name="departure"
          label={fr ? 'Départ' : 'Departure'}
          value={departure}
          onChange={setDeparture}
          disabled={!arrival}
          placeholder={fr ? 'À préciser' : 'Not decided yet'}
          options={weeks
            .filter(
              (w) =>
                w.end > arrival &&
                !weeks.some(
                  (b) =>
                    b.start >= arrival &&
                    b.start < w.end &&
                    b.status === 'unavailable',
                ),
            )
            .map((w) => ({ value: w.end, label: dateLabel(w.end, locale) }))}
        />
      </div>
      <div className="field-pair">
        <label>
          {fr ? 'Adultes' : 'Adults'}
          <input
            name="adults"
            type="number"
            min={1}
            max={10}
            defaultValue={2}
            required
          />
        </label>
        <label>
          {fr ? 'Enfants' : 'Children'}
          <input
            name="children"
            type="number"
            min={0}
            max={9}
            defaultValue={0}
            required
          />
        </label>
      </div>
      <p className="field-help">
        {fr ? '10 personnes maximum au total.' : 'Up to 10 guests in total.'}
      </p>
      <label>
        {fr ? 'Votre message' : 'Your message'} *
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={4000}
          rows={6}
          placeholder={
            fr
              ? 'Parlez-nous de votre séjour ou posez votre question…'
              : 'Tell us about your stay or ask a question…'
          }
        />
      </label>
      <div className="honeypot" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <p className="field-help">
        {fr
          ? 'Vos informations servent à répondre à votre demande.'
          : 'Your information is used to reply to your enquiry.'}{' '}
        <Link href={paths[locale].privacy}>
          {fr ? 'Confidentialité' : 'Privacy'}
        </Link>
      </p>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button className="button" disabled={pending}>
        {pending
          ? fr
            ? 'Envoi en cours…'
            : 'Sending…'
          : fr
            ? 'Envoyer ma demande'
            : 'Send my enquiry'}
        <Send size={17} aria-hidden="true" />
      </button>
      <p className="field-help">
        {fr
          ? '* Champs obligatoires. Une demande ne vaut pas réservation.'
          : '* Required fields. An enquiry does not confirm a booking.'}
      </p>
    </form>
  );
}
