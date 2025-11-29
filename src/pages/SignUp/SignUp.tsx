import { Link } from "react-router-dom";
import { PAGE_HEADER_CONFIG, SUCCESS_MESSAGE } from "./signUpConfig";
import { useSignUpForm } from "./hooks/useSignUpForm";
import PageHeader from "@/components/PageHeader/PageHeader";
import Label from "@/components/Label/Label";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import FormError from "@/components/FormError/FormError";
import Toast from "@/components/Toast/Toast";
import SuccessMessage from "@/components/SuccesMessage/SuccesMessage";
import styles from "./SignUp.module.css";

/* SignUp page component */
const SignUp = () => {
  const {
    register,
    handleSubmit,
    isSuccess,
    errors,
    isLoading,
    error,
    setError,
  } = useSignUpForm();

  return (
    <div className={styles.signUp}>
      {/* === Error Toast === */}
      {error && (
        <Toast message={error} variant="error" onClose={() => setError(null)} />
      )}

      {/* === Success Message === */}
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

      {/* === Sign Up Form === */}
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {/* === Name Fields === */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <Label htmlFor="firstName" required>
              First Name
            </Label>
            <Input
              type="text"
              id="firstName"
              maxLength={30}
              placeholder="First name"
              autoComplete="given-name"
              {...register("firstName")}
            />
            <FormError error={errors.firstName?.message} />
          </div>

          <div className={styles.formGroup}>
            <Label htmlFor="lastName" required>
              Last Name
            </Label>
            <Input
              type="text"
              id="lastName"
              maxLength={30}
              placeholder="Last name"
              autoComplete="family-name"
              {...register("lastName")}
            />
            <FormError error={errors.lastName?.message} />
          </div>
        </div>

        {/* === Contact Fields === */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <Label htmlFor="email" required>
              Email
            </Label>
            <Input
              type="email"
              id="email"
              maxLength={30}
              placeholder="Email"
              autoComplete="email"
              {...register("email")}
            />
            <FormError error={errors.email?.message} />
          </div>

          <div className={styles.formGroup}>
            <Label htmlFor="phone" required>
              Phone
            </Label>
            <Input
              type="tel"
              id="phone"
              maxLength={10}
              placeholder="Phone"
              autoComplete="tel"
              {...register("phone")}
            />
            <FormError error={errors.phone?.message} />
          </div>
        </div>

        {/* === Password Fields === */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <Label htmlFor="password" required>
              Password
            </Label>
            <Input
              type="password"
              id="password"
              placeholder="Password"
              autoComplete="new-password"
              {...register("password")}
            />
            <FormError error={errors.password?.message} />
          </div>

          <div className={styles.formGroup}>
            <Label htmlFor="confirmPassword" required>
              Confirm Password
            </Label>
            <Input
              type="password"
              id="confirmPassword"
              placeholder="Confirm password"
              autoComplete="new-password"
              {...register("confirmPassword")}
            />
            <FormError error={errors.confirmPassword?.message} />
          </div>
        </div>

        {/* === Submit Button === */}
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? "Signing up..." : "Sign Up"}
        </Button>

        {/* === Link to Sign In === */}
        <div className={styles.linkContainer}>
          <Link to="/sign-in" className={styles.link}>
            Already have an account? Sign in
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
