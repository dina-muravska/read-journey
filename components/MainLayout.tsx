import { ReactNode } from "react";
import Header from "@/components/Header/Header";
import styles from "./MainLayout.module.css";

type Props = {
  children: ReactNode;
};

export default function MainLayout({ children }: Props) {
  return (
    <>
      <Header />
      <main className={styles.main}>{children}</main>
    </>
  );
}
