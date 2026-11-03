// Add only genuine guest reviews with permission and an identifiable source.
export type GuestReview = {
  name: string;
  rating: 1 | 2 | 3 | 4 | 5;
  fr: string;
  en: string;
  source: string;
};
export const guestReviews: GuestReview[] = [];
export const exampleReviews: GuestReview[] = [
  {
    name: 'Exemple 01',
    rating: 5,
    fr: 'Une semaine à profiter de la piscine et des repas sur la terrasse. Tout ce qu’il fallait pour se retrouver en famille.',
    en: 'A week of pool days and meals on the terrace. Everything for time together as a family.',
    source: 'Avis fictif · maquette',
  },
  {
    name: 'Exemple 02',
    rating: 5,
    fr: 'Un cadre paisible et de beaux espaces dehors. Nous avons particulièrement aimé les soirées dans le jardin.',
    en: 'Peaceful surroundings and lovely outdoor spaces. We especially enjoyed evenings in the garden.',
    source: 'Avis fictif · maquette',
  },
  {
    name: 'Exemple 03',
    rating: 5,
    fr: 'La maison nous a permis de partager de vrais moments de vacances, entre baignades, balades et parties de ping-pong.',
    en: 'A home for real holiday moments together, from swimming and exploring to games of table tennis.',
    source: 'Avis fictif · maquette',
  },
];
