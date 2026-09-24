"use client";

import React from "react";
import { useDeleteReadingSession } from "@/lib/api/mutations/reading";
import styles from "./ReadingDiary.module.css";

interface ProgressItem {
  id: string;
  startPage: number;
  finishPage?: number | null;
  startReading: string;
  finishReading?: string | null;
  status: "active" | "inactive";
}

interface Props {
  bookId: string;
  totalPages: number;
  progress: ProgressItem[];
}

export default function ReadingDiary({ bookId, totalPages, progress }: Props) {
  const deleteMutation = useDeleteReadingSession();

  const sortedProgress = [...progress].sort(
    (a, b) =>
      new Date(b.startReading).getTime() - new Date(a.startReading).getTime(),
  );

  return (
    <div className={styles.diaryList}>
      {sortedProgress.map((item) => {
        const pagesRead =
          item.finishPage && item.startPage
            ? item.finishPage - item.startPage + 1
            : 0;
        const percentage = ((pagesRead / totalPages) * 100).toFixed(1);

        const startDate = new Date(item.startReading).toLocaleDateString();
        const durationMinutes = item.finishReading
          ? Math.round(
              (new Date(item.finishReading).getTime() -
                new Date(item.startReading).getTime()) /
                60000,
            )
          : 0;

        return (
          <div key={item.id} className={styles.item}>
            <div>
              <div className={styles.date}>{startDate}</div>
              <div className={styles.details}>
                {item.status === "active" ? (
                  <span className={styles.activeText}>
                    Reading now (from page {item.startPage})
                  </span>
                ) : (
                  <>
                    {pagesRead} pages ({percentage}%) • {durationMinutes} mins
                  </>
                )}
              </div>
            </div>

            <button
              onClick={() =>
                deleteMutation.mutate({ progressId: item.id, bookId })
              }
              disabled={deleteMutation.isPending}
              className={styles.deleteBtn}
              title="Delete session"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}
