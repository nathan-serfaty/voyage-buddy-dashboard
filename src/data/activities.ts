import { Activity } from "@/types/activity";

// Use 'export type' for re-exporting types when using isolatedModules
export type { Activity };

export const activities: Activity[] = [
  {
    id: "1",
    title: "Visite de la médina de Djerba",
    description: "Découvrez la richesse culturelle et architecturale de la médina de Djerba, avec ses souks animés et son artisanat traditionnel. Une plongée authentique dans l'histoire et la culture tunisienne.",
    location: "Djerba, Tunisie",
    price: 45,
    duration: "4 heures",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
    type: ["cultural", "relaxation"],
    rating: 4.7,
    groupSize: {
      min: 2,
      max: 12
    }
  },
  {
    id: "2",
    title: "Excursion en quad dans le désert",
    description: "Vivez une aventure palpitante à travers les dunes dorées du Sahara en quad, avec des vues spectaculaires sur le désert tunisien.",
    location: "Douz, Tunisie",
    price: 85,
    duration: "3 heures",
    image: "https://images.unsplash.com/photo-1626450800461-7cf5beda7316?auto=format&fit=crop&w=800&q=80",
    type: ["adventure", "nature"],
    rating: 4.9,
    groupSize: {
      min: 1,
      max: 8
    }
  },
  {
    id: "3",
    title: "Visite des oasis de montagne de Tozeur",
    description: "Explorez les magnifiques oasis de montagne et les palmiers luxuriants de Tozeur, avec ses sources d'eau naturelles et ses paysages à couper le souffle.",
    location: "Tozeur, Tunisie",
    price: 55,
    duration: "6 heures",
    image: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&w=800&q=80",
    type: ["nature", "cultural"],
    rating: 4.6,
    groupSize: {
      min: 2,
      max: 15
    }
  },
  {
    id: "4",
    title: "Grand Erg 2024: Aventure au cœur du Sahara",
    description: "Préparez-vous pour une aventure extraordinaire avec le Grand Erg 2024, une expérience unique combinant sport et découverte dans les déserts enchanteurs du Sud tunisien. Course à pied, visites culturelles et nuit sous les étoiles.",
    location: "Désert du Sahara, Tunisie",
    price: 250,
    duration: "3 jours",
    image: "https://images.unsplash.com/photo-1514917073844-5421669334c7?auto=format&fit=crop&w=800&q=80",
    type: ["adventure", "cultural", "sport"],
    rating: 4.9,
    groupSize: {
      min: 1,
      max: 30
    }
  },
  {
    id: "5",
    title: "De Djerba à Tozeur: Un Voyage Authentique",
    description: "Un circuit de 4 jours à travers les merveilles du Sud tunisien, de Djerba à Tozeur. Découvrez la fabrication traditionnelle du savon, explorez des villages de montagne et partagez des moments uniques avec les familles berbères.",
    location: "Djerba - Tozeur, Tunisie",
    price: 350,
    duration: "4 jours",
    image: "https://images.unsplash.com/photo-1539651044670-315229da9d2f?auto=format&fit=crop&w=800&q=80",
    type: ["cultural", "gastronomy", "nature"],
    rating: 4.8,
    groupSize: {
      min: 2,
      max: 12
    }
  },
  {
    id: "6",
    title: "Golf dans le Désert Tunisien",
    description: "Une expérience unique de golf dans le cadre majestueux du désert tunisien. Parcours conçus dans le respect de l'environnement, offrant une parfaite harmonie entre sport et nature.",
    location: "Tozeur, Tunisie",
    price: 120,
    duration: "4 heures",
    image: "https://images.unsplash.com/photo-1591491653056-4315625645ce?auto=format&fit=crop&w=800&q=80",
    type: ["sport", "relaxation", "nature"],
    rating: 4.6,
    groupSize: {
      min: 1,
      max: 4
    }
  },
  {
    id: "7",
    title: "Incentive Travel: Team Building dans le Désert",
    description: "Une expérience de team building unique dans le cadre majestueux du désert tunisien. Activités personnalisées, de la balade à dos de chameau aux soirées sous les étoiles et aux aventures en 4x4.",
    location: "Désert Tunisien",
    price: 180,
    duration: "1-3 jours",
    image: "https://images.unsplash.com/photo-1682686580003-82b6c0e9d82d?auto=format&fit=crop&w=800&q=80",
    type: ["adventure", "cultural", "teambuilding"],
    rating: 4.9,
    groupSize: {
      min: 8,
      max: 25
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
