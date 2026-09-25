"use client";

import React, { useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useStartReading, useFinishReading } from "@/lib/api/mutations/reading";
import { BookDetailsResponse } from "@/types/book";
import ReadingDiary from "../ReadingDiary/ReadingDiary";
import ReadingStatistics from "../ReadingStatistics/ReadingStatistics";
import styles from "./ReadingDashboard.module.css";

interface Props {
  book: BookDetailsResponse;
  onBookCompleted: () => void;
  viewMode: "diary" | "statistics" | "emptyprogress";
  setViewMode: React.Dispatch<
    React.SetStateAction<"diary" | "statistics" | "emptyprogress">
  >;
}

interface FormValues {
  page: number;
}

export default function ReadingDashboard({
  book,
  onBookCompleted,
  viewMode,
  setViewMode,
}: Props) {
  const activeTab = viewMode === "emptyprogress" ? "diary" : viewMode;
  const activeSession = book.progress.find((p) => p.status === "active");
  const isReading = !!activeSession;
  const hasProgress = book.progress.length > 0;

  const schema = useMemo(() => {
    return yup.object({
      page: yup
        .number()
        .transform((value, originalValue) =>
          originalValue === "" || originalValue === null || isNaN(originalValue)
            ? undefined
            : value,
        )
        .typeError("Please enter a number")
        .required("Required field")
        .positive("Must be greater than 0")
        .integer("Must be an integer")
        .max(book.totalPages, `Cannot exceed ${book.totalPages}`)
        .test("min-page", function (value) {
          if (
            isReading &&
            activeSession?.startPage !== undefined &&
            value !== undefined
          ) {
            if (value < activeSession.startPage) {
              return this.createError({
                message: `Must be >= start page (${activeSession.startPage})`,
              });
            }
          }
          return true;
        }),
    });
  }, [isReading, activeSession, book.totalPages]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      page: undefined as unknown as number,
    },
  });

  const startMutation = useStartReading();
  const finishMutation = useFinishReading();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (isReading) {
      finishMutation.mutate(
        { bookId: book._id, page: data.page },
        {
          onSuccess: (res) => {
            reset({ page: "" as unknown as number });
            if (res?.isCompleted) {
              onBookCompleted();
            }
          },
        },
      );
    } else {
      startMutation.mutate(
        { bookId: book._id, page: data.page },
        {
          onSuccess: () => {
            reset({ page: "" as unknown as number });
          },
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
      <div
        className={`${styles.leftCard} ${!hasProgress ? styles.emptyCard : ""}`}
      >
        <div className={styles.formSection}>
          <h3 className={styles.cardTitle}>
            {isReading ? "Stop page:" : "Start page:"}
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Page number:</label>

              <input
                type="number"
                {...register("page", { valueAsNumber: true })}
                placeholder="0"
                className={styles.input}
              />
            </div>
            {errors.page && (
              <span className={styles.errorMessage}>{errors.page.message}</span>
            )}

            <button
              type="submit"
              disabled={startMutation.isPending || finishMutation.isPending}
              className={styles.actionBtn}
            >
              {isReading ? "To stop" : "To start"}
            </button>
          </form>
        </div>

        {!hasProgress ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateText}>
              <p className={styles.emptyStateTitle}>Progress</p>
              <p className={styles.emptyStateSub}>
                Here you will see when and how much you read. To record, click
                on the red button above.
              </p>
            </div>
            <div className={styles.starCircle}>
              <span>⭐</span>
            </div>
          </div>
        ) : (
          <div className={styles.rightCardContent}>
            <div className={styles.header}>
              <h3 className={styles.headerTitle}>
                {activeTab === "diary" ? "Diary" : "Statistics"}
              </h3>
              <div className={styles.iconsGroup}>
                <button
                  type="button"
                  onClick={() => setViewMode("diary")}
                  className={`${styles.iconBtn} ${
                    activeTab === "diary" ? styles.activeIconBtn : ""
                  }`}
                  title="Diary"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("statistics")}
                  className={`${styles.iconBtn} ${
                    activeTab === "statistics" ? styles.activeIconBtn : ""
                  }`}
                  title="Statistics"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                    <path d="M22 12A10 10 0 0 0 12 2v10z" />
                  </svg>
                </button>
              </div>
            </div>

            {activeTab === "diary" ? (
              <ReadingDiary
                bookId={book._id}
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
        )}
      </div>
    </div>
  );
}
