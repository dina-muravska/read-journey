import MainLayout from "@/components/MainLayout";
import RecommendedBooks from "@/components/Books/RecommendedBooks/RecommendedBooks";
import Dashboard from "@/components/Dashboard/Dashboard";
import RecommendedDashboard from "@/components/Dashboard/RecommendedDashboard/RecommendedDashboard";
import ResponsivePaginationWrapper from "@/components/Books/ResponsivePaginationWrapper";
import styles from "./recommended.module.css";

type Props = {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    author?: string;
    title?: string;
  }>;
};

export default async function RecommendedPage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <MainLayout>
      <section className={styles.section}>
        <div className={styles.container}>
          <Dashboard>
            <RecommendedDashboard />
          </Dashboard>

          <div className={styles.contentWrapper}>
            <ResponsivePaginationWrapper>
              <RecommendedBooks searchParams={params} />
            </ResponsivePaginationWrapper>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
