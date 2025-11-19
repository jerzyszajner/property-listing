import {
  isRequired,
  isEmail,
  isPhone,
  minLength,
  maxLength,
  type Validator,
} from "@/utils/validators";

// Validation rules for contact form
export const contactValidation: Partial<Record<string, Validator[]>> = {
  fname: [isRequired, minLength(2)],
  lname: [isRequired, minLength(2)],
  email: [isRequired, isEmail],
  phone: [isRequired, isPhone],
  subject: [maxLength(50)],
  message: [isRequired, minLength(10), maxLength(400)],
};
