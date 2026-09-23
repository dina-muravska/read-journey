"use client";

import { useState, useCallback } from "react";
import { useAddBookAsObjectToLibraryOptimistic } from "@/lib/api/mutations/library";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { ObjectSchema } from "yup";
import RecommendedSection from "../RecommendedSection/RecommendedSection";
import SuccessModal from "../../Modals/SuccessModal/SuccessModal";
import styles from "./LibraryDashboard.module.css";

type AddBookFormValues = {
  title: string;
  author: string;
  totalPages: string;
};

const addBookSchema: ObjectSchema<AddBookFormValues> = yup.object({
  title: yup.string().default("").trim().min(1, "Book title is required"),
  author: yup.string().default("").trim().min(1, "Author is required"),
  totalPages: yup
    .string()
    .default("")
    .trim()
    .matches(/^\d+$/, "Must be a valid number")
    .min(1, "Number of pages is required"),
});

export default function LibraryDashboard() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddBookFormValues>({
    resolver: yupResolver(addBookSchema),
    defaultValues: { title: "", author: "", totalPages: "" },
  });

  const { mutateAsync: addBook, isPending } =
    useAddBookAsObjectToLibraryOptimistic();

  const [successModal, setSuccessModal] = useState({
    isOpen: false,
    title: "",
  });

  const closeSuccessModal = useCallback(() => {
    setSuccessModal({ isOpen: false, title: "" });
  }, []);

  const onSubmit = async (data: AddBookFormValues) => {
    try {
      const parsedPages = parseInt(data.totalPages, 10);

      await addBook({
        title: data.title.trim(),
        author: data.author.trim(),
        totalPages: Number.isNaN(parsedPages) ? 0 : parsedPages,
      });

      const bookTitle = data.title.trim();
      reset();

      setSuccessModal({ isOpen: true, title: bookTitle });
    } catch {}
  };

  const isBtnDisabled = isSubmitting || isPending;

  return (
    <div className={styles.container}>
      <div className={styles.gridWrapper}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <p className={styles.formTitle}>Create your library:</p>

          <div>
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Book title"
                disabled={isBtnDisabled}
                className={`${styles.input} ${styles.inputTitle} ${
                  errors.title ? styles.inputError : ""
                }`}
                {...register("title")}
              />
              <span className={styles.label}>Book title</span>
            </div>
            {errors.title && (
              <p className={styles.errorMessage}>{errors.title.message}</p>
            )}
          </div>

          <div>
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Author"
                disabled={isBtnDisabled}
                className={`${styles.input} ${styles.inputAuthor} ${
                  errors.author ? styles.inputError : ""
                }`}
                {...register("author")}
              />
              <span className={styles.label}>The author</span>
            </div>
            {errors.author && (
              <p className={styles.errorMessage}>{errors.author.message}</p>
            )}
          </div>

          <div>
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Number of pages"
                disabled={isBtnDisabled}
                className={`${styles.input} ${styles.inputPages} ${
                  errors.totalPages ? styles.inputError : ""
                }`}
                {...register("totalPages")}
              />
              <span className={styles.label}>Number of pages</span>
            </div>
            {errors.totalPages && (
              <p className={styles.errorMessage}>{errors.totalPages.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isBtnDisabled}
            className={`${styles.submitBtn} ${
              isBtnDisabled ? styles.submitBtnDisabled : ""
            }`}
          >
            {isBtnDisabled ? "Adding book..." : "Add book"}
          </button>
        </form>

        <div className={styles.recommendedCard}>
          <h2 className={styles.recommendedTitle}>Recommended books</h2>

          <div className={styles.recommendedList}>
            <RecommendedSection />
          </div>

          <div className={styles.recommendedFooter}>
            <Link
              href="/recommended"
              aria-label="Go to home"
              className={styles.homeLink}
            >
              Home
            </Link>
            <Link
              href="/recommended"
              aria-label="Go to home"
              className={styles.iconLink}
            >
              <svg width="24" height="24">
                <use
                  href="/icons.svg#icon-log-in"
                  fill="#141414"
                  stroke="#F9F9F9"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={closeSuccessModal}
        title="Good job"
        description={
          <p>
            Your book is now in{" "}
            <span className={styles.descriptionHighlight}>the library!</span>{" "}
            The joy knows no bounds and now you can start your training
          </p>
        }
      />
    </div>
  );
}
