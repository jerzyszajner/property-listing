import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, type ContactFormData } from "../contactFormSchema";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { database } from "@/config/firebaseConfig";

// Hook for contact form
export const useContactForm = () => {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setIsSuccess(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  const onSubmit = async (data: ContactFormData) => {
    setError(null);
    try {
      await addDoc(collection(database, "messages"), {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
        createdAt: serverTimestamp(),
      });
      reset();
      setIsSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send message. Please try again.",
      );
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    watch,
    resetForm: reset,
    isSuccess,
    setIsSuccess,
    isLoading: isSubmitting,
    error,
    setError,
  };
};
