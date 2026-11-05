// Reviews supplied by the owner on 2026-11-05. French text preserved verbatim.
// English text is our translation, not the reviewer's original wording.
export const reviewSource = 'https://www.airbnb.fr/rooms/647612120238692377';
export type GuestReview = {
  name: string;
  rating: 1 | 2 | 3 | 4 | 5;
  month: string;
  fr: string;
  en: string;
};
export const guestReviews: GuestReview[] = [
  {
    name: 'Jerome',
    rating: 5,
    month: '2026-08',
    fr: 'Nous avons passé une superbe semaine de vacances chez Véronique. Veronique est aux petits soins, elle sait accueillir et mettre à l’aise ses invités. La maison est très bien équipée, l’extérieur est parfait pour se reposer et profiter de la piscine. Nous reviendrons avec grand plaisir !',
    en: 'We had a wonderful week on holiday at Véronique’s. Veronique is very attentive and knows how to welcome her guests and make them feel at ease. The house is very well equipped, and the outdoor area is perfect for relaxing and enjoying the pool. We would be delighted to return!',
  },
  {
    name: 'Maria Christina',
    rating: 5,
    month: '2026-09',
    fr: 'Tout était top !',
    en: 'Everything was great!',
  },
  {
    name: 'Sylvie',
    rating: 5,
    month: '2026-08',
    fr: 'Super séjour chez Véronique . Très calme. , la piscine est top. Hôte très sympathique , disponible et réactive . On recommande le logement !',
    en: 'A great stay at Véronique’s. Very peaceful, and the pool is great. A very friendly, available and responsive host. We recommend this home!',
  },
  {
    name: 'Açelya',
    rating: 5,
    month: '2026-07',
    fr: 'Nous avons passé un excellent séjour dans cette villa ! La maison est magnifique, spacieuse et parfaitement équipée. Tout correspondait aux photo. La piscine et les espaces extérieurs sont très agréables et permettent de profiter pleinement du séjour. L’emplacement est idéal, au calme tout en restant proche des principaux sites à visiter. Les hôtes ont été très accueillants, disponibles et réactifs tout au long de notre séjour. Nous recommandons cette villa les yeux fermés. Merci encore pour votre accueil !',
    en: 'We had an excellent stay in this villa! The house is beautiful, spacious and perfectly equipped. Everything matched the photos. The pool and outdoor spaces are very pleasant and make it easy to enjoy the stay fully. The location is ideal: peaceful yet close to the main places to visit. The hosts were very welcoming, available and responsive throughout our stay. We wholeheartedly recommend this villa. Thank you again for your welcome!',
  },
  {
    name: 'François',
    rating: 5,
    month: '2025-09',
    fr: 'Le séjour dans la villa de Véronique s’est extrêmement bien passé. Le quartier est très calme et il y a énormément d’activités disponibles dans les alentours pour s’occuper. La partie extérieure de la maison est aussi super pour se détendre. Il y a tout ce qu’il faut pour passer un bon séjour. La communication a été parfaite du début à la fin.',
    en: 'Our stay at Véronique’s villa went extremely well. The neighbourhood is very quiet, and there are plenty of activities nearby to keep you busy. The outdoor area is also great for relaxing. There is everything you need for a good stay. Communication was perfect from start to finish.',
  },
];
