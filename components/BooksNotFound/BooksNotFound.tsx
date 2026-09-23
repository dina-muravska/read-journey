"use client";

import styles from "./BooksNotFound.module.css";

type Props = {
  title?: string;
  description?: React.ReactNode;
  className?: string;
};

export default function BooksNotFound({
  title,
  description,
  className,
}: Props) {
  const containerClasses = [styles.container, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClasses}>
      <div className={styles.imageWrapper}>
        <div className={styles.circleBackground} />

        <picture className={styles.picture}>
          <source
            srcSet="/img/books@1x.webp 1x, /img/books@2x.webp 2x"
            media="(min-width: 320px)"
          />
          <img src="/img/books@1x.webp" alt="Books" className={styles.image} />
        </picture>
      </div>

      <div className={styles.textGroup}>
        {title && <p className={styles.title}>{title}</p>}
        {description && <div className={styles.description}>{description}</div>}
      </div>
    </div>
  );
}
