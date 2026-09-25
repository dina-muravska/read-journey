"use client";

import React, { useState, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/MainLayout";
import Dashboard from "@/components/Dashboard/Dashboard";
import ReadingDashboard from "@/components/Dashboard/ReadingDashboard/ReadingDashboard";
import MyBook from "@/components/MyBook/MyBook";
import BookCompletedModal from "@/components/Modals/BookCompletedModal/BookCompletedModal";
import { nextServer } from "../../../../lib/api/api";
import styles from "./reading.module.css";

interface PageProps {
  params: Promise<{ bookId: string }>;
}

export default function ReadingPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const bookId = resolvedParams.bookId;

  const router = useRouter();

  const [showCompletedModal, setShowCompletedModal] = useState(false);
  const [viewMode, setViewMode] = useState<
    "diary" | "statistics" | "emptyprogress"
  >("diary");

  const {
    data: book,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["book", bookId],
    queryFn: async () => {
      const { data } = await nextServer.get(`/books/${bookId}`);
      return data;
    },
    enabled: !!bookId,
  });

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

  if (isError || !book) {
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
