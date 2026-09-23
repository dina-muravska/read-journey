"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { RecommendedBook } from "@/types/book";
import styles from "./BookCard.module.css";

type Props = {
  book: RecommendedBook;
  variant?: "default" | "compact";
};

export default function BookCard({ book, variant = "default" }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleOpen = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("bookId", book._id);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const isCompact = variant === "compact";

  const cardClass = `${styles.card} ${
    isCompact ? styles.cardCompact : styles.cardDefault
  }`;
  const imageContainerClass = `${styles.imageContainer} ${
    isCompact ? styles.imageContainerCompact : styles.imageContainerDefault
  }`;
  const titleClass = `${styles.title} ${
    isCompact ? styles.titleCompact : styles.titleDefault
  }`;
  const authorClass = `${styles.author} ${
    isCompact ? styles.authorCompact : styles.authorDefault
  }`;

  return (
    <div className={cardClass} onClick={handleOpen}>
      <div className={imageContainerClass}>
        <Image
          src={book.imageUrl}
          alt={book.title}
          fill
          sizes={isCompact ? "71px" : "137px"}
          className={styles.image}
        />
      </div>
      <p className={titleClass}>{book.title}</p>
      <p className={authorClass}>{book.author}</p>
    </div>
  );
}
