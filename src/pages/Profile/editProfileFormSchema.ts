import { z } from "zod";
import { nameSchema, phoneSchema } from "@/utils/zodSchemas";

/* Edit profile form schema */
export const editProfileFormSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  phone: phoneSchema,
});

export type EditProfileFormData = z.infer<typeof editProfileFormSchema>;
