import { z } from "zod";
import {
  nameSchema,
  emailSchema,
  phoneSchema,
  passwordSchema,
  confirmPasswordSchema,
} from "@/utils/zodSchemas";

/* Sign up form schema */
export const signUpFormSchema = z
  .object({
    firstName: nameSchema,
    lastName: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpFormData = z.infer<typeof signUpFormSchema>;
