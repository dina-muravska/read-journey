"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { BookDetailsResponse, RecommendedBook } from "@/types/book";
import styles from "./BookModal.module.css";

type ActionType = "start-reading" | "add-to-library";

type Props = {
  book: BookDetailsResponse | RecommendedBook;
  isOpen: boolean;
  onClose: () => void;
  actionType: ActionType;
  onAction: () => void;
  actionPending?: boolean;
};

export default function BookModal({
  book,
  isOpen,
  onClose,
  actionType,
  onAction,
  actionPending = false,
}: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = originalStyle;
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const preventScroll = (e: WheelEvent | TouchEvent) => {
      const target = e.target as Node;
      const backdrop = backdropRef.current;
      const modal = modalRef.current;

      if (backdrop && target === backdrop) {
        if (e.cancelable) e.preventDefault();
        return;
      }

      if (modal && modal.contains(target)) {
        const { scrollTop, scrollHeight, clientHeight } = modal;

        if (e instanceof WheelEvent) {
          const isScrollingDown = e.deltaY > 0;
          const isScrollingUp = e.deltaY < 0;

          if (
            (isScrollingDown && scrollTop + clientHeight >= scrollHeight) ||
            (isScrollingUp && scrollTop <= 0)
          ) {
            if (e.cancelable) e.preventDefault();
          }
        }
      }
    };

    const backdrop = backdropRef.current;
    if (backdrop) {
      backdrop.addEventListener("wheel", preventScroll, { passive: false });
      backdrop.addEventListener("touchmove", preventScroll, { passive: false });
    }

    return () => {
      if (backdrop) {
        backdrop.removeEventListener("wheel", preventScroll);
        backdrop.removeEventListener("touchmove", preventScroll);
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const buttonText = (() => {
    if (actionType === "start-reading") return "Start reading";
    if (actionType === "add-to-library")
      return actionPending ? "Adding..." : "Add to library";
    return "";
  })();

  return (
    <div ref={backdropRef} className={styles.backdrop} onClick={onClose}>
      <div
        ref={modalRef}
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className={styles.closeButton}
          aria-label="Close"
        >
          <X size={24} strokeWidth={2} />
        </button>

        <div className={styles.content}>
          <div className={styles.imageWrapper}>
            {book.imageUrl ? (
              <Image
                src={book.imageUrl}
                alt={book.title}
                fill
                sizes="(max-width: 768px) 140px, 153px"
                className="object-cover"
              />
            ) : (
              <div className={styles.imagePlaceholder}>
                <span>📖</span>
              </div>
            )}
          </div>

          <div className={styles.info}>
            <h2 className={styles.title}>{book.title}</h2>
            <p className={styles.author}>{book.author}</p>
            <p className={styles.pages}>{book.totalPages} pages</p>
          </div>

          <button
            onClick={onAction}
            disabled={actionPending}
            className={styles.actionButton}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
