"use client";

import { RecommendedBook } from "@/types/book";
import BookCard from "../BookCard/BookCard";
import styles from "./BooksList.module.css";

type Props = {
  books: RecommendedBook[];
  variant?: "default" | "compact";
};

export default function BooksList({ books, variant = "default" }: Props) {
  const listClass =
    variant === "default" ? styles.listDefault : styles.listCompact;

  return (
    <ul className={listClass}>
      {books.map((book) => (
        <li key={book._id}>
          <BookCard book={book} variant={variant} />
        </li>
      ))}
    </ul>
  );
}
