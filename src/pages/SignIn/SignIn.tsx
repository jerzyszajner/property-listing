import { Link } from "react-router-dom";
import {
  PAGE_HEADER_CONFIG,
  SUCCESS_MESSAGE,
  SIGN_IN_FORM_LINKS,
} from "./signInConfig";
import { useSignInForm } from "./hooks/useSignInForm";
import PageHeader from "@/components/PageHeader/PageHeader";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import FormError from "@/components/FormError/FormError";
import Toast from "@/components/Toast/Toast";
import SuccessMessage from "@/components/SuccesMessage/SuccesMessage";
import styles from "./SignIn.module.css";

/* SignIn page component */
function SignIn() {
  const {
    register,
    handleSubmit,
    isSuccess,
    errors,
    isLoading,
    error,
    setError,
  } = useSignInForm();
  return (
    <div className={styles.signIn}>
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

      {/* === Sign In Form === */}
      <form className={styles.form} onSubmit={handleSubmit}>
        {/* === Name Fields === */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email*
            </label>
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
            <label htmlFor="password" className={styles.label}>
              Password*
            </label>
            <Input
              type="password"
              id="password"
              placeholder="Password"
              autoComplete="current-password"
              {...register("password")}
            />
            <FormError error={errors.password?.message} />
          </div>
        </div>

        {/* === Submit Button === */}
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>

        {/* === Link to Reset Password === */}
        <div className={styles.linkContainer}>
          {/* Map SIGN_IN_FORM_LINKS (Sign Up, Reset Password) */}
          {SIGN_IN_FORM_LINKS.map((link) => (
            <Link to={link.to} className={styles.link} key={link.to}>
              {link.label}
            </Link>
          ))}
        </div>
      </form>
    </div>
  );
}

export default SignIn;
