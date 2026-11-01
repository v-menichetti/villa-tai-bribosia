import Link from 'next/link';
export default function NotFound() {
  return (
    <main id="contenu" className="section contact">
      <p className="eyebrow">Page introuvable</p>
      <h1>Un petit détour.</h1>
      <p>Retrouvons le chemin des beaux jours.</p>
      <Link className="pill" href="/">
        Revenir à la maison ↗
      </Link>
    </main>
  );
}
