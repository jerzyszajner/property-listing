import { z } from "zod";
import { emailSchema, passwordSchema } from "@/utils/zodSchemas";

/* Sign in form schema */
export const signInFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type SignInFormData = z.infer<typeof signInFormSchema>;
