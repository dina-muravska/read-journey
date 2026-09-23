import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addBookAsObjectToLibrary,
  addBookToLibrary,
  removeBookFromLibrary,
} from "../clientApi";
import { toast } from "sonner";
import { BookObject, BookDetailsResponse } from "@/types/book";

const isBookInLibrary = (
  libraryBooks: BookDetailsResponse[] | undefined,
  title: string,
  author: string,
): boolean => {
  if (!libraryBooks || !Array.isArray(libraryBooks)) {
    return false;
  }

  const normalizedTitle = title.trim().toLowerCase();
  const normalizedAuthor = author.trim().toLowerCase();

  return libraryBooks.some(
    (book) =>
      book.title.trim().toLowerCase() === normalizedTitle &&
      book.author.trim().toLowerCase() === normalizedAuthor,
  );
};

export const useAddBookToLibrary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bookId,
      title,
      author,
    }: {
      bookId: string;
      title: string;
      author: string;
    }) => {
      const cachedBooks = queryClient.getQueryData<BookDetailsResponse[]>([
        "library",
        "books",
      ]);

      if (isBookInLibrary(cachedBooks, title, author)) {
        throw new Error(
          `Book "${title}" by ${author} is already in your library`,
        );
      }

      return addBookToLibrary(bookId);
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["library", "books"],
      });

      await queryClient.refetchQueries({
        queryKey: ["books"],
      });

      toast.success("Book added to library! 📚");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add book");
    },
  });
};

export const useAddBookAsObjectToLibrary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (book: BookObject) => {
      const cachedBooks = queryClient.getQueryData<BookDetailsResponse[]>([
        "library",
        "books",
      ]);

      if (isBookInLibrary(cachedBooks, book.title, book.author)) {
        throw new Error(
          `Book "${book.title}" by ${book.author} is already in your library`,
        );
      }

      return addBookAsObjectToLibrary(book);
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["library", "books"],
      });

      await queryClient.refetchQueries({
        queryKey: ["books"],
      });

      toast.success("Book added to library! 📚");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add book");
    },
  });
};

export const useAddBookAsObjectToLibraryOptimistic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (book: BookObject) => {
      const cachedBooks = queryClient.getQueryData<BookDetailsResponse[]>([
        "library",
        "books",
      ]);

      if (isBookInLibrary(cachedBooks, book.title, book.author)) {
        throw new Error(
          `Book "${book.title}" by ${book.author} is already in your library`,
        );
      }

      return addBookAsObjectToLibrary(book);
    },

    onMutate: async (newBook) => {
      await queryClient.cancelQueries({
        queryKey: ["library", "books"],
      });

      const previousBooks = queryClient.getQueryData(["library", "books"]);

      const optimisticBook: BookDetailsResponse = {
        _id: `temp-${Date.now()}`,
        title: newBook.title,
        author: newBook.author,
        imageUrl: "",
        totalPages: newBook.totalPages,
        status: "unread" as const,
        owner: "me",
        progress: [],
      };

      queryClient.setQueryData(
        ["library", "books"],
        (old: BookDetailsResponse[] | undefined) =>
          Array.isArray(old) ? [optimisticBook, ...old] : [optimisticBook],
      );

      return { previousBooks };
    },

    onError: (error: Error, _, context) => {
      if (context?.previousBooks) {
        queryClient.setQueryData(["library", "books"], context.previousBooks);
      }

      toast.error(error.message || "Failed to add book");
    },

    onSuccess: async (serverBook) => {
      queryClient.setQueryData(
        ["library", "books"],
        (old: BookDetailsResponse[] | undefined) => {
          if (!Array.isArray(old)) return [serverBook];

          return old.map((book) =>
            book._id.startsWith("temp-") &&
            book.title === serverBook.title &&
            book.author === serverBook.author
              ? serverBook
              : book,
          );
        },
      );

      toast.success("Book added to library! 📚");
    },

    onSettled: async () => {
      await queryClient.refetchQueries({
        queryKey: ["library", "books"],
      });
    },
  });
};

export const useRemoveBookFromLibrary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookId: string) => removeBookFromLibrary(bookId),
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["library", "books"],
      });

      await queryClient.refetchQueries({
        queryKey: ["books"],
      });

      toast.success("Book removed from library");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to remove book");
    },
  });
};

export const useAddBookToLibraryOptimistic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bookId,
      title,
      author,
    }: {
      bookId: string;
      title: string;
      author: string;
    }) => {
      const cachedBooks = queryClient.getQueryData<BookDetailsResponse[]>([
        "library",
        "books",
      ]);

      if (isBookInLibrary(cachedBooks, title, author)) {
        throw new Error(
          `Book "${title}" by ${author} is already in your library`,
        );
      }

      return addBookToLibrary(bookId);
    },
    onMutate: async ({ title, author }) => {
      await queryClient.cancelQueries({
        queryKey: ["library", "books"],
      });

      const previousBooks = queryClient.getQueryData(["library", "books"]);

      const optimisticBook: BookDetailsResponse = {
        _id: `temp-${Date.now()}`,
        title,
        author,
        imageUrl: "",
        totalPages: 0,
        status: "unread" as const,
        owner: "me",
        progress: [],
      };

      queryClient.setQueryData(
        ["library", "books"],
        (old: BookDetailsResponse[] | undefined) =>
          Array.isArray(old) ? [optimisticBook, ...old] : [optimisticBook],
      );

      return { previousBooks };
    },
    onError: (err: Error, _, context) => {
      if (context?.previousBooks) {
        queryClient.setQueryData(["library", "books"], context.previousBooks);
      }
      toast.error(err.message || "Failed to add book");
    },
    onSuccess: async (serverBook) => {
      queryClient.setQueryData(
        ["library", "books"],
        (old: BookDetailsResponse[] | undefined) => {
          if (!Array.isArray(old)) return [serverBook];

          return old.map((book) =>
            book._id.startsWith("temp-") &&
            book.title === serverBook.title &&
            book.author === serverBook.author
              ? serverBook
              : book,
          );
        },
      );

      toast.success("Book added to library! 📚");
    },
    onSettled: async () => {
      await queryClient.refetchQueries({
        queryKey: ["library", "books"],
      });
    },
  });
};
