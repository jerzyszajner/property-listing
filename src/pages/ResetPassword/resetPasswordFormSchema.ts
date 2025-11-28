import { z } from "zod";
import { emailSchema } from "@/utils/zodSchemas";

/* Reset Password form schema */
export const resetPasswordFormSchema = z.object({
  email: emailSchema,
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordFormSchema>;
