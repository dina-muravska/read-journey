"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchLibraryBooks } from "@/lib/api/clientApi";
import { useRemoveBookFromLibrary } from "@/lib/api/mutations/library";
import { BookDetailsResponse } from "@/types/book";
import EmptyState from "@/components/BooksNotFound/BooksNotFound";
import BooksFilter from "../BooksFilter/BooksFilter";
import BookModal from "@/components/Modals/BookModal/BookModal";
import LibraryBooksList from "../LibraryBooksList/LibraryBooksList";
import styles from "./MyLibrary.module.css";

type FilterValue = "all" | BookDetailsResponse["status"];

export default function MyLibrary() {
  const router = useRouter();

  const {
    data: books,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["library", "books"],
    queryFn: () => fetchLibraryBooks(),
    staleTime: 60 * 1000,
  });

  const { mutate: removeBook } = useRemoveBookFromLibrary();

  const [filter, setFilter] = useState<FilterValue>("all");

  const [selectedBook, setSelectedBook] = useState<BookDetailsResponse | null>(
    null,
  );

  const filteredBooks = useMemo(() => {
    if (!books) return [];
    if (filter === "all") return books;
    return books.filter((b) => b.status === filter);
  }, [books, filter]);

  const handleRemoveBook = (bookId: string) => {
    removeBook(bookId);
  };

  const handleStartReading = () => {
    if (selectedBook) {
      router.push(`/reading/${selectedBook._id}`);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Library</h1>
        <BooksFilter value={filter} onChange={setFilter} />
      </div>

      {isLoading && (
        <div
          style={{ textAlign: "center", padding: "40px 0", color: "#686868" }}
        >
          <p>Loading your books...</p>
        </div>
      )}

      {!isLoading && !error && filteredBooks.length === 0 && (
        <EmptyState
          description={
            <p>
              To start training, add{" "}
              <span className={styles.textHighlight}>some of your books</span>{" "}
              or from the recommended ones
            </p>
          }
        />
      )}

      {!isLoading && filteredBooks.length > 0 && (
        <LibraryBooksList
          books={filteredBooks}
          onDetails={setSelectedBook}
          onRemove={handleRemoveBook}
        />
      )}

      {selectedBook && (
        <BookModal
          book={selectedBook}
          isOpen={!!selectedBook}
          onClose={() => setSelectedBook(null)}
          actionType="start-reading"
          onAction={handleStartReading}
        />
      )}
    </div>
  );
}
