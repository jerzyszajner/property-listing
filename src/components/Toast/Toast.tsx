import { X } from "lucide-react";
import clsx from "clsx";
import Button from "@/components/Button/Button";
import styles from "./Toast.module.css";

type ToastProps = {
  message: string;
  variant?: "error" | "success";
  onClose?: () => void;
};

/* Toast component */
const Toast = ({ message, variant = "error", onClose }: ToastProps) => {
  return (
    <div className={clsx(styles.toast, styles[variant])}>
      <p className={styles.message}>{message}</p>
      <Button
        variant="closeCircle"
        className={styles.closeCircle}
        onClick={onClose}
        aria-label="Close notification"
      >
        <X className={styles.closeIcon} aria-hidden="true" />
      </Button>
    </div>
  );
};

export default Toast;
