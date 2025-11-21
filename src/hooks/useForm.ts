import { useState } from "react";
import type { Validator } from "@/utils/validators";

type FormData = Record<string, string>;
type FormErrors = Record<string, string | undefined>;

export interface UseFormReturn {
  formData: FormData;
  errors: FormErrors;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSubmit: (e: React.FormEvent) => void;
  resetForm: () => void;
}

export interface UseFormOptions {
  initialValues: FormData;
  validation?: Partial<Record<string, Validator[]>>;
  onSubmit: (data: FormData) => void | Promise<void>;
}

/* Custom hook for form validation and submission */
export const useForm = ({
  initialValues,
  validation,
  onSubmit,
}: UseFormOptions): UseFormReturn => {
  const [formData, setFormData] = useState<FormData>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateField = (
    fieldName: string,
    value: string
  ): string | undefined => {
    const validators = validation?.[fieldName];
    if (!validators) return undefined;

    for (const validator of validators) {
      const result = validator(value);
      if (result !== true) {
        return result;
      }
    }
    return undefined;
  };

  const validateAll = (): boolean => {
    const newErrors: FormErrors = {};

    Object.entries(formData).forEach(([fieldName, value]) => {
      const error = validateField(fieldName, value);
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData(initialValues);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAll()) {
      return;
    }

    setErrors({});
    await onSubmit(formData);
  };

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
    resetForm,
  };
};
