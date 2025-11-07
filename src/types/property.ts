export type Property = {
  id: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  superhost: boolean;
  location: string;
  capacity: {
    people: number;
    bedroom: number;
  };
  image: string;
};
