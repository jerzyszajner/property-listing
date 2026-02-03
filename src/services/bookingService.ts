import type { Booking, CreateBooking } from "@/types/booking";
import type { Property } from "@/types/property";
import { database } from "@/config/firebaseConfig";
import { calculateNights } from "@/utils/helpers";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

// Helper function for mapping Firestore document to Booking
const mapDocumentToBooking = (document: {
  id: string;
  data: () => Record<string, unknown> | undefined;
}): Booking => {
  const data = document.data();

  return {
    id: document.id,
    userId: (data?.userId as string) ?? "",
    propertyId: (data?.propertyId as string) ?? "",
    propertyTitle: (data?.propertyTitle as string) ?? "",
    propertyImage: (data?.propertyImage as string) ?? "",
    checkIn: (data?.checkIn as Timestamp) ?? Timestamp.now(),
    checkOut: (data?.checkOut as Timestamp) ?? Timestamp.now(),
    guests: Number(data?.guests ?? 0),
    nights: Number(data?.nights ?? 0),
    pricePerNight: Number(data?.pricePerNight ?? 0),
    totalPrice: Number(data?.totalPrice ?? 0),
    createdAt: (data?.createdAt as Timestamp) ?? Timestamp.now(),
  };
};

// Service function for creating a booking in Firestore
export const createBooking = async (
  uid: string,
  bookingData: CreateBooking,
  property: Property,
): Promise<string> => {
  const nights = calculateNights(bookingData.checkIn, bookingData.checkOut);
  const pricePerNight = property.price;
  const totalPrice = nights * pricePerNight;

  const bookingRef = await addDoc(collection(database, "bookings"), {
    userId: uid,
    propertyId: bookingData.propertyId,
    propertyTitle: property.title,
    propertyImage: property.image,
    checkIn: Timestamp.fromDate(bookingData.checkIn),
    checkOut: Timestamp.fromDate(bookingData.checkOut),
    guests: bookingData.guests,
    nights,
    pricePerNight,
    totalPrice,
    createdAt: serverTimestamp(),
  });

  return bookingRef.id;
};

// Service function for fetching user bookings from Firestore
export const fetchUserBookings = async (uid: string): Promise<Booking[]> => {
  const bookingsQuery = query(
    collection(database, "bookings"),
    where("userId", "==", uid),
  );

  const querySnapshot = await getDocs(bookingsQuery);
  const bookings = querySnapshot.docs.map(mapDocumentToBooking);

  // Sort by checkIn date descending (newest first) - client-side sorting
  return bookings.sort((a, b) => {
    const dateA = a.checkIn.toMillis();
    const dateB = b.checkIn.toMillis();
    return dateB - dateA;
  });
};

// Service function for cancelling a booking
export const cancelBooking = async (bookingId: string): Promise<void> => {
  const bookingRef = doc(database, "bookings", bookingId);
  await deleteDoc(bookingRef);
};

// Service function for fetching booked date ranges for a property
export const fetchPropertyBookedDates = async (
  propertyId: string,
): Promise<{ from: Date; to: Date }[]> => {
  const bookingsQuery = query(
    collection(database, "bookings"),
    where("propertyId", "==", propertyId),
  );

  const querySnapshot = await getDocs(bookingsQuery);
  const bookings = querySnapshot.docs.map(mapDocumentToBooking);

  return bookings.map((booking) => ({
    from: booking.checkIn.toDate(),
    to: booking.checkOut.toDate(),
  }));
};

// Service function for checking property availability
export const checkPropertyAvailability = async (
  propertyId: string,
  checkIn: Date,
  checkOut: Date,
): Promise<boolean> => {
  const bookingsQuery = query(
    collection(database, "bookings"),
    where("propertyId", "==", propertyId),
  );

  const querySnapshot = await getDocs(bookingsQuery);
  const bookings = querySnapshot.docs.map(mapDocumentToBooking);

  // Check for date overlaps
  for (const booking of bookings) {
    const bookingCheckIn = booking.checkIn.toDate();
    const bookingCheckOut = booking.checkOut.toDate();

    // Check if there's an overlap
    if (
      (checkIn >= bookingCheckIn && checkIn < bookingCheckOut) ||
      (checkOut > bookingCheckIn && checkOut <= bookingCheckOut) ||
      (checkIn <= bookingCheckIn && checkOut >= bookingCheckOut)
    ) {
      return false;
    }
  }

  return true;
};
