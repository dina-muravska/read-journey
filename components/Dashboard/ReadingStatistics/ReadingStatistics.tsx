"use client";

import React from "react";
import { BookProgress } from "@/types/book";
import styles from "./ReadingStatistics.module.css";

interface Props {
  totalPages: number;
  completedPages: number;
  progress: BookProgress[];
}

export default function ReadingStatistics({
  totalPages,
  completedPages,
}: Props) {
  const percentage = Math.min(
    100,
    Math.round((completedPages / totalPages) * 100),
  );

  return (
    <div className={styles.container}>
      <div className={styles.chartWrapper}>
        <svg className={styles.svg} viewBox="0 0 36 36">
          <path
            className={styles.bgCircle}
            strokeWidth="3.8"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className={styles.progressCircle}
            strokeDasharray={`${percentage}, 100`}
            strokeWidth="3.8"
            strokeLinecap="round"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className={styles.percentage}>{percentage}%</div>
      </div>

      <div className={styles.info}>
        <p className={styles.label}>Pages read</p>
        <p className={styles.value}>
          {completedPages} / {totalPages}
        </p>
      </div>
    </div>
  );
}
