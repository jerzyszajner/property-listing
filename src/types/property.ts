export type Property = {
  id: string;
  title: string;
  amenities: string[];
  description: string;
  price: number;
  rating: number;
  superhost: boolean;
  location: string;
  capacity: {
    people: number;
    bedroom: number;
  };
  host: {
    name: string;
    image: string;
  };
  image: string;
};
