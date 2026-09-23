"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import BookModal from "@/components/Modals/BookModal/BookModal";
import { addBookToLibrary } from "@/lib/api/clientApi";
import { RecommendedBook } from "@/types/book";
import styles from "./RecommendedBookModal.module.css";

type Props = {
  books: RecommendedBook[];
};

export default function RecommendedBookModal({ books }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookId = searchParams.get("bookId");

  const book = bookId ? books.find((b) => b._id === bookId) : undefined;

  const [isPending, setIsPending] = useState(false);

  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("bookId");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleAddToLibrary = async () => {
    if (!bookId || !book) return;

    try {
      setIsPending(true);

      await addBookToLibrary(bookId);

      handleClose();
      router.refresh();
    } catch (error) {
      console.error("Error adding book to library:", error);
    } finally {
      setIsPending(false);
    }
  };

  if (!bookId) return null;

  if (!book) {
    return (
      <div className={styles.backdrop}>
        <div className={styles.notFoundCard}>
          <p className={styles.notFoundText}>Book not found</p>
          <button onClick={handleClose} className={styles.actionButton}>
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <BookModal
      book={book}
      isOpen={true}
      onClose={handleClose}
      actionType="add-to-library"
      onAction={handleAddToLibrary}
      actionPending={isPending}
    />
  );
}
