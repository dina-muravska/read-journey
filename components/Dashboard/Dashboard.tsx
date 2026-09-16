"use client";

import { ReactNode } from "react";
import styles from "./Dashboard.module.css";

type Props = {
  children: ReactNode;
};

export default function Dashboard({ children }: Props) {
  return <aside className={styles.dashboard}>{children}</aside>;
}
