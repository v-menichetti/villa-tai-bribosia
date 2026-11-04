'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Check, X, LogOut, LockKeyhole, CalendarDays } from 'lucide-react';
import type { Week } from '@/lib/availability';
import { parisDate } from '@/lib/season';
import { dateLabel } from '@/lib/i18n';
import { BrandMark } from './brand-mark';

export function AdminPanel({
  weeks: initial,
  loggedIn,
  configured,
}: {
  weeks: Week[];
  loggedIn: boolean;
  configured: boolean;
}) {
  const router = useRouter();
  const [weeks, setWeeks] = useState(initial);
  const [previousInitial, setPreviousInitial] = useState(initial);
  if (previousInitial !== initial) {
    setPreviousInitial(initial);
    setWeeks(initial);
  }
  const [tab, setTab] = useState<'weeks' | 'password'>('weeks');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState('');
  useEffect(() => {
    const timer = setInterval(() => router.refresh(), 60000);
    return () => clearInterval(timer);
  }, [router]);
  async function request(url: string, body?: unknown, method = 'POST') {
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const result = await response.json();
    if (!response.ok)
      throw new Error(result.error || 'Réessayez dans un instant.');
    return result;
  }
  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError('');
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      await request('/api/admin/login', data);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Connexion impossible.');
    } finally {
      setPending(false);
    }
  }
  async function update(
    week: Week,
    price = week.price,
    status = week.status === 'available' ? 'blocked' : 'available',
  ) {
    setPending(true);
    setError('');
    setSaved('');
    try {
      const data = await request(
        '/api/admin/weeks',
        { ...week, price, status },
        'PATCH',
      );
      setWeeks(data.weeks);
      setSaved('Enregistré. Le calendrier des visiteurs est à jour.');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Enregistrement impossible.');
      router.refresh();
    } finally {
      setPending(false);
    }
  }
  async function password(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setPending(true);
    setError('');
    setSaved('');
    try {
      await request('/api/admin/password', data);
      form.reset();
      setSaved(
        'Votre nouveau mot de passe est enregistré. Les autres sessions ont été déconnectées.',
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Modification impossible.');
    } finally {
      setPending(false);
    }
  }
  async function logout() {
    setPending(true);
    setError('');
    try {
      await request('/api/admin/logout');
      router.refresh();
    } catch {
      setError('Déconnexion impossible. Réessayez.');
    } finally {
      setPending(false);
    }
  }
  if (!loggedIn)
    return (
      <main id="contenu" className="admin-login">
        <Link className="footer-brand" href="/">
          <BrandMark />
          Villa Tai Bribosia
        </Link>
        <div className="login-card">
          <LockKeyhole size={28} />
          <p className="eyebrow">Espace propriétaire</p>
          <h1>Bienvenue chez vous.</h1>
          <p>Votre calendrier, simplement.</p>
          {configured ? (
            <form onSubmit={login}>
              <label>
                Mot de passe
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  maxLength={256}
                />
              </label>
              {error && (
                <p role="alert" className="form-error">
                  {error}
                </p>
              )}
              <button className="button" disabled={pending}>
                {pending ? 'Connexion…' : 'Ouvrir mon calendrier'}
              </button>
            </form>
          ) : (
            <p>La configuration du mot de passe est invalide.</p>
          )}
        </div>
        <Link href="/">← Retour au site</Link>
      </main>
    );
  const today = parisDate();
  return (
    <main id="contenu" className="admin-shell">
      <header className="admin-header">
        <Link className="footer-brand" href="/">
          Villa Tai Bribosia
        </Link>
        <span>Espace propriétaire</span>
        <button onClick={logout} disabled={pending}>
          <LogOut size={17} />
          Déconnexion
        </button>
      </header>
      <div className="admin-main owner-simple">
        <nav className="owner-tabs" aria-label="Gestion de la villa">
          <button
            aria-pressed={tab === 'weeks'}
            onClick={() => {
              setTab('weeks');
              setError('');
              setSaved('');
            }}
          >
            <CalendarDays size={18} />
            Disponibilités
          </button>
          <button
            aria-pressed={tab === 'password'}
            onClick={() => {
              setTab('password');
              setError('');
              setSaved('');
            }}
          >
            <LockKeyhole size={18} />
            Mot de passe
          </button>
        </nav>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        {saved && (
          <p className="saved-notice" role="status">
            <Check size={18} />
            {saved}
          </p>
        )}
        {tab === 'weeks' ? (
          <>
            <div className="admin-title">
              <div>
                <p className="eyebrow">
                  Votre été {weeks[0]?.start.slice(0, 4)}
                </p>
                <h1>Mes semaines de location</h1>
                <p>
                  Une case, un clic. Vos disponibilités sont enregistrées
                  automatiquement.
                </p>
              </div>
              <Link
                href="/disponibilites"
                target="_blank"
                className="button outline"
              >
                Voir le calendrier public ↗
              </Link>
            </div>
            <div className="owner-week-list">
              {weeks.map((w) => {
                const expired = w.start <= today;
                const available = w.status === 'available' && !expired;
                return (
                  <div
                    key={w.start}
                    className={`owner-week-row ${expired ? 'expired' : available ? 'available' : 'unavailable'}`}
                  >
                    <div>
                      <strong>
                        {dateLabel(w.start, 'fr')} — {dateLabel(w.end, 'fr')}
                      </strong>
                      <small>
                        {expired
                          ? 'Semaine commencée ou passée'
                          : '7 nuits · du samedi au samedi'}
                      </small>
                    </div>
                    <button
                      className="week-toggle"
                      role="checkbox"
                      aria-checked={available}
                      aria-label={`${dateLabel(w.start, 'fr')} : ${available ? 'disponible' : 'non disponible'}`}
                      disabled={pending || expired}
                      onClick={() => update(w)}
                    >
                      <span className="week-check" aria-hidden="true">
                        {!available && <X size={20} />}
                      </span>
                      {expired
                        ? 'Clôturée'
                        : available
                          ? 'Disponible'
                          : 'Non disponible'}
                    </button>
                  </div>
                );
              })}
            </div>
            <details className="owner-prices">
              <summary>Modifier les tarifs à la semaine</summary>
              <p>Laissez un prix vide pour afficher « Nous consulter ».</p>
              {weeks.map((w) => (
                <form
                  key={w.start + ':' + w.revision}
                  className="owner-price-row"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const v = new FormData(e.currentTarget).get('price');
                    void update(w, v === '' ? null : Number(v), w.status);
                  }}
                >
                  <label>
                    {dateLabel(w.start, 'fr')} — {dateLabel(w.end, 'fr')}
                    <input
                      name="price"
                      type="number"
                      min={1}
                      max={20000}
                      step={1}
                      defaultValue={w.price ?? ''}
                      disabled={w.start <= today}
                      aria-label={`Tarif de la semaine du ${dateLabel(w.start, 'fr')}`}
                    />
                  </label>
                  <button
                    className="button outline"
                    disabled={pending || w.start <= today}
                  >
                    Enregistrer
                  </button>
                </form>
              ))}
            </details>
          </>
        ) : (
          <section className="owner-password">
            <p className="eyebrow">Votre accès personnel</p>
            <h1>Changer mon mot de passe</h1>
            <p>Le nouveau mot de passe remplacera votre mot de passe actuel.</p>
            <form onSubmit={password}>
              <label>
                Mot de passe actuel
                <input
                  type="password"
                  name="currentPassword"
                  autoComplete="current-password"
                  required
                  maxLength={256}
                />
              </label>
              <label>
                Nouveau mot de passe
                <input
                  type="password"
                  name="newPassword"
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={256}
                  required
                />
              </label>
              <label>
                Confirmer le nouveau mot de passe
                <input
                  type="password"
                  name="confirmPassword"
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={256}
                  required
                />
              </label>
              <button className="button" disabled={pending}>
                {pending ? 'Enregistrement…' : 'Changer mon mot de passe'}
              </button>
            </form>
          </section>
        )}
      </div>
    </main>
  );
}
