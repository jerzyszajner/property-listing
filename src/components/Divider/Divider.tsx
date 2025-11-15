import styles from "./Divider.module.css";
import clsx from "clsx";

type DividerProps = {
  variant?: "default" | "muted";
};

/* Divider component */
const Divider = ({ variant = "default" }: DividerProps) => {
  return <div className={clsx(styles[variant])}></div>;
};

export default Divider;
