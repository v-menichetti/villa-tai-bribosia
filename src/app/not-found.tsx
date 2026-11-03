import Link from 'next/link';
export default function NotFound() {
  return (
    <main id="contenu" className="container section">
      <p className="eyebrow">Page introuvable</p>
      <h1>Un petit détour.</h1>
      <p>Retrouvons le chemin de la villa.</p>
      <Link className="button" href="/">
        Revenir à la maison ↗
      </Link>
    </main>
  );
}
