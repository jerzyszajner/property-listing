import { useState } from "react";
import { useForm } from "@/hooks/useForm";
import { contactValidation } from "../contactValidation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { database } from "@/config/firebaseConfig";

// Hook for contact form
export const useContactForm = () => {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { formData, errors, handleChange, handleSubmit, resetForm } = useForm({
    initialValues: {
      fname: "",
      lname: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
    validation: contactValidation,
    onSubmit: async (data) => {
      setError(null);
      try {
        setIsLoading(true);
        await addDoc(collection(database, "messages"), {
          fname: data.fname,
          lname: data.lname,
          email: data.email,
          phone: data.phone,
          subject: data.subject,
          message: data.message,
          createdAt: serverTimestamp(),
        });
        resetForm();
        setIsSuccess(true);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to send message. Please try again."
        );
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
  });

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
    resetForm,
    isSuccess,
    setIsSuccess,
    isLoading,
    error,
    setError,
  };
};
