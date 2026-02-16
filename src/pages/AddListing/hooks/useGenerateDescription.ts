import { useState } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import type { UseFormGetValues, UseFormSetValue } from "react-hook-form";
import { app } from "@/config/firebaseConfig";
import type { AddListingFormData } from "../addListing.FormSchema";

type GenerateDescriptionRequest = {
  title: string;
  city?: string;
  amenities?: string[];
  notes?: string;
  bedroom?: number;
  guest?: number;
};

type GenerateDescriptionResponse = {
  title: string;
  description: string;
};

type UseGenerateDescriptionParams = {
  getValues: UseFormGetValues<AddListingFormData>;
  setValue: UseFormSetValue<AddListingFormData>;
  setError: (message: string | null) => void;
};

export interface UseGenerateDescriptionReturn {
  isGenerating: boolean;
  handleGenerateDescription: () => Promise<void>;
}

// Hook for generating listing title and description with AI
export const useGenerateDescription = ({
  getValues,
  setValue,
  setError,
}: UseGenerateDescriptionParams): UseGenerateDescriptionReturn => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateDescription = async (): Promise<void> => {
    const formValues = getValues();
    const title = formValues.title.trim();

    if (!title) {
      setError("Please enter a title before generating description.");
      return;
    }

    setError(null);
    setIsGenerating(true);

    try {
      const generateDescription = httpsCallable<
        GenerateDescriptionRequest,
        GenerateDescriptionResponse
      >(getFunctions(app, "europe-north1"), "generateDescription");
      const { data } = await generateDescription({
        title,
        city: formValues.city.trim(),
        amenities: formValues.amenities,
        notes: formValues.description.trim(),
        bedroom: formValues.bedroom,
        guest: formValues.guest,
      });

      const generatedTitle = data.title?.trim() || title;
      const generatedDescription = data.description?.trim() ?? "";

      if (!generatedDescription) {
        throw new Error("AI returned an empty description.");
      }

      setValue("title", generatedTitle, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });

      setValue("description", generatedDescription, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate title and description. Please try again.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    handleGenerateDescription,
  };
};
