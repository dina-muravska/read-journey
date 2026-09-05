import type { Metadata } from "next";
import Link from "next/link";
import styles from "./not-found.module.css";

// const SITE_URL = "";

export const metadata: Metadata = {
  title: "Page Not Found | Read Journey",
  description:
    "The page you are looking for does not exist or has been moved. Return to Read Journey to continue tracking your books.",
  openGraph: {
    type: "website",
    title: "Page Not Found | Read Journey",
    description:
      "The page you are looking for does not exist or has been moved. Return to Read Journey to continue tracking your books.",
    // url: `${SITE_URL}/404`,
    siteName: "Read Journey",
  },
};

const NotFound = () => {
  return (
    <div className={`container ${styles.notFoundWrapper}`}>
      <h1 className={styles.title}>404</h1>
      <h2 className={styles.subtitle}>Page Not Found</h2>
      <p className={styles.description}>
        Sorry, the page you are looking for doesn’t exist or has been moved.
      </p>

      <Link href="/" className={`main-button ${styles.homeLink}`}>
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
