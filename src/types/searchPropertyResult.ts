// Search property result type returned by AI search callable
export type SearchPropertyResult = {
  id: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  superhost: boolean;
  image: string;
  capacity: {
    guest: number;
    bedroom: number;
  };
};
