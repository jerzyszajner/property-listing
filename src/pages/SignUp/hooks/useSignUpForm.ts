import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpFormSchema, type SignUpFormData } from "../signUpFormSchema";
import { signUp, getAuthErrorMessage } from "@/services/authService";
import { createUserProfile } from "@/services/userService";

// Hook for sign up form
export const useSignUpForm = () => {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setIsSuccess(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  const onSubmit = async (data: SignUpFormData) => {
    setError(null);
    try {
      const userCredential = await signUp(data.email, data.password);

      await createUserProfile(userCredential.user.uid, {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
      });

      reset();
      setIsSuccess(true);
    } catch (err) {
      setError(getAuthErrorMessage(err));
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    isSuccess,
    errors,
    resetForm: reset,
    isLoading: isSubmitting,
    error,
    setError,
  };
};
