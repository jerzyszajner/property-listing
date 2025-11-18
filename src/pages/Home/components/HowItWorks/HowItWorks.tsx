import { STEPS_CONFIG } from "./howItWorksConfig";
import SectionHeader from "../SectionHeader/SectionHeader";
import styles from "./HowItWorks.module.css";

/* HowItWorks component */
const HowItWorks = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <SectionHeader
          title="How It Works"
          subtitle="Finding your next home is simple, fast, and secure."
        />

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
