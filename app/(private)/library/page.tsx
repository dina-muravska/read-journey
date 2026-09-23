import MainLayout from "@/components/MainLayout";
import Dashboard from "@/components/Dashboard/Dashboard";
import LibraryDashboard from "@/components/Dashboard/LibraryDashboard/LibraryDashboard";
import MyLibrary from "@/components/Library/MyLibrary/MyLibrary";
import styles from "./page.module.css";

export default async function LibraryPage() {
  return (
    <MainLayout>
      <section className={styles.section}>
        <div className={styles.container}>
          <Dashboard>
            <LibraryDashboard />
          </Dashboard>
          <div className={styles.content}>
            <MyLibrary />
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
