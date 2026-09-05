import styles from "./Loader.module.css";

type LoaderProps = {
  size?: "small" | "medium" | "large";
  text?: string;
  className?: string;
};

export default function Loader({
  size = "medium",
  text,
  className = "",
}: LoaderProps) {
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={`${styles.spinner} ${styles[size]}`} />
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
}
