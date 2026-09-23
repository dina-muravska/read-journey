import { BookDetailsResponse } from "@/types/book";
import LibraryBookCard from "../LibraryBookCard/LibraryBookCard";
import styles from "./LibraryBooksList.module.css";

type Props = {
  books: BookDetailsResponse[];
  onDetails: (book: BookDetailsResponse) => void;
  onRemove: (bookId: string) => void;
};

export default function LibraryBooksList({
  books,
  onDetails,
  onRemove,
}: Props) {
  return (
    <ul className={styles.grid}>
      {books.map((book) => (
        <li key={book._id}>
          <LibraryBookCard
            book={book}
            onDetails={onDetails}
            onRemove={onRemove}
          />
        </li>
      ))}
    </ul>
  );
}
