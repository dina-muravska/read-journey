import styles from "./BooksListSkeleton.module.css";

export default function BooksListSkeleton() {
  return (
    <ul className={styles.skeletonList}>
      {Array.from({ length: 10 }).map((_, i) => (
        <li key={i} className={styles.skeletonItem} />
      ))}
    </ul>
  );
}
