import { STEPS_CONFIG } from "./howItWorksConfig";
import styles from "./HowItWorks.module.css";

/* HowItWorks component */
const HowItWorks = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>How It Works</h2>
        <p className={styles.subtitle}>
          Finding your next home is simple, fast, and secure.
        </p>

        <div className={styles.steps}>
          {STEPS_CONFIG.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className={styles.step}>
                <div className={styles.iconWrapper}>
                  <Icon className={styles.icon} />
                </div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
