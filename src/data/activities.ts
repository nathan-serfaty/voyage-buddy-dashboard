
import { Activity } from "@/types/activity";

// Use 'export type' for re-exporting types when using isolatedModules
export type { Activity };

export const activities: Activity[] = [
  {
    id: "1",
    title: "Visite de la médina de Tunis",
    description: "Découvrez la richesse culturelle et architecturale de la médina de Tunis, patrimoine mondial de l'UNESCO, avec ses souks animés et son artisanat traditionnel. Une plongée authentique dans l'histoire et la culture tunisienne.",
    location: "Tunis, Tunisie",
    price: 45,
    duration: "4 heures",
    image: "https://images.unsplash.com/photo-1601651337395-4c4aa919654c?auto=format&fit=crop&w=800&q=80",
    type: ["cultural", "relaxation"],
    rating: 4.7,
    groupSize: {
      min: 2,
      max: 12
    }
  },
  {
    id: "2",
    title: "Excursion en quad dans le désert tunisien",
    description: "Vivez une aventure palpitante à travers les dunes dorées du Sahara tunisien en quad, avec des vues spectaculaires sur les oasis et les paysages désertiques.",
    location: "Douz, Tunisie",
    price: 85,
    duration: "3 heures",
    image: "https://images.unsplash.com/photo-1564414458549-4085db80ab68?auto=format&fit=crop&w=800&q=80",
    type: ["adventure", "nature"],
    rating: 4.9,
    groupSize: {
      min: 1,
      max: 8
    }
  },
  {
    id: "3",
    title: "Visite des oasis de Chebika et Tamerza",
    description: "Explorez les magnifiques oasis de montagne de Chebika et Tamerza, avec leurs palmeraies luxuriantes, sources d'eau naturelles et paysages montagneux à couper le souffle.",
    location: "Tozeur, Tunisie",
    price: 55,
    duration: "6 heures",
    image: "https://images.unsplash.com/photo-1600175074394-f2d4b8e5b5b4?auto=format&fit=crop&w=800&q=80",
    type: ["nature", "cultural"],
    rating: 4.6,
    groupSize: {
      min: 2,
      max: 15
    }
  },
  {
    id: "4",
    title: "Rallye du Sud Tunisien 2024",
    description: "Participez au célèbre Rallye du Sud Tunisien, une expérience unique combinant sport et découverte dans les déserts enchanteurs du Sud. Course à pied, visites culturelles et nuit sous les étoiles dans un campement traditionnel.",
    location: "Désert du Sahara, Tunisie",
    price: 250,
    duration: "3 jours",
    image: "https://images.unsplash.com/photo-1495344517868-8ebaf0a2044a?auto=format&fit=crop&w=800&q=80",
    type: ["adventure", "cultural", "sport"],
    rating: 4.9,
    groupSize: {
      min: 1,
      max: 30
    }
  },
  {
    id: "5",
    title: "De Sidi Bou Saïd à Carthage: Circuit Culturel",
    description: "Un circuit d'une journée à travers les merveilles de Sidi Bou Saïd et Carthage. Découvrez l'architecture bleue et blanche emblématique, explorez les ruines romaines et profitez de la vue imprenable sur la Méditerranée.",
    location: "Tunis, Tunisie",
    price: 70,
    duration: "1 jour",
    image: "https://images.unsplash.com/photo-1540552999122-a0ac7a9a0008?auto=format&fit=crop&w=800&q=80",
    type: ["cultural", "gastronomy", "nature"],
    rating: 4.8,
    groupSize: {
      min: 2,
      max: 12
    }
  },
  {
    id: "6",
    title: "Golf dans l'oasis de Tozeur",
    description: "Une expérience unique de golf dans le cadre majestueux de l'oasis de Tozeur. Parcours conçus dans le respect de l'environnement, offrant une parfaite harmonie entre sport et nature au cœur du désert tunisien.",
    location: "Tozeur, Tunisie",
    price: 120,
    duration: "4 heures",
    image: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=800&q=80",
    type: ["sport", "relaxation", "nature"],
    rating: 4.6,
    groupSize: {
      min: 1,
      max: 4
    }
  },
  {
    id: "7",
    title: "Team Building dans le désert de Douz",
    description: "Une expérience de team building unique dans le cadre majestueux du désert tunisien à Douz. Activités personnalisées, de la balade à dos de dromadaire aux soirées sous les étoiles dans un campement berbère.",
    location: "Douz, Tunisie",
    price: 180,
    duration: "2 jours",
    image: "https://images.unsplash.com/photo-1509059852496-f3822ae057bf?auto=format&fit=crop&w=800&q=80",
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
