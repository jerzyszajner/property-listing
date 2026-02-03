import { z } from "zod";
import { getStartOfDay, calculateNights } from "@/utils/helpers";

export const bookingFormSchema = z
  .object({
    checkIn: z.date(),
    checkOut: z.date(),
    guests: z.string().min(1, "Please select number of guests"),
  })
  .refine((data) => data.checkOut > data.checkIn, {
    message: "Check-out date must be after check-in date",
    path: ["checkOut"],
  })
  .refine((data) => getStartOfDay(data.checkIn) >= getStartOfDay(new Date()), {
    message: "Check-in date cannot be in the past",
    path: ["checkIn"],
  })
  .refine(
    (data) => {
      const nights = calculateNights(data.checkIn, data.checkOut);
      return nights >= 1;
    },
    {
      message: "Minimum stay is 1 night",
      path: ["checkOut"],
    },
  );

export type BookingFormData = z.infer<typeof bookingFormSchema>;
