
export interface City {
  id: string;
  name: string;
  description: string;
  coordinates: [number, number]; // Updated to proper tuple type [latitude, longitude]
}

export const cities: City[] = [
  {
    id: "djerba",
    name: "Djerba",
    description: "Île paradisiaque avec ses plages et sa culture",
    coordinates: [33.8075, 10.8451]
  },
  {
    id: "tozeur",
    name: "Tozeur",
    description: "Porte du désert avec ses oasis et dunes",
    coordinates: [33.9197, 8.1336]
  },
  {
    id: "douz",
    name: "Douz",
    description: "La porte du Sahara",
    coordinates: [33.4662, 9.0203]
  },
  {
    id: "tataouine",
    name: "Tataouine",
    description: "Célèbre pour ses ksour berbères",
    coordinates: [32.9297, 10.4518]
  }
];
