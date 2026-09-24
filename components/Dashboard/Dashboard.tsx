"use client";

import { ReactNode } from "react";
import styles from "./Dashboard.module.css";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function Dashboard({ children, className }: Props) {
  return (
    <aside className={`${styles.dashboard} ${className ?? ""}`}>
      {children}
    </aside>
  );
}
