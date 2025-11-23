import { z } from "zod";
import { PHONE_REGEX } from "./regex";

/* Zod schemas for form validation */

// Helper function to validate phone number digit count
const isValidPhoneDigits = (value: string): boolean => {
  const digitsOnly = value.replace(/\D/g, "");
  return digitsOnly.length >= 8 && digitsOnly.length <= 15;
};

// Name schema - first name, last name, etc.
export const nameSchema = z
  .string()
  .trim()
  .min(2, "Must be at least 2 characters long");

// Email schema
export const emailSchema = z
  .email({ error: "Please enter a valid email address" })
  .trim()
  .min(1, "This field is required");

// Phone schema
export const phoneSchema = z
  .string()
  .trim()
  .min(1, "This field is required")
  .regex(PHONE_REGEX, {
    error: "Phone number contains invalid characters",
  })
  .refine(isValidPhoneDigits, {
    error: "Please enter a valid phone number (8-15 digits)",
  });

// Message schema
export const messageSchema = z
  .string()
  .trim()
  .min(10, "Must be at least 10 characters long")
  .max(400, "Must be at most 400 characters");

// Optional text field with max length
export const optionalMaxLength = (max: number) =>
  z.union([
    z
      .string()
      .trim()
      .max(max, { error: `Must be at most ${max} characters` }),
    z.literal(""),
  ]);
