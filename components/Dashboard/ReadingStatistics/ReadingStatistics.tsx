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
  const rawPercentage = (completedPages / totalPages) * 100;
  const percentage = Math.min(100, Math.round(rawPercentage));
  const exactPercentage = Math.min(100, rawPercentage).toFixed(2);

  // Окружність для SVG (r = 40 => C ≈ 251.32)
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={styles.container}>
      <div className={styles.chartWrapper}>
        <svg className={styles.svg} viewBox="0 0 100 100">
          <circle
            className={styles.bgCircle}
            cx="50"
            cy="50"
            r={radius}
            strokeWidth="10"
            fill="none"
          />
          <circle
            className={styles.progressCircle}
            cx="50"
            cy="50"
            r={radius}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        <div className={styles.percentage}>{percentage}%</div>
      </div>

      <div className={styles.info}>
        <div className={styles.statsBadge}>
          <span className={styles.greenDot} />
          <span className={styles.badgeText}>{exactPercentage}%</span>
        </div>
        <p className={styles.pagesRead}>{completedPages} pages read</p>
      </div>
    </div>
  );
}
