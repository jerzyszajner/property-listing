// Property type for Firestore database
export type Property = {
  id: string;
  hostId: string;
  title: string;
  amenities: string[];
  description: string;
  price: number;
  rating: number;
  superhost: boolean;
  address: {
    street: string;
    zipCode: string;
    city: string;
    country: string;
  };
  coordinates?: {
    lat: number;
    lng: number;
  };
  capacity: {
    guest: number;
    bedroom: number;
  };
  host: {
    name: string;
    image: string;
  };
  image: string;
  images?: string[];
};

export type CreatePropertyData = Omit<Property, "id">;
