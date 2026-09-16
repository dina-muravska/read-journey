"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import styles from "./Pagination.module.css";

type Props = {
  page: number;
  totalPages: number;
};

export default function Pagination({ page, totalPages }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));

    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className={styles.pagination}>
      <button
        disabled={page === 1 || isPending}
        onClick={() => changePage(page - 1)}
        className={styles.pageBtn}
        aria-label="Previous page"
      >
        &lt;
      </button>

      <button
        disabled={page >= totalPages || isPending}
        onClick={() => changePage(page + 1)}
        className={styles.pageBtn}
        aria-label="Next page"
      >
        &gt;
      </button>
    </div>
  );
}
