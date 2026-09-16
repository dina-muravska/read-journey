import styles from "./Dashboard.module.css";

type WorkoutStepProps = {
  number: number;
  title: string;
  description: string;
};

export default function WorkoutStep({
  number,
  title,
  description,
}: WorkoutStepProps) {
  return (
    <div className={styles.stepItem}>
      <div className={styles.stepNumber}>{number}</div>
      <p className={styles.stepText}>
        {title} <span className={styles.stepDescription}>{description}</span>
      </p>
    </div>
  );
}
