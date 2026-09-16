import Link from "next/link";
import { ReactNode } from "react";
import styles from "./AuthLayout.module.css";

type AuthLayoutProps = {
  children: ReactNode;
  title?: ReactNode;
};

export default function AuthLayout({
  children,
  title = (
    <>
      Expand your mind, reading{" "}
      <span className={styles.highlightText}>a book</span>
    </>
  ),
}: AuthLayoutProps) {
  return (
    <main className={styles.main}>
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.layoutWrapper}>
            <div className={styles.leftSection}>
              <Link href="/" aria-label="Go to home page">
                <svg className={styles.mobileLogo} width="42" height="17">
                  <use
                    href="/icons.svg#icon-logo_mob"
                    fill="#F9F9F9"
                    stroke="#141414"
                  />
                </svg>
              </Link>

              <Link href="/" aria-label="Go to home page">
                <svg className={styles.desktopLogo} width="182" height="17">
                  <use
                    href="/icons.svg#icon-logo"
                    fill="#F9F9F9"
                    stroke="#141414"
                  />
                </svg>
              </Link>

              <h1 className={styles.title}>{title}</h1>

              {children}
            </div>

            <div className={styles.rightSection}>
              <div className={styles.imageWrapper}>
                <picture>
                  <source
                    srcSet="/img/iphone@1x.webp 1x, /img/iphone@2x.webp 2x"
                    media="(min-width: 1440px)"
                  />

                  <source
                    srcSet="/img/iphone-m@1x.webp 1x, /img/iphone-m@2x.webp 2x"
                    media="(max-width: 767px)"
                  />

                  <img
                    src="/img/iphone@1x.webp"
                    alt="Expand your mind, reading"
                    className={styles.heroImage}
                  />
                </picture>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
