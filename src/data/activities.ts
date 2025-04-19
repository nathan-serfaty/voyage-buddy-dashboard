import { Activity } from "@/types/activity";

export type { Activity };

export const activities: Activity[] = [
  {
    id: "1",
    title: "Great Erg 2024: Au Cœur de l'Aventure Saharienne",
    description: "Une expérience unique combinant sport et découverte dans les déserts enchanteurs du Sud tunisien. Course à pied, visites culturelles et nuit sous les étoiles dans un campement traditionnel. Du 27 octobre au 3 novembre 2024, un séjour sportif organisé par SGM Aventure et Touil Travel.",
    location: "Désert du Sahara, Tunisie",
    price: 250,
    duration: "8 jours",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800",
    type: ["adventure", "cultural", "sport"],
    rating: 4.9,
    groupSize: {
      min: 1,
      max: 30
    }
  },
  {
    id: "2",
    title: "Traversée Djerba-Tozeur: Un Voyage Authentique",
    description: "Une aventure de 4 jours commençant à Djerba avec la fabrication traditionnelle de savon, explorant Ksar Hedada et les villages berbères. L'itinéraire traverse Douz, Chott El Jerid, et se termine dans les villages de montagne autour de Tozeur.",
    location: "Djerba-Tozeur, Tunisie",
    price: 180,
    duration: "4 jours",
    image: "https://images.unsplash.com/photo-1504514917469-dd27c74b4baa",
    type: ["cultural", "adventure"],
    rating: 4.8,
    groupSize: {
      min: 2,
      max: 15
    }
  },
  {
    id: "3",
    title: "Excursions Familiales dans le Sahara Tunisien",
    description: "Découverte magique du Sahara tunisien en famille, de Djerba aux dunes dorées. Des activités variées pour petits et grands : escalade de dunes, balades à dos de chameau et excursions en 4x4.",
    location: "Sahara Tunisien",
    price: 150,
    duration: "3-7 jours",
    image: "https://images.unsplash.com/photo-1682686581312-506a8b53190e",
    type: ["family", "adventure", "cultural"],
    rating: 4.7,
    groupSize: {
      min: 3,
      max: 8
    }
  },
  {
    id: "4",
    title: "Voyage Incentive",
    description: "Une expérience unique de team-building dans le cadre majestueux du désert tunisien. Des activités personnalisées, de la balade à dos de dromadaire aux soirées sous les étoiles, pour renforcer la cohésion d'équipe.",
    location: "Tunisie du Sud",
    price: 200,
    duration: "2-5 jours",
    image: "https://images.unsplash.com/photo-1570432024862-70be773766fd",
    type: ["teambuilding", "adventure"],
    rating: 4.9,
    groupSize: {
      min: 8,
      max: 50
    }
  },
  {
    id: "5",
    title: "Excursion Sur Mesure",
    description: "Créons ensemble votre expérience parfaite dans le désert tunisien. Un voyage entièrement personnalisé selon vos envies, votre rythme et vos centres d'intérêt.",
    location: "Tunisie",
    price: 300,
    duration: "Sur mesure",
    image: "https://images.unsplash.com/photo-1507272931001-fc06c17e4f43",
    type: ["custom", "luxury"],
    rating: 5.0,
    groupSize: {
      min: 1,
      max: 20
    }
  },
  {
    id: "6",
    title: "Sortie Entre Amis",
    description: "Une aventure mémorable entre amis dans le désert tunisien. Randonnées, découvertes culturelles et soirées sous les étoiles pour renforcer vos liens d'amitié.",
    location: "Désert Tunisien",
    price: 120,
    duration: "2-4 jours",
    image: "https://images.unsplash.com/photo-1547465375-c082c8f8d97e",
    type: ["friends", "adventure", "cultural"],
    rating: 4.8,
    groupSize: {
      min: 4,
      max: 12
    }
  },
  {
    id: "7",
    title: "Excursion en Couple",
    description: "Un séjour romantique dans le cadre enchanteur du Sahara. Des moments privilégiés à deux, entre couchers de soleil sur les dunes et nuits étoilées.",
    location: "Sahara Tunisien",
    price: 280,
    duration: "2-3 jours",
    image: "https://images.unsplash.com/photo-1548701762-bba4c032c3ac",
    type: ["romantic", "luxury", "adventure"],
    rating: 4.9,
    groupSize: {
      min: 2,
      max: 2
    }
  }
];

export const filterActivitiesByType = (types: string[]): Activity[] => {
  if (types.length === 0) return activities;
  return activities.filter(activity => 
    activity.type.some(type => types.includes(type))
  );
};

export const filterActivitiesByPrice = (maxPrice: number): Activity[] => {
  return activities.filter(activity => activity.price <= maxPrice);
};

export const filterActivitiesByGroupSize = (size: number): Activity[] => {
  return activities.filter(
    activity => size >= activity.groupSize.min && size <= activity.groupSize.max
  );
};

export const filterActivities = (
  types: string[] = [],
  maxPrice: number = Infinity,
  groupSize: number = 1
): Activity[] => {
  return activities.filter(activity => 
    (types.length === 0 || activity.type.some(type => types.includes(type))) &&
    activity.price <= maxPrice &&
    groupSize >= activity.groupSize.min && 
    groupSize <= activity.groupSize.max
  );
};
