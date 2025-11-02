import styles from "./EmptyState.module.css";

interface EmptyStateProps {
  message: string;
}

// EmptyState component for displaying a message when no properties are found
const EmptyState = ({ message = "No items found." }: EmptyStateProps) => {
  return (
    <div className={styles.emptyState}>
      <p className={styles.emptyMessage}>{message}</p>
    </div>
  );
};

export default EmptyState;
