
// Types for activities
export interface Activity {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  duration: string;
  image: string;
  type: string[];
  rating: number;
  groupSize: {
    min: number;
    max: number;
  };
}

// Mock data for activities based on Tunisia excursions
export const activities: Activity[] = [
  {
    id: "1",
    title: "Visite de la médina de Djerba",
    description: "Découvrez la richesse culturelle et architecturale de la médina de Djerba, avec ses souks animés et son artisanat local.",
    location: "Djerba, Tunisie",
    price: 45,
    duration: "4 heures",
    image: "https://images.unsplash.com/photo-1539768942893-daf53e448371?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1626635291098-8428847a5c90?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
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
    description: "Explorez les magnifiques oasis de montagne et les palmiers luxuriants de Tozeur, avec ses sources d'eau fraîche et sa végétation exotique.",
    location: "Tozeur, Tunisie",
    price: 55,
    duration: "6 heures",
    image: "https://images.unsplash.com/photo-1563455915098-ea411b44da3b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    type: ["nature", "cultural"],
    rating: 4.6,
    groupSize: {
      min: 2,
      max: 15
    }
  },
  {
    id: "4",
    title: "Trek dans les montagnes de Tataouine",
    description: "Partez à la découverte des paysages spectaculaires de Tataouine lors d'une randonnée guidée à travers ses formations rocheuses uniques.",
    location: "Tataouine, Tunisie",
    price: 60,
    duration: "1 journée",
    image: "https://images.unsplash.com/photo-1548846648-63a88e8ad61d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    type: ["adventure", "nature"],
    rating: 4.8,
    groupSize: {
      min: 4,
      max: 10
    }
  },
  {
    id: "5",
    title: "Visite des ksour berbères",
    description: "Explorez les fascinants ksour berbères de Tataouine, ces greniers fortifiés qui témoignent de l'ingéniosité architecturale des Berbères.",
    location: "Tataouine, Tunisie",
    price: 50,
    duration: "5 heures",
    image: "https://images.unsplash.com/photo-1528123887526-0200e5820364?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    type: ["cultural", "relaxation"],
    rating: 4.5,
    groupSize: {
      min: 2,
      max: 15
    }
  },
  {
    id: "6",
    title: "Balade en bateau sur la côte de Djerba",
    description: "Profitez d'une excursion en bateau le long des côtes de Djerba, avec possibilité de baignade dans les eaux cristallines et visite de plages isolées.",
    location: "Djerba, Tunisie",
    price: 70,
    duration: "4 heures",
    image: "https://images.unsplash.com/photo-1564019472231-4586c552dc27?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    type: ["relaxation", "nature"],
    rating: 4.7,
    groupSize: {
      min: 5,
      max: 20
    }
  },
  {
    id: "7",
    title: "Visite du marché traditionnel de Douz",
    description: "Immergez-vous dans l'atmosphère authentique du marché traditionnel de Douz, connu comme la porte du désert, avec ses produits locaux et son ambiance animée.",
    location: "Douz, Tunisie",
    price: 40,
    duration: "3 heures",
    image: "https://images.unsplash.com/photo-1555672499-c430e1a68154?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    type: ["cultural", "gastronomy"],
    rating: 4.4,
    groupSize: {
      min: 2,
      max: 12
    }
  },
  {
    id: "8",
    title: "Atelier de cuisine tunisienne",
    description: "Apprenez à préparer des plats traditionnels tunisiens comme le couscous et le brik lors d'un cours avec un chef local à Tozeur.",
    location: "Tozeur, Tunisie",
    price: 65,
    duration: "4 heures",
    image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    type: ["gastronomy", "cultural"],
    rating: 4.8,
    groupSize: {
      min: 2,
      max: 10
    }
  }
];

// Function to filter activities by type
export const filterActivitiesByType = (types: string[]): Activity[] => {
  if (types.length === 0) return activities;
  return activities.filter(activity => 
    activity.type.some(type => types.includes(type))
  );
};

// Function to filter activities by price range
export const filterActivitiesByPrice = (maxPrice: number): Activity[] => {
  return activities.filter(activity => activity.price <= maxPrice);
};

// Function to filter activities by group size
export const filterActivitiesByGroupSize = (size: number): Activity[] => {
  return activities.filter(
    activity => size >= activity.groupSize.min && size <= activity.groupSize.max
  );
};

// Combine all filters
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
