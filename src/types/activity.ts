
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
