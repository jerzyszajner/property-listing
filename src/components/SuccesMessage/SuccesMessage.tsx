import { CheckCircle2 } from "lucide-react";
import styles from "./SuccesMessage.module.css";

interface SuccessMessageProps {
  message: string;
}

/* SuccessMessage component */
const SuccessMessage = ({ message }: SuccessMessageProps) => {
  return (
    <div className={styles.successMessage}>
      <CheckCircle2 className={styles.icon} aria-hidden="true" />
      <p className={styles.message}>{message}</p>
    </div>
  );
};

export default SuccessMessage;
