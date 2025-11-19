import styles from "./FormError.module.css";

type FormErrorProps = {
  error?: string;
  className?: string;
};

/* FormError component */
const FormError = ({ error }: FormErrorProps) => {
  return <div className={styles.error}>{error || ""}</div>;
};

export default FormError;
