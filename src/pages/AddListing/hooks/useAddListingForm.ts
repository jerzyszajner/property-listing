import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addListingFormSchema,
  type AddListingFormData,
} from "../addListing.FormSchema";
import { useAuthContext } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { createProperty } from "@/services/propertyService";

const defaultAmenities: string[] = [];

// Hook for AddListing form
export const useAddListingForm = () => {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthContext();
  const { userProfile } = useUserProfile();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
    getValues,
  } = useForm<AddListingFormData>({
    resolver: zodResolver(addListingFormSchema),
    defaultValues: {
      title: "",
      street: "",
      zipCode: "",
      city: "",
      country: "",
      description: "",
      bedroom: 0,
      guest: 0,
      price: 0,
      amenities: defaultAmenities,
      image: "",
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

  const onSubmit = async (data: AddListingFormData) => {
    setError(null);

    if (!user) {
      setError("You must be logged in to add a listing.");
      return;
    }

    const hostName = userProfile?.firstName || "";
    const hostImage = userProfile?.profileImage || "";

    try {
      await createProperty(user.uid, {
        hostId: user.uid,
        title: data.title,
        description: data.description,
        price: data.price,
        rating: 0,
        superhost: false,
        image: data.image,
        address: {
          street: data.street.trim().toLowerCase(),
          zipCode: data.zipCode.trim(),
          city: data.city.trim().toLowerCase(),
          country: data.country.trim().toLowerCase(),
        },
        amenities: data.amenities,
        capacity: {
          guest: data.guest,
          bedroom: data.bedroom,
        },
        host: {
          name: hostName.trim().toLowerCase(),
          image: hostImage,
        },
      });
      reset();
      setIsSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to add listing. Please try again.",
      );
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    control,
    errors,
    watch,
    setValue,
    getValues,
    resetForm: reset,
    isSuccess,
    setIsSuccess,
    isLoading: isSubmitting,
    error,
    setError,
  };
};
