'use client';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { dateLabel, paths, priceLabel, type Locale } from '@/lib/i18n';
import { type PublicWeek } from '@/lib/availability';
export function AvailabilityCalendar({
  weeks,
  locale,
  compact = false,
}: {
  weeks: PublicWeek[];
  locale: Locale;
  compact?: boolean;
}) {
  const search = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const selected = search.get('arrival');
  const selectedWeek = weeks.find(
    (w) => w.start === selected && w.status !== 'unavailable',
  );
  const [month, setMonth] = useState(
    selectedWeek ? Number(selectedWeek.start.slice(5, 7)) - 1 : 5,
  );
  function setSelected(start: string) {
    const week = weeks.find((w) => w.start === start);
    if (!week) return;
    const query = new URLSearchParams(search.toString());
    query.set('arrival', week.start);
    query.set('departure', week.end);
    router.replace(pathname + '?' + query.toString(), { scroll: false });
  }
  const fr = locale === 'fr';
  const selection = selectedWeek;
  const statusNames = {
    available: fr ? 'Disponible' : 'Available',
    unavailable: fr ? 'Indisponible' : 'Unavailable',
    unconfirmed: fr ? 'À confirmer' : 'To confirm',
  };
  function renderMonth(m: number) {
    const first = (new Date(Date.UTC(2027, m, 1)).getUTCDay() + 6) % 7;
    const total = new Date(Date.UTC(2027, m + 1, 0)).getUTCDate();
    return (
      <div className="calendar-month" key={m}>
        <h3>
          {new Intl.DateTimeFormat(fr ? 'fr-FR' : 'en-GB', {
            month: 'long',
            year: 'numeric',
            timeZone: 'UTC',
          }).format(new Date(Date.UTC(2027, m, 1)))}
        </h3>
        <div className="calendar-grid">
          {(fr
            ? ['L', 'M', 'M', 'J', 'V', 'S', 'D']
            : ['M', 'T', 'W', 'T', 'F', 'S', 'S']
          ).map((day, i) => (
            <span className="weekday" key={'day' + i}>
              {day}
            </span>
          ))}
          {Array.from({ length: first }, (_, i) => (
            <span key={'blank' + i} />
          ))}
          {Array.from({ length: total }, (_, i) => {
            const iso = `2027-${String(m + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
            const week = weeks.find((w) => iso >= w.start && iso < w.end);
            const canSelect = week && week.status !== 'unavailable';
            return (
              <button
                key={iso}
                disabled={!canSelect}
                className={`calendar-day ${week?.status || 'outside'} ${week?.start === selected ? 'selected' : ''}`}
                aria-pressed={week?.start === selected}
                aria-label={`${dateLabel(iso, locale)}${week ? ` — ${statusNames[week.status]} — ${fr ? 'semaine du' : 'week of'} ${dateLabel(week.start, locale)}` : ''}`}
                onClick={() => week && setSelected(week.start)}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
  return (
    <div className={`availability-widget ${compact ? 'compact' : ''}`}>
      <div className="calendar-card">
        <div className="calendar-controls">
          <button
            aria-label={fr ? 'Mois précédent' : 'Previous month'}
            disabled={month === 5}
            onClick={() => setMonth(month - 1)}
          >
            <ChevronLeft size={21} />
          </button>
          <span>{fr ? 'Été 2027' : 'Summer 2027'}</span>
          <button
            aria-label={fr ? 'Mois suivant' : 'Next month'}
            disabled={month === 8}
            onClick={() => setMonth(month + 1)}
          >
            <ChevronRight size={21} />
          </button>
        </div>
        <div className="calendar-months">
          {renderMonth(month)}
          <div className="second-month">
            {month < 8 && renderMonth(month + 1)}
          </div>
        </div>
        <div className="calendar-legend">
          {Object.entries(statusNames).map(([key, label]) => (
            <span key={key}>
              <i className={key} />
              {label}
            </span>
          ))}
          <span>
            <i className="selected" />
            {fr ? 'Sélection' : 'Selected'}
          </span>
        </div>
      </div>
      <div className="selection-summary" aria-live="polite">
        {selection ? (
          <>
            <div>
              <strong>
                {dateLabel(selection.start, locale)} —{' '}
                {dateLabel(selection.end, locale)}
              </strong>
              <span>
                {priceLabel(selection.price, locale)}
                {selection.price !== null &&
                  (fr ? ' / semaine' : ' / week')} ·{' '}
                {statusNames[selection.status]}
              </span>
            </div>
            <Link
              className="button"
              href={`${paths[locale].contact}?arrival=${selection.start}&departure=${selection.end}`}
            >
              {fr ? 'Demander ce séjour' : 'Enquire about this stay'}
              <ArrowRight size={16} />
            </Link>
          </>
        ) : (
          <p>
            {fr
              ? 'Sélectionnez un jour pour choisir la semaine correspondante, du samedi au samedi.'
              : 'Select a day to choose its Saturday-to-Saturday week.'}
          </p>
        )}
      </div>
    </div>
  );
}
