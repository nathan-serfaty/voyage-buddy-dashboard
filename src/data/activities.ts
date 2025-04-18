
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

// Mock data for activities based on SGM TTT excursions
export const activities: Activity[] = [
  {
    id: "1",
    title: "Excursion à Chefchaouen",
    description: "Découvrez la ville bleue de Chefchaouen lors d'une journée complète d'exploration. Cette ville unique située dans les montagnes du Rif est connue pour ses bâtiments bleus et sa médina pittoresque.",
    location: "Chefchaouen, Maroc",
    price: 65,
    duration: "1 journée",
    image: "https://images.unsplash.com/photo-1577147442750-17a562ca3e61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    type: ["cultural", "nature"],
    rating: 4.8,
    groupSize: {
      min: 2,
      max: 15
    }
  },
  {
    id: "2",
    title: "Excursion aux cascades d'Akchour",
    description: "Randonnée aux cascades d'Akchour dans le Parc National de Talassemtane. Profitez de paysages montagneux spectaculaires et de baignades dans des eaux cristallines.",
    location: "Akchour, Maroc",
    price: 75,
    duration: "1 journée",
    image: "https://images.unsplash.com/photo-1584824388450-82be0a68b221?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    type: ["adventure", "nature"],
    rating: 4.7,
    groupSize: {
      min: 4,
      max: 12
    }
  },
  {
    id: "3",
    title: "Tour culinaire de Tanger",
    description: "Explorez les saveurs de Tanger avec ce tour gastronomique qui vous emmène dans les meilleurs restaurants et stands de street food de la ville.",
    location: "Tanger, Maroc",
    price: 55,
    duration: "4 heures",
    image: "https://images.unsplash.com/photo-1629287187817-21a57d6cb349?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    type: ["gastronomy", "cultural"],
    rating: 4.9,
    groupSize: {
      min: 2,
      max: 8
    }
  },
  {
    id: "4",
    title: "Excursion à Asilah",
    description: "Visitez la charmante ville côtière d'Asilah connue pour ses murs blancs, son art de rue et ses plages magnifiques.",
    location: "Asilah, Maroc",
    price: 60,
    duration: "1 journée",
    image: "https://images.unsplash.com/photo-1578203618459-5c79abe65de0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    type: ["cultural", "relaxation"],
    rating: 4.6,
    groupSize: {
      min: 4,
      max: 15
    }
  },
  {
    id: "5",
    title: "Safari en 4x4 dans le désert",
    description: "Aventurez-vous dans un safari en 4x4 à travers les dunes et les paysages désertiques du Maroc. Inclut un dîner sous les étoiles.",
    location: "Agafay, Maroc",
    price: 120,
    duration: "8 heures",
    image: "https://images.unsplash.com/photo-1476152505436-261170a82381?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    type: ["adventure", "nature"],
    rating: 4.9,
    groupSize: {
      min: 2,
      max: 6
    }
  },
  {
    id: "6",
    title: "Croisière sur le détroit de Gibraltar",
    description: "Naviguez sur le détroit de Gibraltar et observez des dauphins et autres animaux marins dans leur habitat naturel.",
    location: "Tanger, Maroc",
    price: 90,
    duration: "3 heures",
    image: "https://images.unsplash.com/photo-1579634701234-9ababea9b25d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    type: ["relaxation", "nature"],
    rating: 4.7,
    groupSize: {
      min: 5,
      max: 20
    }
  },
  {
    id: "7",
    title: "Visite des grottes d'Hercule",
    description: "Explorez les légendaires grottes d'Hercule, un lieu riche en mythologie et d'une beauté naturelle exceptionnelle.",
    location: "Cap Spartel, Maroc",
    price: 40,
    duration: "2 heures",
    image: "https://images.unsplash.com/photo-1534258808519-089942475a3f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    type: ["cultural", "nature"],
    rating: 4.5,
    groupSize: {
      min: 2,
      max: 15
    }
  },
  {
    id: "8",
    title: "Atelier de cuisine marocaine",
    description: "Apprenez à préparer des plats traditionnels marocains comme le tajine et le couscous lors d'un cours avec un chef local.",
    location: "Tanger, Maroc",
    price: 70,
    duration: "4 heures",
    image: "https://images.unsplash.com/photo-1551183207-b7d0101490cb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
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
