import { z } from "zod";
import {
  nameSchema,
  emailSchema,
  phoneSchema,
  messageSchema,
  subjectSchema,
} from "@/utils/zodSchemas";

/* Contact form schema */
export const contactFormSchema = z.object({
  fname: nameSchema,
  lname: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  subject: subjectSchema,
  message: messageSchema,
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
