// Source of truth: the owner's updated 2027 PowerPoint.
export const villa = {
  name: 'Villa Tai Bribosia',
  location: 'Grasse Saint-Jacques',
  bedrooms: 4,
  maxGuests: 10,
  bathrooms: 2,
  toilets: 2,
} as const;
export const photographs = [
  {
    id: 'aerial-oblique',
    category: 'aerial',
    fr: 'La maison et sa piscine vues du ciel',
    en: 'The house and pool from above',
  },
  {
    id: 'pool-sunset',
    category: 'outdoors',
    fr: 'Un ciel flamboyant au bord de la piscine',
    en: 'A blazing sunset by the pool',
  },
  {
    id: 'pool',
    category: 'outdoors',
    fr: 'La piscine privée, entourée de verdure',
    en: 'The private pool, surrounded by greenery',
  },
  {
    id: 'terrace',
    category: 'outdoors',
    fr: 'La terrasse et son espace repas',
    en: 'The terrace and outdoor dining area',
  },
  {
    id: 'terrace-lounge',
    category: 'outdoors',
    fr: 'Le salon de jardin',
    en: 'The garden lounge',
  },
  {
    id: 'facade',
    category: 'outdoors',
    fr: 'La maison à Grasse Saint-Jacques',
    en: 'The house in Grasse Saint-Jacques',
  },
  {
    id: 'room-1',
    category: 'bedrooms',
    fr: 'Chambre 1 · lit de 160 cm',
    en: 'Bedroom 1 · 160 cm double bed',
  },
  {
    id: 'room-2',
    category: 'bedrooms',
    fr: 'Chambre 2 · lit de 140 cm',
    en: 'Bedroom 2 · 140 cm double bed',
  },
  {
    id: 'room-3',
    category: 'bedrooms',
    fr: 'Chambre 3 · mezzanine, lit simple et clic-clac',
    en: 'Bedroom 3 · loft bed, single bed and sofa bed',
  },
  {
    id: 'room-4',
    category: 'bedrooms',
    fr: 'Chambre 4 · lits superposés',
    en: 'Bedroom 4 · bunk beds',
  },
  { id: 'living', category: 'indoors', fr: 'Le séjour', en: 'The living room' },
  {
    id: 'bathroom-1',
    category: 'indoors',
    fr: 'La première salle d’eau',
    en: 'The first shower room',
  },
  {
    id: 'bathroom-2',
    category: 'indoors',
    fr: 'La deuxième salle d’eau',
    en: 'The second shower room',
  },
  {
    id: 'ping-pong',
    category: 'outdoors',
    fr: 'Le coin ping-pong',
    en: 'The table tennis area',
  },
  {
    id: 'garden',
    category: 'outdoors',
    fr: 'Le jardin et la balançoire',
    en: 'The garden and swing',
  },
] as const;
export const rooms = [
  {
    image: 'room-1',
    fr: 'Un lit de 160 cm, des rangements et un ventilateur. Lit parapluie disponible sur demande.',
    en: 'A 160 cm double bed, storage and a fan. Travel cot available on request.',
  },
  {
    image: 'room-2',
    fr: 'Un lit de 140 cm, un bureau, un grand placard et des jouets pour les enfants.',
    en: 'A 140 cm double bed, desk, large wardrobe and children’s toys.',
  },
  {
    image: 'room-3',
    fr: 'Un lit mezzanine de 140 cm, un lit de 90 cm et un clic-clac de 140 cm. Rangements, jeux, livres et ventilateur.',
    en: 'A 140 cm loft bed, a 90 cm single bed and a 140 cm sofa bed. Storage, games, books and a fan.',
  },
  {
    image: 'room-4',
    fr: 'Des lits superposés de 90 cm, un bureau, des rangements et des ventilateurs.',
    en: '90 cm bunk beds, a desk, storage and fans.',
  },
] as const;
