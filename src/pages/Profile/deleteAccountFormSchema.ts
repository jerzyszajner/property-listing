import { z } from "zod";
import { passwordSchema } from "@/utils/zodSchemas";

/* Delete account form schema - password optional for Google users */
const deleteAccountFormSchemaForGoogle = z.object({
  password: z.string().optional(),
});

/* Delete account form schema - password required for email/password users */
const deleteAccountFormSchemaForEmail = z.object({
  password: passwordSchema,
});

/* Get delete account form schema based on user type */
export const getDeleteAccountFormSchema = (isGoogleUser: boolean) => {
  return isGoogleUser
    ? deleteAccountFormSchemaForGoogle
    : deleteAccountFormSchemaForEmail;
};

export type DeleteAccountFormData = z.infer<
  typeof deleteAccountFormSchemaForGoogle
>;
