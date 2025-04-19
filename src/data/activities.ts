
import { Activity } from "@/types/activity";

// Use 'export type' for re-exporting types when using isolatedModules
export type { Activity };

export const activities: Activity[] = [
  {
    id: "1",
    title: "Buggy excursion dans le désert",
    description: "Explorez les merveilles du désert tunisien lors d'une excursion palpitante en buggy. Cette aventure vous plongera au cœur des paysages spectaculaires de cette nature sauvage d'une manière unique et excitante.",
    location: "Douz, Tunisie",
    price: 85,
    duration: "4 heures",
    image: "https://images.unsplash.com/photo-1618523388630-4d4339336234?auto=format&fit=crop&w=800&q=80",
    type: ["adventure", "nature"],
    rating: 4.8,
    groupSize: {
      min: 1,
      max: 8
    }
  },
  {
    id: "2",
    title: "Excursion en Quad dans le Sahara",
    description: "Découvrez la beauté du désert tunisien lors d'une excursion exaltante en quad ! Nos guides expérimentés vous emmèneront au cœur de ce paysage majestueux, avec du temps pour explorer et admirer les décors spectaculaires.",
    location: "Douz, Tunisie",
    price: 95,
    duration: "3 heures",
    image: "https://images.unsplash.com/photo-1624809572365-7574d0c51339?auto=format&fit=crop&w=800&q=80",
    type: ["adventure", "nature"],
    rating: 4.9,
    groupSize: {
      min: 1,
      max: 6
    }
  },
  {
    id: "3",
    title: "Aventure à dos de chameau",
    description: "Une expérience inoubliable vous attend dans le désert tunisien : une aventure à dos de chameau. Immergez-vous dans cette expérience authentique qui vous permettra de découvrir les paysages à couper le souffle et la riche culture de cette région sauvage d'une manière unique et traditionnelle.",
    location: "Douz, Tunisie",
    price: 65,
    duration: "2 heures",
    image: "https://images.unsplash.com/photo-1578310879709-6c6bb7b36d11?auto=format&fit=crop&w=800&q=80",
    type: ["cultural", "nature", "relaxation"],
    rating: 4.7,
    groupSize: {
      min: 1,
      max: 10
    }
  },
  {
    id: "4",
    title: "Grand Erg 2024: Aventure au cœur du Sahara",
    description: "Préparez-vous pour une aventure extraordinaire avec le Grand Erg 2024, une expérience unique combinant sport et découverte dans les déserts enchanteurs du Sud tunisien. Course à pied, visites culturelles et nuit sous les étoiles.",
    location: "Désert du Sahara, Tunisie",
    price: 250,
    duration: "3 jours",
    image: "https://images.unsplash.com/photo-1633096981568-5092c386658e?auto=format&fit=crop&w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1570214476695-19bd467e6f7a?auto=format&fit=crop&w=800&q=80",
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
