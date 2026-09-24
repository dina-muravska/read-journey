"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { BookDetailsResponse } from "@/types/book";
import styles from "./MyBook.module.css";

type Props = {
  book: BookDetailsResponse;
};

export default function MyBook({ book }: Props) {
  const isReading = useMemo(() => {
    return book.progress?.some((p) => p.status === "active") || false;
  }, [book.progress]);

  const lastReadPage = useMemo(() => {
    if (!book.progress || book.progress.length === 0) {
      return null;
    }

    const activeSession = book.progress.find((p) => p.status === "active");

    if (activeSession) {
      return activeSession.startPage;
    }

    const completedSessions = book.progress
      .filter((p) => p.status === "inactive" && p.finishPage !== undefined)
      .sort((a, b) => {
        if (!a.finishReading || !b.finishReading) return 0;
        return (
          new Date(b.finishReading).getTime() -
          new Date(a.finishReading).getTime()
        );
      });

    if (completedSessions.length > 0) {
      return completedSessions[0].finishPage!;
    }

    const lastSession = book.progress[book.progress.length - 1];
    return lastSession.startPage;
  }, [book.progress]);

  const timeLeft = useMemo(() => {
    if (!book.progress || book.progress.length === 0) return "";

    let totalMs = 0;
    let totalPagesRead = 0;

    book.progress.forEach((session) => {
      if (session.startReading && session.finishReading) {
        const duration =
          new Date(session.finishReading).getTime() -
          new Date(session.startReading).getTime();
        const pagesInSession = session.finishPage! - session.startPage!;

        if (duration > 0 && pagesInSession > 0) {
          totalMs += duration;
          totalPagesRead += pagesInSession;
        }
      }
    });

    const lastSession = book.progress[book.progress.length - 1];
    const currentPage = lastSession?.finishPage || 0;
    const pagesLeft = book.totalPages - currentPage;

    if (pagesLeft <= 0) return "Finished";

    let predictedMinutesLeft = 0;

    if (totalPagesRead > 0) {
      const msPerPage = totalMs / totalPagesRead;
      predictedMinutesLeft = (pagesLeft * msPerPage) / (1000 * 60);
    } else {
      predictedMinutesLeft = pagesLeft * 3;
    }

    const hours = Math.floor(predictedMinutesLeft / 60);
    const minutes = Math.round(predictedMinutesLeft % 60);

    return `${hours} hours and ${minutes} minutes left`;
  }, [book]);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>My reading</h2>

        {timeLeft && <div className={styles.timeLeft}>{timeLeft}</div>}
      </div>

      <div className={styles.coverContainer}>
        {book.imageUrl ? (
          <Image
            src={book.imageUrl}
            alt={book.title}
            fill
            className={styles.coverImage}
            sizes="(min-width: 300px)"
          />
        ) : (
          <div className={styles.placeholder}>
            <picture className={styles.placeholderIcon}>
              <source
                srcSet="/img/book-opened.png 1x, /img/book-opened.png 2x"
                media="(min-width: 300px)"
              />
              <img
                src="/img/book-opened.png"
                alt="Book opened icon"
                className={styles.placeholderImg}
              />
            </picture>
          </div>
        )}
      </div>

      <h3 className={styles.bookTitle}>{book.title}</h3>
      <p className={styles.bookAuthor}>{book.author}</p>

      <div className={styles.statusIndicator}>
        <svg className={styles.statusSvg}>
          <use
            href={`/icons.svg#icon-${isReading ? "stop_record" : "record"}`}
            fill="#141414"
          />
        </svg>
      </div>

      {lastReadPage !== null && (
        <div className={styles.lastPage}>Last reading page {lastReadPage}</div>
      )}
    </div>
  );
}
