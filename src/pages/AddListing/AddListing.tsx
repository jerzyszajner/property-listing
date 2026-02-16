import { useEffect } from "react";
import { Controller } from "react-hook-form";
import PageHeader from "@/components/PageHeader/PageHeader";
import Label from "@/components/Label/Label";
import Input from "@/components/Input/Input";
import Select from "@/components/Select/Select";
import Textarea from "@/components/Textarea/Textarea";
import Divider from "@/components/Divider/Divider";
import FormError from "@/components/FormError/FormError";
import Button from "@/components/Button/Button";
import Toast from "@/components/Toast/Toast";
import SuccessMessage from "@/components/SuccesMessage/SuccesMessage";
import {
  PAGE_HEADER_CONFIG,
  AMENITIES_OPTIONS,
  SUCCESS_MESSAGE,
  COUNTRY_OPTIONS,
} from "./addListingConfig";
import { useAddListingForm } from "./hooks/useAddListingForm";
import { useGenerateDescription } from "./hooks/useGenerateDescription";
import { usePropertyImageUpload } from "./hooks/usePropertyImageUpload";
import PropertyImageUpload from "./components/PropertyImageUpload/PropertyImageUpload";
import styles from "./AddListing.module.css";

/* AddListing page component */
const AddListing = () => {
  const {
    register,
    control,
    handleSubmit,
    errors,
    isLoading,
    isSuccess,
    error,
    setError,
    setValue,
    watch,
    getValues,
  } = useAddListingForm();
  const propertyImageUpload = usePropertyImageUpload();
  const imageUrl = watch("image");
  const titleValue = watch("title");
  const { isGenerating, handleGenerateDescription } = useGenerateDescription({
    getValues,
    setValue,
    setError,
  });

  useEffect(() => {
    if (propertyImageUpload.error) {
      setError(propertyImageUpload.error);
      propertyImageUpload.setError(null);
    }
  }, [propertyImageUpload.error, setError, propertyImageUpload]);

  return (
    <div className={styles.addListing}>
      {/* === Error Toast === */}
      {error && (
        <Toast message={error} variant="error" onClose={() => setError(null)} />
      )}
      {isSuccess && (
        <SuccessMessage
          title={SUCCESS_MESSAGE.title}
          message={SUCCESS_MESSAGE.message}
        />
      )}
      {/* === Page Header === */}
      <PageHeader
        title={PAGE_HEADER_CONFIG.title}
        subtitle={PAGE_HEADER_CONFIG.subtitle}
      />

      {/* === AddListing Form === */}
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.formGroup}>
          <Label htmlFor="image" required>
            Property Image
          </Label>
          <PropertyImageUpload
            imageUpload={propertyImageUpload}
            imageUrl={imageUrl || null}
            onImageChange={(url) =>
              setValue("image", url, { shouldValidate: true })
            }
          />
          <FormError error={errors.image?.message} />
        </div>

        <div className={styles.formGroup}>
          <Label htmlFor="title" required>
            Title
          </Label>
          <Input
            type="text"
            id="title"
            maxLength={120}
            placeholder="Write som keywords and use Generate with AI."
            autoComplete="off"
            {...register("title")}
          />
          <FormError error={errors.title?.message} />
        </div>

        <div className={styles.formGroup}>
          <Label htmlFor="street" required>
            Street
          </Label>
          <Input
            type="text"
            id="street"
            maxLength={30}
            placeholder="Enter street name e.g., Storgata 1"
            autoComplete="address-line1"
            {...register("street")}
          />
          <FormError error={errors.street?.message} />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <Label htmlFor="zipCode" required>
              Zip Code
            </Label>
            <Input
              type="text"
              id="zipCode"
              maxLength={4}
              placeholder="Enter zip code"
              autoComplete="postal-code"
              {...register("zipCode")}
            />
            <FormError error={errors.zipCode?.message} />
          </div>

          <div className={styles.formGroup}>
            <Label htmlFor="city" required>
              City
            </Label>
            <Input
              type="text"
              id="city"
              maxLength={30}
              placeholder="Enter your city"
              autoComplete="address-level2"
              {...register("city")}
            />
            <FormError error={errors.city?.message} />
          </div>

          <div className={styles.formGroup}>
            <Label htmlFor="country" required>
              Country
            </Label>
            <Select
              id="country"
              options={COUNTRY_OPTIONS}
              placeholder="Select country"
              ariaLabel="Country"
              {...register("country")}
            />
            <FormError error={errors.country?.message} />
          </div>
        </div>

        {/* === Description Field === */}
        <div className={styles.formGroup}>
          <div className={styles.descriptionActions}>
            <Label htmlFor="description" required>
              Description
            </Label>
            <Button
              type="button"
              variant="secondary"
              onClick={handleGenerateDescription}
              disabled={isGenerating || isLoading || !titleValue.trim()}
            >
              {isGenerating ? (
                <span className={styles.generateButtonContent}>
                  <span className={styles.inlineSpinner} aria-hidden="true" />
                  Generating...
                </span>
              ) : (
                "Generate with AI"
              )}
            </Button>
          </div>

          <Textarea
            id="description"
            placeholder="Write some keywords and use Generate with AI. Fill in title, city, amenities, bedrooms, and guests for best results."
            rows={5}
            maxLength={5000}
            {...register("description")}
          />
          <div className={styles.errorRow}>
            <FormError error={errors.description?.message} />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <Label htmlFor="bedroom">Bedrooms</Label>
            <Input
              type="number"
              id="bedroom"
              min={0}
              max={20}
              placeholder="e.g. 2"
              {...register("bedroom", { valueAsNumber: true })}
            />
            <FormError error={errors.bedroom?.message} />
          </div>

          <div className={styles.formGroup}>
            <Label htmlFor="guest">Guests</Label>
            <Input
              type="number"
              id="guest"
              min={0}
              max={20}
              placeholder="e.g. 4"
              {...register("guest", { valueAsNumber: true })}
            />
            <FormError error={errors.guest?.message} />
          </div>
          <div className={styles.formGroup}>
            <Label htmlFor="price">Price</Label>
            <Input
              type="number"
              id="price"
              min={0}
              placeholder="e.g. 100"
              {...register("price", { valueAsNumber: true })}
            />
            <FormError error={errors.price?.message} />
          </div>
        </div>

        <div className={styles.formGroup}>
          <Divider />
          <Controller
            name="amenities"
            control={control}
            render={({ field }) => (
              <div className={styles.amenitiesGrid}>
                {AMENITIES_OPTIONS.map(({ id, label }) => (
                  <div key={id} className={styles.checkboxRow}>
                    <input
                      type="checkbox"
                      id={id}
                      className={styles.checkbox}
                      checked={field.value.includes(id)}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...field.value, id]
                          : field.value.filter((x) => x !== id);
                        field.onChange(next);
                      }}
                    />
                    <Label htmlFor={id}>{label}</Label>
                  </div>
                ))}
              </div>
            )}
          />
          <Divider />
        </div>
        {/* === Submit Button === */}
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? "Sending..." : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default AddListing;
