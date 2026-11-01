export const villa = {
  name: 'Les Jours de Grasse',
  location: 'Grasse Saint-Jacques',
  season: 2027,
  bedrooms: 4,
  pool: { lengthMetres: 8, widthMetres: 4, private: true, alarm: true },
  gardenSquareMetres: 400,
  parkingSquareMetres: 80,
  bathrooms: 2,
  toilets: 2,
  terraces: 3,
  maxGuests: null,
  linenIncluded: true,
  bathroomTowelsIncluded: true,
  petsAllowed: false,
  partiesAllowed: false,
  rooms: [
    { name: 'Chambre 1', beds: 'Un lit de 160 cm' },
    {
      name: 'Chambre 2',
      beds: 'Un lit mezzanine de 140 cm, un lit de 90 cm et un clic-clac',
    },
    { name: 'Chambre 3', beds: 'Un lit de 140 cm' },
    {
      name: 'Chambre 4',
      beds: 'Lits superposés de 90 cm — configuration à confirmer',
    },
  ],
} as const;

export const surroundings = [
  {
    name: 'Grasse',
    title: 'Au pays des parfums',
    description:
      'Flâner dans la ville et découvrir le Musée international de la Parfumerie.',
    url: 'https://musees.paysdegrasse.fr/presentation-du-musee-0',
  },
  {
    name: 'Côté mer',
    title: 'Retrouver la Méditerranée',
    description: 'Découvrir la plage du Château à Mandelieu-La Napoule.',
    url: 'https://www.mandelieu-tourisme.com/equipement/plage-du-chateau-plage-publique/',
  },
  {
    name: 'L’arrière-pays',
    title: 'Prendre de la hauteur',
    description: 'Explorer Gourdon et les paysages des Préalpes d’Azur.',
    url: 'https://www.parc-prealpesdazur.fr/carte-interactive-apidae/',
  },
] as const;
