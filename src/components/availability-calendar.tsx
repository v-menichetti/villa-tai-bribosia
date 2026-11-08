'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { dateLabel, paths, type Locale } from '@/lib/i18n';
import { type PublicWeek } from '@/lib/availability';
import { selectedStay } from '@/lib/stay';
import { StayPrice } from './stay-price';
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
  const selection = selectedStay(weeks, selected, search.get('departure'));
  const [rangeError, setRangeError] = useState(false);
  const selectedWeek = weeks.find(
    (w) => w.start === selected && w.status !== 'unavailable',
  );
  const [month, setMonth] = useState(
    selectedWeek ? Number(selectedWeek.start.slice(5, 7)) - 1 : 5,
  );
  function setSelected(start: string) {
    const week = weeks.find((w) => w.start === start);
    if (!week || week.status === 'unavailable' || week.expired) return;
    const startDate =
      selectedWeek && start >= selectedWeek.start ? selectedWeek.start : start;
    if (!selectedStay(weeks, startDate, week.end)) {
      setRangeError(true);
      return;
    }
    setRangeError(false);
    const query = new URLSearchParams(search.toString());
    query.set('arrival', startDate);
    query.set('departure', week.end);
    router.replace(pathname + '?' + query.toString(), { scroll: false });
  }
  const year = Number(weeks[0]?.start.slice(0, 4));
  useEffect(() => {
    const refresh = () => {
      if (!document.hidden) router.refresh();
    };
    const timer = setInterval(refresh, 30000);
    window.addEventListener('focus', refresh);
    return () => {
      clearInterval(timer);
      window.removeEventListener('focus', refresh);
    };
  }, [router]);
  const fr = locale === 'fr';

  const statusNames = {
    available: fr ? 'Disponible' : 'Available',
    unavailable: fr ? 'Indisponible' : 'Unavailable',
    unconfirmed: fr ? 'À confirmer' : 'To confirm',
  };
  function renderMonth(m: number) {
    const first = (new Date(Date.UTC(year, m, 1)).getUTCDay() + 6) % 7;
    const total = new Date(Date.UTC(year, m + 1, 0)).getUTCDate();
    return (
      <div className="calendar-month" key={m}>
        <h3>
          {new Intl.DateTimeFormat(fr ? 'fr-FR' : 'en-GB', {
            month: 'long',
            year: 'numeric',
            timeZone: 'UTC',
          }).format(new Date(Date.UTC(year, m, 1)))}
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
            const iso = `${year}-${String(m + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
            const week = weeks.find((w) => iso >= w.start && iso < w.end);
            const canSelect = week && week.status !== 'unavailable';
            return (
              <button
                key={iso}
                disabled={!canSelect}
                className={`calendar-day ${week?.expired ? 'expired' : week?.status || 'outside'} ${Boolean(week && selection?.weeks.some((w) => w.start === week.start)) ? 'selected' : ''}`}
                aria-pressed={Boolean(
                  week && selection?.weeks.some((w) => w.start === week.start),
                )}
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
          <span>{`${fr ? 'Été' : 'Summer'} ${year}`}</span>
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
          {Object.entries(statusNames)
            .filter(
              ([key]) =>
                key !== 'unconfirmed' ||
                weeks.some((week) => week.status === 'unconfirmed'),
            )
            .map(([key, label]) => (
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
      <p className="field-help">
        {fr
          ? 'Cliquez sur votre première semaine, puis sur la dernière pour prolonger le séjour. Toutes les semaines entre les deux seront sélectionnées.'
          : 'Click your first week, then your last week to extend your stay. All weeks in between will be selected.'}
      </p>
      {rangeError && (
        <p className="form-error" role="alert">
          {fr
            ? 'Cette période comprend une semaine indisponible. Choisissez une autre période.'
            : 'This range includes an unavailable week. Please choose another range.'}
        </p>
      )}
      <div className="selection-summary" aria-live="polite">
        {selection ? (
          <>
            <div>
              <strong>
                {dateLabel(selection.start, locale)} —{' '}
                {dateLabel(selection.end, locale)}
              </strong>
              <StayPrice stay={selection} locale={locale} />
            </div>
            <div className="selection-actions">
              <Link
                className="button"
                href={`${paths[locale].contact}?arrival=${selection.start}&departure=${selection.end}`}
              >
                {fr ? 'Demander ce séjour' : 'Enquire about this stay'}
                <ArrowRight size={16} />
              </Link>
              {selected && (
                <button
                  type="button"
                  className="selection-clear"
                  onClick={() => {
                    const query = new URLSearchParams(search.toString());
                    query.delete('arrival');
                    query.delete('departure');
                    setRangeError(false);
                    router.replace(pathname + '?' + query.toString(), {
                      scroll: false,
                    });
                  }}
                >
                  {fr ? 'Effacer la sélection' : 'Clear selection'}
                </button>
              )}
            </div>
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
