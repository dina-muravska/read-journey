"use client";

import React from "react";
import { useDeleteReadingSession } from "@/lib/api/mutations/reading";
import { BookProgress } from "@/types/book";
import styles from "./ReadingDiary.module.css";

interface Props {
  bookId: string;
  totalPages: number;
  progress: BookProgress[];
}

export default function ReadingDiary({ bookId, totalPages, progress }: Props) {
  const deleteMutation = useDeleteReadingSession();

  const sortedProgress = [...progress].sort(
    (a, b) =>
      new Date(b.startReading).getTime() - new Date(a.startReading).getTime(),
  );

  return (
    <div className={styles.diaryList}>
      {sortedProgress.map((item, index) => {
        const pagesRead =
          item.finishPage && item.startPage
            ? item.finishPage - item.startPage + 1
            : 0;
        const percentage = ((pagesRead / totalPages) * 100).toFixed(1);

        const startDate = new Date(item.startReading).toLocaleDateString(
          "uk-UA",
        );

        const durationMinutes = item.finishReading
          ? Math.round(
              (new Date(item.finishReading).getTime() -
                new Date(item.startReading).getTime()) /
                60000,
            )
          : 0;

        const pagesPerHour =
          durationMinutes > 0
            ? Math.round((pagesRead / durationMinutes) * 60)
            : 0;

        return (
          <div key={item._id} className={styles.item}>
            <div className={styles.leftSection}>
              <div
                className={`${styles.squareIndicator} ${
                  index === 0 ? styles.activeSquare : ""
                }`}
              />
              <div className={styles.dateCol}>
                <span className={styles.date}>{startDate}</span>
                <span className={styles.percentage}>{percentage}%</span>
                <span className={styles.duration}>
                  {durationMinutes} minutes
                </span>
              </div>
            </div>

            <div className={styles.rightSection}>
              <div className={styles.pagesCount}>{pagesRead} pages</div>

              <div className={styles.graphWrapper}>
                <svg className={styles.graphSvg} viewBox="0 0 60 20">
                  <polygon
                    points="0,20 60,5 60,20"
                    fill="#30b94d"
                    opacity="0.8"
                  />
                </svg>
              </div>

              <div className={styles.speedText}>
                {pagesPerHour > 0 ? `${pagesPerHour} pages per hour` : "—"}
              </div>
            </div>

            <button
              onClick={() =>
                deleteMutation.mutate({ progressId: item._id, bookId })
              }
              disabled={deleteMutation.isPending}
              className={styles.deleteBtn}
              title="Delete session"
            >
              <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
                <path
                  d="M1 4.5H13M2.5 4.5V15C2.5 15.8284 3.17157 16.5 4 16.5H10C10.8284 16.5 11.5 15.8284 11.5 15V4.5M4.75 4.5V3C4.75 2.17157 5.42157 1.5 6.25 1.5H7.75C8.57843 1.5 9.25 2.17157 9.25 3V4.5"
                  stroke="#686868"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
}
