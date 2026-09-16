"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import WorkoutStep from "@/components/Dashboard/WorkoutStep";
import styles from "./Dashboard.module.css";

type FilterFormValues = {
  title: string;
  author: string;
};

const filterSchema = yup.object({
  title: yup.string().default("").trim(),
  author: yup.string().default("").trim(),
});

export default function RecommendedDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FilterFormValues>({
    resolver: yupResolver(filterSchema),
    defaultValues: {
      title: searchParams.get("title") || "",
      author: searchParams.get("author") || "",
    },
  });

  const onSubmit = (data: FilterFormValues) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    if (data.title.trim()) {
      params.set("title", data.title.trim());
    } else {
      params.delete("title");
    }

    if (data.author.trim()) {
      params.set("author", data.author.trim());
    } else {
      params.delete("author");
    }

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const isFormDisabled = isPending || isSubmitting;

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.filterGroup}>
        <p className={styles.filterLabel}>Filters:</p>

        <div>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              disabled={isFormDisabled}
              className={`${styles.input} ${errors.title ? styles.inputError : ""}`}
              {...register("title")}
            />
            <span className={styles.fieldLabel}>Book title:</span>
          </div>
          {errors.title?.message && (
            <p className={styles.errorText}>{errors.title.message}</p>
          )}
        </div>

        <div>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              disabled={isFormDisabled}
              className={`${styles.input} ${styles.inputAuthor} ${errors.author ? styles.inputError : ""}`}
              {...register("author")}
            />
            <span className={styles.fieldLabel}>The author:</span>
          </div>
          {errors.author?.message && (
            <p className={styles.errorText}>{errors.author.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isFormDisabled}
          className={styles.submitBtn}
        >
          {isFormDisabled ? "Applying..." : "To apply"}
        </button>
      </form>

      <div className={styles.workoutCard}>
        <h2 className={styles.workoutTitle}>Start your workout</h2>
        <div className={styles.workoutSteps}>
          <WorkoutStep
            number={1}
            title="Create a personal library:"
            description="add the books you intend to read to it."
          />
          <WorkoutStep
            number={2}
            title="Create your first workout:"
            description="define a goal, choose a period, start training."
          />
        </div>
        <div className={styles.workoutFooter}>
          <Link href="/library" className={styles.workoutLink}>
            My library
          </Link>
          <Link href="/library" aria-label="Go to my library">
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

      <div className={styles.quoteCard}>
        <img
          src="/img/books@1x.webp"
          alt="Books quote"
          width="40"
          height="40"
        />
        <p className={styles.quoteText}>
          "Books are <span className={styles.quoteHighlight}>windows</span> to
          the world, and reading is a journey into the unknown."
        </p>
      </div>
    </div>
  );
}
