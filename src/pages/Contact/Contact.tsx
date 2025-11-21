import { PAGE_HEADER_CONFIG } from "./contactConfig";
import PageHeader from "@/components/PageHeader/PageHeader";
import Input from "@/components/Input/Input";
import Textarea from "@/components/Textarea/Textarea";
import Button from "@/components/Button/Button";
import FormError from "@/components/FormError/FormError";
import { useContactForm } from "./hooks/useContactForm";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import SuccessMessage from "@/components/SuccesMessage/SuccesMessage";
import Toast from "@/components/Toast/Toast";
import styles from "./Contact.module.css";

/* Contact page component */
const Contact = () => {
  const { width, height } = useWindowSize();
  const {
    formData,
    errors,
    handleChange,
    handleSubmit,
    isSuccess,
    setIsSuccess,
    isLoading,
    error,
    setError,
  } = useContactForm();

  return (
    <div className={styles.contact}>
      {/* === Error Toast === */}
      {error && (
        <Toast message={error} variant="error" onClose={() => setError(null)} />
      )}
      {/* === Success Message === */}
      {isSuccess && (
        <>
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={250}
            gravity={0.6}
            friction={0.95}
            onConfettiComplete={() => {
              setIsSuccess(false);
            }}
          />
          <SuccessMessage message="Message sent successfully!" />
        </>
      )}
      {/* === Page Header === */}
      <PageHeader
        title={PAGE_HEADER_CONFIG.title}
        subtitle={PAGE_HEADER_CONFIG.subtitle}
      />
      {/* === Contact Form === */}
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {/* === Name Fields === */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="fname" className={styles.label}>
              First Name*
            </label>
            <Input
              type="text"
              id="fname"
              name="fname"
              maxLength={30}
              placeholder="First name"
              autoComplete="given-name"
              value={formData.fname}
              onChange={handleChange}
            />
            <FormError error={errors.fname} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="lname" className={styles.label}>
              Last Name*
            </label>
            <Input
              type="text"
              id="lname"
              name="lname"
              maxLength={30}
              placeholder="Last name"
              autoComplete="family-name"
              value={formData.lname}
              onChange={handleChange}
            />
            <FormError error={errors.lname} />
          </div>
        </div>

        {/* === Contact Fields === */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email*
            </label>
            <Input
              type="email"
              id="email"
              name="email"
              maxLength={30}
              placeholder="Email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
            />
            <FormError error={errors.email} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone" className={styles.label}>
              Phone*
            </label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              maxLength={15}
              placeholder="Phone"
              autoComplete="tel"
              value={formData.phone}
              onChange={handleChange}
            />
            <FormError error={errors.phone} />
          </div>
        </div>

        {/* === Subject Field === */}
        <div className={styles.formGroup}>
          <label htmlFor="subject" className={styles.label}>
            Subject
          </label>
          <Input
            type="text"
            id="subject"
            name="subject"
            maxLength={50}
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
          />
          <FormError error={errors.subject} />
        </div>

        {/* === Message Field === */}
        <div className={styles.formGroup}>
          <label htmlFor="message" className={styles.label}>
            Message*
          </label>
          <Textarea
            id="message"
            name="message"
            placeholder="Message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
          />
          <div className={styles.errorRow}>
            <FormError error={errors.message} />
            <span className={styles.charCount}>
              {formData.message.length}/400
            </span>
          </div>
        </div>

        {/* === Submit Button === */}
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? "Sending..." : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default Contact;
