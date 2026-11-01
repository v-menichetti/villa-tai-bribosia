import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { surroundings, villa } from '@/content/villa';
import {
  formatWeeklyPrice,
  rates,
  startingWeeklyPriceEur,
} from '@/content/rates';
import { site } from '@/lib/site';

export default function HomePage() {
  return (
    <>
      <div className="hero" id="accueil">
        <SiteHeader />
        <main id="contenu">
          <section className="hero-copy" aria-labelledby="hero-title">
            <p className="eyebrow">Villa privée · Grasse Saint-Jacques</p>
            <h1 id="hero-title">
              Les beaux
              <br />
              <em>jours.</em>
            </h1>
            <p className="hero-subtitle">
              Une maison pour se retrouver. Le Sud pour en profiter.
            </p>
            <div className="hero-bottom">
              <p>
                {villa.bedrooms} chambres / Piscine privée / {villa.terraces}{' '}
                terrasses
              </p>
              <a href="#villa" aria-label="Découvrir la villa">
                <ArrowDown size={30} aria-hidden="true" />
              </a>
              <p>Été {villa.season}</p>
            </div>
          </section>
          <section
            className="section house"
            id="villa"
            aria-labelledby="house-title"
          >
            <div>
              <p className="section-number">01 / La maison</p>
              <p className="eyebrow">Votre maison d’été</p>
              <h2 id="house-title">
                Ici, on prend
                <br />
                <em>le temps.</em>
              </h2>
            </div>
            <div className="house-copy">
              <p className="lead">
                À Grasse, une villa au calme, une piscine rien que pour vous et
                trois terrasses pour vivre dehors.
              </p>
              <p>
                Un bassin de 8 × 4 m équipé d’une alarme, un jardin de 400 m²,
                des transats, un barbecue avec plancha et une table de
                ping-pong.
              </p>
              <p>
                Quatre chambres, deux salles d’eau et deux WC. Les draps et les
                serviettes de salle d’eau sont fournis.
              </p>
              <a className="text-link" href="#tarifs">
                Préparer votre été <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </div>
          </section>
          <section
            className="section surroundings"
            id="alentours"
            aria-labelledby="surroundings-title"
          >
            <p className="section-number">02 / Les alentours</p>
            <h2 id="surroundings-title">
              La mer. Les collines.
              <br />
              <em>Et tout l’été devant vous.</em>
            </h2>
            <div className="destination-grid">
              {surroundings.map((place) => (
                <article key={place.name}>
                  <p className="eyebrow">{place.name}</p>
                  <h3>{place.title}</h3>
                  <p>{place.description}</p>
                  <a
                    className="text-link"
                    href={place.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Découvrir <ArrowUpRight size={17} aria-hidden="true" />
                    <span className="sr-only">
                      {' '}
                      — {place.name}, nouvel onglet
                    </span>
                  </a>
                </article>
              ))}
            </div>
          </section>
          <section
            className="section rates"
            id="tarifs"
            aria-labelledby="rates-title"
          >
            <div>
              <p className="section-number">03 / Votre été</p>
              <h2 id="rates-title">
                L’été {villa.season},<br />
                <em>à votre rythme.</em>
              </h2>
              <p className="lead">
                Dès {formatWeeklyPrice(startingWeeklyPriceEur)} / semaine
              </p>
              <p>
                Tarif dégressif pour plusieurs semaines consécutives, sur
                demande. La présence d’un tarif ne garantit pas la
                disponibilité.
              </p>
            </div>
            <div>
              <table>
                <caption className="sr-only">
                  Tarifs hebdomadaires pour l’été 2027
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Période</th>
                    <th scope="col">Par semaine</th>
                  </tr>
                </thead>
                <tbody>
                  {rates.map((period) => (
                    <tr key={period.start}>
                      <th scope="row">{period.label}</th>
                      <td>{formatWeeklyPrice(period.weeklyPriceEur)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="fine-print">
                Frais éventuels et conditions de séjour à confirmer auprès de la
                propriétaire.
              </p>
            </div>
          </section>
          <section
            className="section contact"
            id="sejour"
            aria-labelledby="contact-title"
          >
            <p className="eyebrow">On prépare votre été ?</p>
            <h2 id="contact-title">
              Il ne manque plus
              <br />
              <em>que vos dates.</em>
            </h2>
            <p>
              Une maison familiale dans un quartier résidentiel calme. Les
              animaux et les fêtes ne sont pas acceptés.
            </p>
            {site.contactEmail ? (
              <a
                className="pill"
                href={`mailto:${site.contactEmail}?subject=${encodeURIComponent('Séjour été 2027 — Les Jours de Grasse')}`}
              >
                Écrire à la propriétaire{' '}
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            ) : (
              <p className="opening-note">
                Les coordonnées de contact seront communiquées prochainement.
              </p>
            )}
          </section>
        </main>
      </div>
      <footer className="site-footer">
        <span>Les Jours de Grasse</span>
        <span>Grasse Saint-Jacques · Location estivale</span>
      </footer>
    </>
  );
}
