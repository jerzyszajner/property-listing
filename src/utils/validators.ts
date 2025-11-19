import { EMAIL_REGEX, PHONE_REGEX } from "./regex";

// Validator function type: returns true if valid, or error message string if invalid
export type Validator = (value: string) => true | string;

// Check if field is required
export const isRequired: Validator = (value: string) => {
  if (!value.trim()) {
    return "This field is required";
  }
  return true;
};

// Check if value is a valid email
export const isEmail: Validator = (value: string) => {
  if (!EMAIL_REGEX.test(value)) {
    return "Please enter a valid email address";
  }
  return true;
};

// Check if value is a valid phone number
export const isPhone: Validator = (value: string) => {
  if (!PHONE_REGEX.test(value)) {
    return "Phone number contains invalid characters";
  }
  const digitsOnly = value.replace(/\D/g, "");
  if (digitsOnly.length < 8 || digitsOnly.length > 15) {
    return "Please enter a valid phone number (8-15 digits)";
  }
  return true;
};

// Check if value meets minimum length requirement
export const minLength = (min: number): Validator => {
  return (value: string) => {
    if (value.trim().length < min) {
      return `Must be at least ${min} characters long`;
    }
    return true;
  };
};

// Check if value meets maximum length requirement
export const maxLength = (max: number): Validator => {
  return (value: string) => {
    if (value.trim().length > max) {
      return `Must be at most ${max} characters long`;
    }
    return true;
  };
};
