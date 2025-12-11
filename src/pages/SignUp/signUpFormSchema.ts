import { z } from "zod";
import { emailSchema, passwordSchema } from "@/utils/zodSchemas";

/* Sign up form schema */
export const signUpFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type SignUpFormData = z.infer<typeof signUpFormSchema>;
