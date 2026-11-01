import { ArrowUpRight } from 'lucide-react';

export function SiteHeader() {
  return (
    <header className="site-header">
      <a
        className="wordmark"
        href="#accueil"
        aria-label="Les Jours de Grasse, accueil"
      >
        Les Jours
        <br />
        de Grasse
      </a>
      <nav aria-label="Navigation principale">
        <a href="#villa">La villa</a>
        <a href="#alentours">Les alentours</a>
        <a href="#tarifs">L’été 2027</a>
      </nav>
      <a className="pill" href="#sejour">
        Préparer mon séjour <ArrowUpRight size={17} aria-hidden="true" />
      </a>
    </header>
  );
}
