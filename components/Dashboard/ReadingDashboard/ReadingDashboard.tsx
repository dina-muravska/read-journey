"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useStartReading, useFinishReading } from "@/lib/api/mutations/reading";
import ReadingDiary from "../ReadingDiary/ReadingDiary";
import ReadingStatistics from "../ReadingStatistics/ReadingStatistics";
import styles from "./ReadingDashboard.module.css";

interface ProgressItem {
  id: string;
  startPage: number;
  finishPage?: number | null;
  startReading: string;
  finishReading?: string | null;
  status: "active" | "inactive";
}

interface BookData {
  id: string;
  title: string;
  author: string;
  totalPages: number;
  progress: ProgressItem[];
}

interface Props {
  book: BookData;
  onBookCompleted: () => void;
}

export default function ReadingDashboard({ book, onBookCompleted }: Props) {
  const [activeTab, setActiveTab] = useState<"diary" | "statistics">("diary");

  const activeSession = book.progress.find((p) => p.status === "active");
  const isReading = !!activeSession;

  const schema = yup.object({
    page: yup
      .number()
      .typeError("Please enter a number")
      .required("Required field")
      .positive("Must be greater than 0")
      .integer("Must be an integer")
      .max(book.totalPages, `Cannot exceed ${book.totalPages}`),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ page: number }>({
    resolver: yupResolver(schema),
  });

  const startMutation = useStartReading();
  const finishMutation = useFinishReading();

  const onSubmit = (data: { page: number }) => {
    if (isReading) {
      finishMutation.mutate(
        { bookId: book.id, page: data.page },
        {
          onSuccess: (res) => {
            reset();
            if (res?.isCompleted) {
              onBookCompleted();
            }
          },
        },
      );
    } else {
      startMutation.mutate(
        { bookId: book.id, page: data.page },
        {
          onSuccess: () => reset(),
        },
      );
    }
  };

  const completedPages = book.progress.reduce((acc, curr) => {
    if (curr.finishPage && curr.startPage) {
      return acc + (curr.finishPage - curr.startPage + 1);
    }
    return acc;
  }, 0);

  return (
    <div className={styles.dashboard}>
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>
          {isReading ? "Stop page" : "Start page"}
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <label className={styles.label}>Page number:</label>
          <input
            type="number"
            {...register("page")}
            placeholder="0"
            className={styles.input}
          />
          {errors.page && (
            <span className={styles.errorMessage}>{errors.page.message}</span>
          )}

          <button
            type="submit"
            disabled={startMutation.isPending || finishMutation.isPending}
            className={`${styles.submitBtn} ${
              isReading ? styles.stopBtn : styles.startBtn
            }`}
          >
            {isReading ? "To stop" : "To start"}
          </button>
        </form>
      </div>

      <div className={styles.tabsHeader}>
        <div className={styles.tabsGroup}>
          <button
            onClick={() => setActiveTab("diary")}
            className={`${styles.tabBtn} ${
              activeTab === "diary" ? styles.activeTabBtn : ""
            }`}
          >
            Diary
          </button>
          <button
            onClick={() => setActiveTab("statistics")}
            className={`${styles.tabBtn} ${
              activeTab === "statistics" ? styles.activeTabBtn : ""
            }`}
          >
            Statistics
          </button>
        </div>
      </div>

      {book.progress.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyStateTitle}>Progress timeline</p>
          <p className={styles.emptyStateSub}>
            Here you will see when and how many pages you read. To start, enter
            the page number.
          </p>
        </div>
      ) : activeTab === "diary" ? (
        <ReadingDiary
          bookId={book.id}
          totalPages={book.totalPages}
          progress={book.progress}
        />
      ) : (
        <ReadingStatistics
          totalPages={book.totalPages}
          completedPages={completedPages}
          progress={book.progress}
        />
      )}
    </div>
  );
}
