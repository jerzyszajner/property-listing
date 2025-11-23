import clsx from "clsx";
import styles from "./Select.module.css";

type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  ariaLabel?: string;
  className?: string;
}

/* Select component */
const Select = ({
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
  id,
  ariaLabel = "Select",
  className,
}: SelectProps) => {
  return (
    <div className={clsx(styles.selectWrapper, className)}>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-label={ariaLabel}
        className={styles.select}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>

      <svg
        className={styles.arrow}
        width="12"
        height="8"
        viewBox="0 0 12 8"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M1 1L6 6L11 1"
          stroke="var(--color-text-light)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default Select;
