import type { Timestamp } from "firebase/firestore";

// Booking types for Firestore database
export type Booking = {
  id: string;
  userId: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  checkIn: Timestamp;
  checkOut: Timestamp;
  guests: number;
  nights: number;
  pricePerNight: number;
  totalPrice: number;
  createdAt: Timestamp;
};

export type CreateBooking = {
  propertyId: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
};
