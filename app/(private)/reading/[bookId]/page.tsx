"use client";

import React, { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/MainLayout";
import Dashboard from "@/components/Dashboard/Dashboard";
import ReadingDashboard from "@/components/Dashboard/ReadingDashboard/ReadingDashboard";
import MyBook from "@/components/MyBook/MyBook";
import BookCompletedModal from "@/components/Modals/BookCompletedModal/BookCompletedModal";
import { BookDetailsResponse } from "@/types/book";
import styles from "./reading.module.css";

interface PageProps {
  params: Promise<{ bookId: string }>;
}

export default function ReadingPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const bookId = resolvedParams.bookId;

  const router = useRouter();

  const [book, setBook] = useState<BookDetailsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const [showCompletedModal, setShowCompletedModal] = useState(false);
  const [viewMode, setViewMode] = useState<
    "diary" | "statistics" | "emptyprogress"
  >("diary");

  useEffect(() => {
    if (!bookId) return;

    const fetchBook = async () => {
      try {
        setIsLoading(true);
        setError(false);

        const res = await fetch(`/api/books/${bookId}`);

        if (!res.ok) {
          throw new Error("Book not found");
        }

        const data = await res.json();
        setBook(data);
      } catch (err) {
        console.error("Failed to load book details:", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

  const handleBookCompleted = useCallback(() => {
    setShowCompletedModal(true);
  }, []);

  const closeCompletedModal = useCallback(() => {
    setShowCompletedModal(false);
  }, []);

  if (isLoading) {
    return (
      <MainLayout>
        <div className={styles.centerWrapper}>
          <p className={styles.loadingText}>Loading book details...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !book) {
    return (
      <MainLayout>
        <div className={styles.centerWrapper}>
          <h2 className={styles.notFoundTitle}>Book not found</h2>
          <p className={styles.notFoundText}>
            The book you are looking for does not exist or has been removed.
          </p>
          <button
            onClick={() => router.push("/library")}
            className={styles.backButton}
          >
            Go to Library
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section>
        <div className={styles.container}>
          <Dashboard className={styles.sidebar}>
            <ReadingDashboard
              book={book}
              onBookCompleted={handleBookCompleted}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
          </Dashboard>

          <div className={styles.mainContent}>
            <MyBook book={book} />
          </div>
        </div>
      </section>

      <BookCompletedModal
        isOpen={showCompletedModal}
        onClose={closeCompletedModal}
      />
    </MainLayout>
  );
}
