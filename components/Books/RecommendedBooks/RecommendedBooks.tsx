import { fetchRecommendedServer } from "@/lib/api/server";
import BooksList from "../../Books/BooksList/BooksList";
import Pagination from "../../Books/Pagination/Pagination";
import BooksListSkeleton from "../../Books/BooksListSkeleton/BooksListSkeleton";
import RecommendedBookModal from "@/components/Modals/RecommendedBookModal/RecommendedBookModal";
import { Suspense } from "react";
import styles from "./RecommendedBooks.module.css";

type Props = {
  searchParams?: {
    page?: string;
    limit?: string;
    author?: string;
    title?: string;
  };
};

export default async function RecommendedBooks({ searchParams }: Props) {
  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 10;
  const author = searchParams?.author || "";
  const title = searchParams?.title || "";

  let data;
  try {
    data = await fetchRecommendedServer({ page, limit, author, title });
  } catch (error) {
    console.error("Fetching recommended books failed:", error);
    return (
      <p className={styles.errorText}>Failed to load recommended books.</p>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Recommended</h1>
        <Pagination page={data.page} totalPages={data.totalPages} />
      </div>

      <Suspense fallback={<BooksListSkeleton />}>
        <BooksList books={data.results} variant="compact" />
      </Suspense>

      <RecommendedBookModal books={data.results} />
    </div>
  );
}
