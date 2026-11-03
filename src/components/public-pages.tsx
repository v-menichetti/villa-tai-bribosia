import Link from 'next/link';
import {
  UsersRound,
  BedDouble,
  Waves,
  ShowerHead,
  CookingPot,
  AirVent,
  Flame,
  CircleDot,
  Baby,
  CarFront,
  ArrowRight,
} from 'lucide-react';
import { Hero } from './hero';
import { Photo, TextLink, PageIntro, ContactBanner } from './shared';
import { AvailabilityCalendar } from './availability-calendar';
import { Gallery } from './gallery';
import { ContactForm } from './contact-form';
import { rooms } from '@/content/villa';
import {
  paths,
  dateLabel,
  priceLabel,
  type Locale,
  type PageKey,
} from '@/lib/i18n';
import type { PublicWeek } from '@/lib/availability';

export function PublicPage({
  page,
  locale,
  weeks,
  arrival,
  departure,
  mailReady,
}: {
  page: PageKey;
  locale: Locale;
  weeks: PublicWeek[];
  arrival?: string;
  departure?: string;
  mailReady: boolean;
}) {
  const fr = locale === 'fr';
  if (page === 'home') return <Home locale={locale} weeks={weeks} />;
  if (page === 'house') return <House locale={locale} />;
  if (page === 'photos')
    return (
      <>
        <PageIntro
          eyebrow={fr ? 'La villa en images' : 'In pictures'}
          title={
            fr ? 'Un avant-goût des vacances.' : 'A taste of your holiday.'
          }
        >
          {fr
            ? 'La piscine, les terrasses, les chambres : découvrez chaque espace de la maison.'
            : 'The pool, terraces and bedrooms: take a closer look at the villa.'}
        </PageIntro>
        <section className="container section-bottom">
          <Gallery locale={locale} />
        </section>
        <ContactBanner locale={locale} />
      </>
    );
  if (page === 'area') return <Area locale={locale} />;
  if (page === 'availability')
    return (
      <>
        <PageIntro
          eyebrow={fr ? 'Votre été 2027' : 'Your summer 2027'}
          title={
            fr
              ? 'Choisissez votre semaine au soleil.'
              : 'Choose your week in the sun.'
          }
        >
          {fr
            ? 'Séjours à la semaine, du samedi au samedi. Un premier pas vers vos prochaines vacances.'
            : 'Weekly stays, Saturday to Saturday. A first step towards your next holiday.'}
        </PageIntro>
        <section className="container section-bottom">
          <AvailabilityCalendar locale={locale} weeks={weeks} />
          <p className="fine-print">
            {fr
              ? 'Les semaines « à confirmer » doivent être vérifiées auprès de la propriétaire. Les disponibilités peuvent évoluer jusqu’à la confirmation du séjour.'
              : 'Weeks marked “to confirm” must be checked with the owner. Availability may change until your stay is confirmed.'}
          </p>
        </section>
        <section className="sand section">
          <div className="container rates-layout">
            <div>
              <p className="eyebrow">
                {fr ? 'Les tarifs à la semaine' : 'Weekly rates'}
              </p>
              <h2>
                {fr ? 'L’été, en toute simplicité.' : 'Summer, made simple.'}
              </h2>
              <p>
                {fr
                  ? 'Une réduction est proposée pour plusieurs semaines consécutives. Contactez-nous pour un tarif adapté à votre séjour.'
                  : 'A reduction is available for consecutive weeks. Contact us for a personalised quote.'}
              </p>
              <p className="fine-print">
                {fr
                  ? 'Arrivée dès 14 h · Départ avant 10 h. Les frais éventuels seront précisés par la propriétaire.'
                  : 'Check-in from 2 pm · Check-out before 10 am. Any additional charges will be confirmed by the owner.'}
              </p>
            </div>
            <table>
              <caption className="sr-only">
                {fr
                  ? 'Tarifs des semaines de l’été 2027'
                  : 'Summer 2027 weekly rates'}
              </caption>
              <thead>
                <tr>
                  <th>{fr ? 'Du samedi au samedi' : 'Saturday to Saturday'}</th>
                  <th>{fr ? 'Par semaine' : 'Per week'}</th>
                </tr>
              </thead>
              <tbody>
                {weeks.map((w) => (
                  <tr key={w.start}>
                    <td>
                      {dateLabel(w.start, locale)} — {dateLabel(w.end, locale)}
                    </td>
                    <td>{priceLabel(w.price, locale)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <ContactBanner locale={locale} />
      </>
    );
  if (page === 'contact')
    return (
      <>
        <PageIntro
          eyebrow={fr ? 'Contacter la propriétaire' : 'Contact the owner'}
          title={fr ? 'Parlons de votre séjour.' : 'Let’s plan your stay.'}
        />
        <section className="container contact-layout section-bottom">
          <div className="contact-intro">
            <p className="lead">
              {fr
                ? 'Une question sur la maison ou une envie de vacances à Grasse ? Partagez vos dates et le nombre de voyageurs. Nous vous répondrons par e-mail.'
                : 'A question about the villa, or thinking of a holiday in Grasse? Share your dates and the number of guests. We will reply by email.'}
            </p>
            <Photo
              id="terrace"
              alt={fr ? 'La terrasse de la villa' : 'The villa terrace'}
            />
            <h2>Villa Tai Bribosia</h2>
            <p>Grasse Saint-Jacques · Côte d’Azur</p>
            <p className="fine-print">
              {fr
                ? 'Location estivale uniquement · 10 personnes maximum'
                : 'Summer stays only · Up to 10 guests'}
            </p>
          </div>
          <ContactForm
            locale={locale}
            weeks={weeks}
            initialArrival={arrival}
            initialDeparture={departure}
            configured={mailReady}
          />
        </section>
      </>
    );
  return <Privacy locale={locale} />;
}

function Facts({ locale }: { locale: Locale }) {
  const fr = locale === 'fr';
  return (
    <div className="facts-strip">
      {[
        { icon: UsersRound, text: fr ? '10 personnes' : '10 guests' },
        { icon: BedDouble, text: fr ? '4 chambres' : '4 bedrooms' },
        { icon: Waves, text: fr ? 'Piscine privée' : 'Private pool' },
        { icon: ShowerHead, text: fr ? '2 salles d’eau' : '2 shower rooms' },
      ].map(({ icon: Icon, text }) => (
        <div key={text}>
          <Icon strokeWidth={1.35} aria-hidden="true" />
          <span>{text}</span>
        </div>
      ))}
    </div>
  );
}
function Amenities({ locale }: { locale: Locale }) {
  const fr = locale === 'fr';
  return (
    <section className="amenities sand">
      <div className="container">
        <h2 className="ruled-heading">
          {fr
            ? 'Tout pour profiter de votre séjour'
            : 'Everything for an easy stay'}
        </h2>
        <div className="amenity-grid">
          {[
            {
              icon: CookingPot,
              text: fr ? 'Cuisine équipée' : 'Equipped kitchen',
            },
            {
              icon: AirVent,
              text: fr ? 'Climatisation séjour' : 'Living room AC',
            },
            { icon: Flame, text: fr ? 'Barbecue au gaz' : 'Gas barbecue' },
            { icon: CircleDot, text: fr ? 'Ping-pong' : 'Table tennis' },
            { icon: Baby, text: fr ? 'Équipement bébé' : 'Baby equipment' },
            { icon: CarFront, text: fr ? 'Parking privé' : 'Private parking' },
          ].map(({ icon: Icon, text }) => (
            <div key={text}>
              <Icon strokeWidth={1.3} aria-hidden="true" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function Home({ locale, weeks }: { locale: Locale; weeks: PublicWeek[] }) {
  const fr = locale === 'fr';
  const prices = weeks.flatMap((w) => (w.price === null ? [] : [w.price]));
  const minimum = prices.length ? Math.min(...prices) : null;
  return (
    <>
      <Hero locale={locale} />
      <Facts locale={locale} />
      <section className="container section home-intro">
        <div className="intro-copy">
          <p className="eyebrow">
            {fr ? 'Bienvenue à la villa' : 'Welcome to the villa'}
          </p>
          <h2>
            {fr
              ? 'Une maison pour partager l’été'
              : 'A home for a summer together'}
          </h2>
          <p>
            {fr
              ? 'À Grasse, profitez d’une maison familiale au calme, avec piscine privée et terrasses aménagées. Baignades, repas dehors et moments ensemble : chacun trouve sa place.'
              : 'Enjoy a peaceful family home in Grasse, with a private pool and furnished terraces. Swimming, outdoor meals and time together: there’s space for everyone.'}
          </p>
          <TextLink href={paths[locale].house}>
            {fr ? 'Visiter la maison' : 'Explore the villa'}
          </TextLink>
        </div>
        <div className="intro-photos">
          <figure>
            <Photo
              id="terrace"
              alt={
                fr
                  ? 'La terrasse et ses tables hautes pour les repas dehors'
                  : 'The terrace with high tables for outdoor meals'
              }
            />
            <figcaption>
              {fr
                ? 'La terrasse et l’espace repas'
                : 'The terrace and dining area'}
            </figcaption>
          </figure>
          <figure>
            <Photo
              id="room-1"
              alt={
                fr
                  ? 'La chambre avec son lit de 160 cm'
                  : 'The bedroom with a 160 cm double bed'
              }
            />
            <figcaption>
              {fr ? 'Une des quatre chambres' : 'One of the four bedrooms'}
            </figcaption>
          </figure>
          <Link className="button outline" href={paths[locale].photos}>
            {fr ? 'Voir toutes les photos' : 'View all photos'}
          </Link>
        </div>
      </section>
      <Amenities locale={locale} />
      <section className="container section home-availability">
        <div>
          <h2>
            {fr
              ? 'Votre prochaine semaine au soleil'
              : 'Your next week in the sun'}
          </h2>
          <p>
            {fr
              ? 'Location estivale · Du samedi au samedi'
              : 'Summer stays · Saturday to Saturday'}
          </p>
          <div className="starting-rate">
            <span>{fr ? 'Été 2027' : 'Summer 2027'}</span>
            <p>
              {minimum !== null && (fr ? 'Dès ' : 'From ')}
              <strong>{priceLabel(minimum, locale)}</strong>
              {minimum !== null && (fr ? ' / semaine' : ' / week')}
            </p>
          </div>
          <Link className="button" href={paths[locale].availability}>
            {fr ? 'Voir les disponibilités' : 'See availability'}
          </Link>
        </div>
        <AvailabilityCalendar locale={locale} weeks={weeks} compact />
      </section>
      <section className="container section-bottom surroundings">
        <h2 className="ruled-heading">
          {fr ? 'Entre mer et arrière-pays' : 'Between coast and countryside'}
        </h2>
        <p>
          {fr
            ? 'Grasse, le littoral et les villages perchés à découvrir pendant votre séjour.'
            : 'Grasse, the coast and hilltop villages to explore during your stay.'}
        </p>
        <div className="destination-grid">
          <Link className="destination" href={paths[locale].area + '#grasse'}>
            <Photo
              id="grasse"
              alt={
                fr
                  ? 'Les façades colorées de Grasse'
                  : 'The colourful buildings of Grasse'
              }
            />
            <span>
              {fr ? 'Découvrir Grasse' : 'Discover Grasse'}
              <ArrowRight size={17} />
            </span>
          </Link>
          <Link className="destination" href={paths[locale].area + '#gourdon'}>
            <Photo
              id="gourdon"
              alt={
                fr
                  ? 'Le village perché de Gourdon, vu du nord'
                  : 'The hilltop village of Gourdon, seen from the north'
              }
            />
            <span>
              {fr
                ? 'Explorer les villages perchés'
                : 'Explore hilltop villages'}
              <ArrowRight size={17} />
            </span>
          </Link>
        </div>
      </section>
      <ContactBanner locale={locale} />
    </>
  );
}
function House({ locale }: { locale: Locale }) {
  const fr = locale === 'fr';
  return (
    <>
      <PageIntro
        eyebrow={
          fr
            ? 'La maison · jusqu’à 10 personnes'
            : 'The villa · up to 10 guests'
        }
        title={
          fr
            ? 'Entrez, vous êtes en vacances.'
            : 'Come in. Make yourself at home.'
        }
      >
        {fr
          ? 'Quatre chambres, deux salles d’eau et des espaces pour se retrouver, dedans comme dehors.'
          : 'Four bedrooms, two shower rooms and space to spend time together, indoors and out.'}
      </PageIntro>
      <div className="container">
        <Photo
          id="terrace-lounge"
          alt={
            fr ? 'Le salon de jardin de la villa' : 'The villa garden lounge'
          }
          className="panorama"
          priority
        />
      </div>
      <section className="container section">
        <p className="eyebrow">
          {fr ? 'À chacun son espace' : 'Room for everyone'}
        </p>
        <h2>
          {fr
            ? 'Quatre chambres pour se reposer'
            : 'Four bedrooms to unwind in'}
        </h2>
        <div className="rooms-grid">
          {rooms.map((r, i) => (
            <article key={r.image}>
              <Photo
                id={r.image}
                alt={`${fr ? 'Chambre' : 'Bedroom'} ${i + 1}`}
              />
              <h3>
                {fr ? 'Chambre' : 'Bedroom'} {i + 1}
              </h3>
              <p>{r[locale]}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="sand section">
        <div className="container story-row">
          <Photo
            id="living"
            alt={fr ? 'Le séjour de la villa' : 'The villa living room'}
          />
          <div>
            <p className="eyebrow">
              {fr ? 'Le confort au quotidien' : 'Everyday comfort'}
            </p>
            <h2>{fr ? 'Comme à la maison.' : 'Just like home.'}</h2>
            <p>
              {fr
                ? 'Le séjour et la cuisine sont climatisés. La cuisine est équipée de plaques à induction, d’un réfrigérateur-congélateur, d’un lave-vaisselle, d’un four, d’un micro-ondes, d’un grille-pain et d’une cafetière.'
                : 'The living room and kitchen are air-conditioned. The kitchen has an induction hob, fridge-freezer, dishwasher, oven, microwave, toaster and coffee maker.'}
            </p>
            <p>
              {fr
                ? 'Dans l’arrière-cuisine : lave-linge et sèche-linge. Pour les petits : chaise haute, rehausseur et lit parapluie sur demande.'
                : 'A washing machine and dryer are available in the utility room. For little ones: a high chair, booster seat and travel cot on request.'}
            </p>
          </div>
        </div>
      </section>
      <section className="container section">
        <div className="section-heading">
          <p className="eyebrow">
            {fr
              ? 'Deux salles d’eau · deux WC'
              : 'Two shower rooms · two toilets'}
          </p>
          <h2>
            {fr ? 'De la place pour se préparer.' : 'Space to get ready.'}
          </h2>
          <p>
            {fr
              ? 'Deux douches, dont une à l’italienne. Deux serviettes par personne sont fournies ; un sèche-cheveux est disponible dans la première salle d’eau.'
              : 'Two showers, including a walk-in shower. Two towels per person are provided; a hairdryer is available in the first shower room.'}
          </p>
        </div>
        <div className="photo-pair">
          <Photo
            id="bathroom-1"
            alt={fr ? 'Première salle d’eau' : 'First shower room'}
          />
          <Photo
            id="bathroom-2"
            alt={fr ? 'Deuxième salle d’eau' : 'Second shower room'}
          />
        </div>
      </section>
      <section className="sand section">
        <div className="container story-row">
          <div>
            <p className="eyebrow">{fr ? 'La vie dehors' : 'Life outdoors'}</p>
            <h2>
              {fr
                ? 'Profiter de chaque journée.'
                : 'Make the most of every day.'}
            </h2>
            <p>
              {fr
                ? 'Une piscine privée de 8 × 4 m avec alarme (profondeur de 1,10 à 1,65 m), une terrasse en bois de 40 m² et six transats pour les pauses au soleil.'
                : 'A private 8 × 4 m pool with an alarm (1.10 to 1.65 m deep), a 40 m² wooden deck and six sun loungers for sunny afternoons.'}
            </p>
            <p>
              {fr
                ? 'Pour les repas et les soirées : deux bars hauts de six et quatre places, un barbecue au gaz et un canapé d’extérieur six places. Une table de ping-pong et une balançoire complètent le jardin.'
                : 'For outdoor meals and evenings: two high tables seating six and four, a gas barbecue and a six-seat garden sofa. Table tennis and a swing complete the garden.'}
            </p>
          </div>
          <Photo
            id="pool"
            alt={
              fr ? 'La piscine privée de 8 × 4 m' : 'The private 8 × 4 m pool'
            }
          />
        </div>
      </section>
      <section className="container section practical">
        <h2>{fr ? 'Avant de poser vos valises' : 'Before you arrive'}</h2>
        <div>
          <p>
            {fr
              ? 'Arrivée le samedi dès 14 h, départ avant 10 h. Parking privé pour trois voitures et une remorque.'
              : 'Saturday check-in from 2 pm; check-out before 10 am. Private parking for three cars and a trailer.'}
          </p>
          <p>
            {fr
              ? 'La villa accueille jusqu’à 10 personnes. Les animaux, les fêtes et le tabac à l’intérieur ne sont pas autorisés. Merci de respecter le calme après 22 h.'
              : 'The villa accommodates up to 10 guests. No pets, parties or indoor smoking. Please respect the peace and quiet after 10 pm.'}
          </p>
          <TextLink href={paths[locale].availability}>
            {fr ? 'Choisir ma semaine' : 'Choose my week'}
          </TextLink>
        </div>
      </section>
      <ContactBanner locale={locale} />
    </>
  );
}
function Area({ locale }: { locale: Locale }) {
  const fr = locale === 'fr';
  return (
    <>
      <PageIntro
        eyebrow={fr ? 'Autour de la villa' : 'Around the villa'}
        title={
          fr ? 'Grasse, la mer, les collines.' : 'Grasse, the sea, the hills.'
        }
      >
        {fr
          ? 'Une journée à découvrir les environs, puis le plaisir de rentrer pour une baignade.'
          : 'Spend a day exploring, then come home for a swim.'}
      </PageIntro>
      <section id="grasse" className="container section-bottom story-row">
        <Photo
          id="grasse"
          alt={
            fr
              ? 'Le centre historique de Grasse'
              : 'The historic centre of Grasse'
          }
        />
        <div>
          <p className="eyebrow">01 / Grasse</p>
          <h2>
            {fr
              ? 'Flâner au pays des parfums.'
              : 'Wander through perfume country.'}
          </h2>
          <p>
            {fr
              ? 'Ruelles, façades colorées et patrimoine parfumé : prenez le temps de découvrir le centre historique de Grasse et ses parfumeries, notamment Fragonard.'
              : 'Narrow streets, colourful façades and perfume heritage: take your time exploring historic Grasse and its perfumeries, including Fragonard.'}
          </p>
          <a
            className="text-link"
            href="https://www.fragonard.com/"
            target="_blank"
            rel="noreferrer"
          >
            {fr ? 'Découvrir Fragonard' : 'Discover Fragonard'} ↗
          </a>
        </div>
      </section>
      <section className="sand section">
        <div className="container story-row">
          <div>
            <p className="eyebrow">
              {fr ? '02 / Le littoral' : '02 / The coast'}
            </p>
            <h2>
              {fr ? 'Une journée au bord de la mer.' : 'A day beside the sea.'}
            </h2>
            <p>
              {fr
                ? 'Direction Mandelieu-la-Napoule pour une promenade sur le littoral et une pause à la plage du Château. Un autre rythme, entre baignade et balade.'
                : 'Head to Mandelieu-la-Napoule for a coastal walk and time at the Plage du Château. A change of pace, between swimming and strolling.'}
            </p>
            <p className="fine-print">
              {fr
                ? 'Les temps de trajet varient selon la circulation, notamment en été.'
                : 'Journey times vary with traffic, especially in summer.'}
            </p>
            <a
              className="text-link"
              href="https://www.mandelieu-tourisme.com/equipement/plage-du-chateau-plage-publique/"
              target="_blank"
              rel="noreferrer"
            >
              {fr ? 'Préparer une sortie côté mer' : 'Plan a day by the sea'} ↗
            </a>
          </div>
          <div className="coast-illustration">
            <Waves strokeWidth={0.7} aria-hidden="true" />
            <p>
              Mandelieu
              <br />
              La Napoule
            </p>
            <span>
              {fr ? 'Un air de Méditerranée' : 'A Mediterranean escape'}
            </span>
          </div>
        </div>
      </section>
      <section id="gourdon" className="container section story-row">
        <div>
          <Photo
            id="gourdon"
            alt={
              fr
                ? 'Gourdon vu depuis la route de Caussols'
                : 'Gourdon seen from the road to Caussols'
            }
          />
          <p className="image-credit">
            MOSSOT ·{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Gourdon_(Alpes-Maritimes)_-343.jpg">
              Wikimedia Commons
            </a>{' '}
            ·{' '}
            <a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>
          </p>
        </div>
        <div>
          <p className="eyebrow">
            {fr ? '03 / L’arrière-pays' : '03 / The hinterland'}
          </p>
          <h2>
            {fr ? 'Prendre un peu de hauteur.' : 'Take the scenic route.'}
          </h2>
          <p>
            {fr
              ? 'Gourdon, ses ruelles et ses panoramas offrent un autre visage de la Côte d’Azur. Prévoyez une promenade dans le village et prenez le temps de regarder les paysages.'
              : 'Gourdon, its streets and panoramic views offer another side of the Riviera. Plan a stroll through the village and take time to enjoy the scenery.'}
          </p>
          <a
            className="text-link"
            href="https://www.gourdon06.fr/"
            target="_blank"
            rel="noreferrer"
          >
            {fr ? 'Découvrir Gourdon' : 'Discover Gourdon'} ↗
          </a>
        </div>
      </section>
      <ContactBanner locale={locale} />
    </>
  );
}
function Privacy({ locale }: { locale: Locale }) {
  const fr = locale === 'fr';
  return (
    <>
      <PageIntro
        eyebrow="Villa Tai Bribosia"
        title={fr ? 'Confidentialité & crédits' : 'Privacy & credits'}
      />
      <article className="container prose section-bottom">
        <h2>{fr ? 'Vos demandes de séjour' : 'Your enquiries'}</h2>
        <p>
          {fr
            ? 'Les informations du formulaire sont utilisées pour répondre à votre demande et préparer votre séjour. Elles ne sont pas utilisées à des fins publicitaires. Aucun paiement ni réservation automatique n’est effectué sur ce site.'
            : 'Information submitted through the form is used to respond to your enquiry and prepare your stay. It is not used for advertising. This website does not process payments or confirm bookings automatically.'}
        </p>
        <p>
          {fr
            ? 'Lorsque l’envoi est activé, votre message est transmis par le service Resend à la propriétaire. Les demandes ne sont pas enregistrées dans la base du site. Pour toute question ou demande de suppression, contactez la propriétaire via le formulaire.'
            : 'When email delivery is enabled, your message is sent to the owner through Resend. Enquiries are not saved in the website database. For questions or deletion requests, contact the owner using the form.'}
        </p>
        <h2>{fr ? 'Cookies' : 'Cookies'}</h2>
        <p>
          {fr
            ? 'Aucun cookie publicitaire ni outil de suivi d’audience n’est utilisé. Un cookie de session, valable 24 heures, est utilisé uniquement pour sécuriser l’espace propriétaire.'
            : 'No advertising cookies or audience tracking tools are used. A 24-hour session cookie is used solely to secure the owner area.'}
        </p>
        <h2>{fr ? 'Photographies' : 'Photography'}</h2>
        <p>
          {fr
            ? 'Les photos de la villa et de Grasse proviennent de la présentation fournie par la propriétaire.'
            : 'Photographs of the villa and Grasse come from the presentation supplied by the owner.'}
        </p>
        <p>
          Gourdon : MOSSOT,{' '}
          <a href="https://commons.wikimedia.org/wiki/File:Gourdon_(Alpes-Maritimes)_-343.jpg">
            Gourdon (Alpes-Maritimes) -343
          </a>
          , <a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>
          .{' '}
          {fr
            ? 'Image redimensionnée, convertie au format WebP et recadrée à l’affichage.'
            : 'Image resized, converted to WebP and cropped for display.'}
        </p>
        <p className="notice">
          {fr
            ? 'Site en préparation. Les informations légales de l’exploitant et de l’hébergeur seront complétées avant l’ouverture au public.'
            : 'Website in preparation. Operator and hosting legal information will be completed before public launch.'}
        </p>
      </article>
    </>
  );
}
