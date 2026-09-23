"use client";

import { useState, useEffect } from "react";
import { fetchRecommended } from "@/lib/api/clientApi";
import BooksList from "../../Books/BooksList/BooksList";
import { RecommendedBook } from "@/types/book";
import styles from "./RecommendedSection.module.css";

export default function RecommendedSection() {
  const [books, setBooks] = useState<RecommendedBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const loadMinRecommended = async () => {
      try {
        setIsLoading(true);
        const data = await fetchRecommended({ page: 1, limit: 3 });
        setBooks((data.results as RecommendedBook[]) || []);
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadMinRecommended();
  }, []);

  if (isLoading) {
    return <p className={styles.loading}>Loading...</p>;
  }

  if (isError) {
    return <p className={styles.error}>Failed to load recommendations</p>;
  }

  if (books.length === 0) return null;

  return <BooksList books={books} variant="compact" />;
}
