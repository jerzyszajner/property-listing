import { z } from "zod";

/* AddListing form schema */
const addListingFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(70, "Max 70 characters"),
  street: z.string().min(1, "Street is required").max(30, "Max 30 characters"),
  zipCode: z
    .string()
    .trim()
    .min(1, "Zip Code is required")
    .min(4, "Min 4 characters")
    .max(4, "Max 4 characters"),
  city: z
    .string()
    .trim()
    .min(1, "City is required")
    .max(20, "Max 20 characters"),
  country: z.string().trim().min(1, "Country is required"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(400, "Max 400 characters"),
  bedroom: z.number().min(0, "Min 0").max(20, "Max 20"),
  guest: z.number().min(0, "Min 0").max(20, "Max 20"),
  price: z.number().min(0, "Min 0"),
  amenities: z.array(z.string()),
  image: z.string().min(1, "Property image is required"),
});

export type AddListingFormData = z.infer<typeof addListingFormSchema>;
export { addListingFormSchema };
