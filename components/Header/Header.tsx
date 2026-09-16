"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useAuthStore } from "@/stores/store";
import styles from "./Header.module.css";

const NAV_LINKS = [
  { href: "/recommended", label: "Home" },
  { href: "/library", label: "My Library" },
];

export default function Header() {
  const { user, logout, isLoading } = useAuthStore();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = isNavOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isNavOpen]);

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const isActiveRoute = (route: string) => {
    return pathname === route || pathname?.startsWith(`${route}/`);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div>
          <Link href="/" aria-label="Go to home page">
            <svg width="42" height="17">
              <use
                href="/icons.svg#icon-logo_mob"
                fill="#F9F9F9"
                stroke="#141414"
              />
            </svg>
          </Link>
        </div>

        <nav className={styles.desktopNav}>
          <ul className={styles.navList}>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`${styles.navLink} ${
                    isActiveRoute(link.href) ? styles.navLinkActive : ""
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.userBar}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {user?.name ? user.name.slice(0, 1) : "U"}
            </div>
            {user && <span className={styles.userName}>{user.name}</span>}
          </div>

          <button
            className={styles.logoutBtn}
            onClick={handleLogout}
            disabled={isLoading}
            aria-label="Log out"
          >
            {isLoading ? "Logging out..." : "Log out"}
          </button>

          <button
            className={styles.burgerBtn}
            onClick={() => setIsNavOpen(!isNavOpen)}
            aria-label="Toggle navigation menu"
          >
            <svg width="28" height="28">
              <use
                href="/icons.svg#icon-burger"
                fill="#141414"
                stroke="#F9F9F9"
              />
            </svg>
          </button>

          {isNavOpen && (
            <div
              className={styles.overlay}
              onClick={() => setIsNavOpen(false)}
              aria-label="Close navigation menu"
            >
              <div
                className={styles.drawer}
                onClick={(e) => e.stopPropagation()}
                ref={menuRef}
              >
                <button
                  onClick={() => setIsNavOpen(false)}
                  className={styles.closeBtn}
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" style={{ color: "#FBFBFB" }} />
                </button>

                <div className={styles.drawerContent}>
                  <nav>
                    <ul className={styles.mobileNavList}>
                      {NAV_LINKS.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            onClick={() => setIsNavOpen(false)}
                            className={`${styles.navLink} ${
                              isActiveRoute(link.href)
                                ? styles.navLinkActive
                                : ""
                            }`}
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>

                  <button
                    onClick={async () => {
                      setIsNavOpen(false);
                      await handleLogout();
                    }}
                    disabled={isLoading}
                    className={styles.mobileLogoutBtn}
                    aria-label="Log out"
                  >
                    {isLoading ? "Logging out..." : "Log out"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
