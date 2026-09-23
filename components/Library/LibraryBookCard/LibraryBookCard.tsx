"use client";

import Image from "next/image";
import { BookDetailsResponse } from "@/types/book";
import styles from "./LibraryBookCard.module.css";

type Props = {
  book: BookDetailsResponse;
  onDetails: (book: BookDetailsResponse) => void;
  onRemove: (bookId: string) => void;
};

export default function LibraryBookCard({ book, onDetails, onRemove }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer} onClick={() => onDetails(book)}>
        {book.imageUrl ? (
          <Image
            src={book.imageUrl}
            alt={book.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className={styles.placeholder}>
            <span>📖</span>
          </div>
        )}
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.info}>
          <h3 className={styles.title}>{book.title}</h3>
          <p className={styles.author}>{book.author}</p>
        </div>

        <button
          className={styles.removeBtn}
          onClick={() => onRemove(book._id)}
          aria-label="Delete book"
        >
          <svg width="16" height="16">
            <use
              href="/icons.svg#icon-trash"
              fill="none"
              stroke="currentColor"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
