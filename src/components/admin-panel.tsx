'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CalendarDays,
  Check,
  LogOut,
  LockKeyhole,
  Save,
  X,
} from 'lucide-react';
import type { Week, WeekStatus } from '@/lib/availability';
import { dateLabel, priceLabel } from '@/lib/i18n';
const statusLabels: Record<WeekStatus, string> = {
  unconfirmed: 'À confirmer',
  available: 'Disponible',
  option: 'En option',
  booked: 'Réservée',
  blocked: 'Bloquée pour vous',
};
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
  const [editing, setEditing] = useState<Week | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState('');
  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError('');
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          Object.fromEntries(new FormData(event.currentTarget)),
        ),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Connexion impossible.');
    } finally {
      setPending(false);
    }
  }
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    setPending(true);
    setError('');
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/admin/weeks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          start: editing.start,
          revision: editing.revision,
          status: form.get('status'),
          price: form.get('price') === '' ? null : Number(form.get('price')),
        }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error);
      setWeeks(body.weeks);
      setSaved(
        `La semaine du ${dateLabel(editing.start, 'fr')} a été mise à jour sur le site.`,
      );
      setEditing(null);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Enregistrement impossible.');
    } finally {
      setPending(false);
    }
  }
  async function logout() {
    setPending(true);
    setError('');
    try {
      const response = await fetch('/api/admin/logout', { method: 'POST' });
      if (!response.ok) throw new Error();
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
          Villa Tai Bribosia
        </Link>
        <div className="login-card">
          <LockKeyhole size={28} />
          <p className="eyebrow">Espace propriétaire</p>
          <h1>Bienvenue chez vous.</h1>
          <p>
            Un seul endroit pour mettre à jour les semaines et les tarifs de
            votre villa.
          </p>
          {configured ? (
            <form onSubmit={login}>
              <label>
                Mot de passe
                <input
                  autoFocus
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
                {pending ? 'Connexion…' : 'Se connecter'}
              </button>
            </form>
          ) : (
            <p className="notice">
              L’espace propriétaire est prêt. Son mot de passe doit être
              configuré avant la première connexion.
            </p>
          )}
        </div>
        <Link href="/">← Retour au site</Link>
      </main>
    );
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
      <div className="admin-main">
        <div className="admin-title">
          <div>
            <p className="eyebrow">Votre calendrier · été 2027</p>
            <h1>Mes semaines de location</h1>
            <p>
              Choisissez une semaine, modifiez son statut ou son prix, puis
              enregistrez.
            </p>
          </div>
          <Link
            className="button outline"
            href="/disponibilites"
            target="_blank"
          >
            Voir le calendrier public ↗
          </Link>
        </div>
        {saved && (
          <p className="saved-notice" role="status">
            <Check size={19} />
            {saved}
          </p>
        )}
        <div className="admin-workspace">
          <div className="admin-weeks">
            {weeks.map((w) => (
              <button
                key={w.start}
                className={`admin-week ${editing?.start === w.start ? 'active' : ''}`}
                onClick={() => {
                  setEditing(w);
                  setError('');
                  setSaved('');
                }}
              >
                <CalendarDays size={22} />
                <span>
                  <strong>
                    {dateLabel(w.start, 'fr')} — {dateLabel(w.end, 'fr')}
                  </strong>
                  <small>7 nuits · du samedi au samedi</small>
                </span>
                <span className={`status ${w.status}`}>
                  {statusLabels[w.status]}
                </span>
                <strong>{priceLabel(w.price, 'fr')}</strong>
                <span className="edit-label">Modifier →</span>
              </button>
            ))}
          </div>
          <aside className="week-editor">
            {editing ? (
              <form key={editing.start} onSubmit={save}>
                <div className="editor-heading">
                  <h2>Modifier la semaine</h2>
                  <button
                    type="button"
                    onClick={() => setEditing(null)}
                    aria-label="Fermer l’éditeur"
                  >
                    <X size={20} />
                  </button>
                </div>
                <p>
                  {dateLabel(editing.start, 'fr')} —{' '}
                  {dateLabel(editing.end, 'fr')} 2027
                </p>
                <label>
                  Statut
                  <select name="status" defaultValue={editing.status}>
                    {Object.entries(statusLabels).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Prix de la semaine (€)
                  <input
                    name="price"
                    type="number"
                    min={1}
                    max={20000}
                    step={1}
                    defaultValue={editing.price ?? ''}
                  />
                </label>
                <p className="field-help">
                  Laissez vide pour afficher « Nous consulter ».
                </p>
                <p className="field-help">
                  Les semaines en option, réservées ou bloquées apparaissent
                  simplement comme indisponibles sur le site.
                </p>
                {error && (
                  <p role="alert" className="form-error">
                    {error}
                  </p>
                )}
                <button className="button" disabled={pending}>
                  <Save size={17} />
                  {pending
                    ? 'Enregistrement…'
                    : 'Enregistrer les modifications'}
                </button>
              </form>
            ) : (
              <>
                <CalendarDays size={32} />
                <h2>Une mise à jour ?</h2>
                <p>
                  Sélectionnez une semaine dans la liste. Vos changements seront
                  visibles sur le site après l’enregistrement.
                </p>
                {error && (
                  <p className="form-error" role="alert">
                    {error}
                  </p>
                )}
              </>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
