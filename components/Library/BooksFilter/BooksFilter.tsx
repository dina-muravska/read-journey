"use client";

import { BookDetailsResponse } from "@/types/book";
import styles from "./BooksFilter.module.css";

type Status = BookDetailsResponse["status"];

type FilterOption = {
  value: "all" | Status;
  label: string;
};

const FILTER_OPTIONS: FilterOption[] = [
  { value: "all", label: "All books" },
  { value: "unread", label: "Unread" },
  { value: "in-progress", label: "In progress" },
  { value: "done", label: "Done" },
];

type Props = {
  value: "all" | Status;
  onChange: (value: "all" | Status) => void;
};

export default function BooksFilter({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as "all" | Status)}
      className={styles.select}
    >
      {FILTER_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value} className={styles.option}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
