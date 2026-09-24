import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addBookAsObjectToLibrary,
  addBookToLibrary,
  removeBookFromLibrary,
} from "../clientApi";
import { toast } from "sonner";
import { BookObject, BookDetailsResponse } from "@/types/book";

const LIBRARY_QUERY_KEY = ["library", "books"];

interface ApiResponseWrapper {
  data: BookDetailsResponse;
}

function extractBookResponse(
  response: BookDetailsResponse | ApiResponseWrapper,
): BookDetailsResponse {
  if (
    typeof response === "object" &&
    response !== null &&
    "data" in response &&
    typeof response.data === "object" &&
    response.data !== null
  ) {
    return response.data;
  }
  return response as BookDetailsResponse;
}

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
      book.title?.trim().toLowerCase() === normalizedTitle &&
      book.author?.trim().toLowerCase() === normalizedAuthor,
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
      const cachedBooks =
        queryClient.getQueryData<BookDetailsResponse[]>(LIBRARY_QUERY_KEY);

      if (isBookInLibrary(cachedBooks, title, author)) {
        throw new Error(
          `Book "${title}" by ${author} is already in your library`,
        );
      }

      return addBookToLibrary(bookId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEY });
      await queryClient.invalidateQueries({ queryKey: ["books"] });
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
      const cachedBooks =
        queryClient.getQueryData<BookDetailsResponse[]>(LIBRARY_QUERY_KEY);

      if (isBookInLibrary(cachedBooks, book.title, book.author)) {
        throw new Error(
          `Book "${book.title}" by ${book.author} is already in your library`,
        );
      }

      return addBookAsObjectToLibrary(book);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEY });
      await queryClient.invalidateQueries({ queryKey: ["books"] });
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
      const cachedBooks =
        queryClient.getQueryData<BookDetailsResponse[]>(LIBRARY_QUERY_KEY);

      if (isBookInLibrary(cachedBooks, book.title, book.author)) {
        throw new Error(
          `Book "${book.title}" by ${book.author} is already in your library`,
        );
      }

      return addBookAsObjectToLibrary(book);
    },

    onMutate: async (newBook) => {
      await queryClient.cancelQueries({ queryKey: LIBRARY_QUERY_KEY });

      const previousBooks =
        queryClient.getQueryData<BookDetailsResponse[]>(LIBRARY_QUERY_KEY);

      const optimisticBook: BookDetailsResponse = {
        _id: `temp-${Date.now()}`,
        title: newBook.title.trim(),
        author: newBook.author.trim(),
        imageUrl: "",
        totalPages: newBook.totalPages,
        status: "unread",
        owner: "me",
        progress: [],
      };

      queryClient.setQueryData(
        LIBRARY_QUERY_KEY,
        (old: BookDetailsResponse[] | undefined) =>
          Array.isArray(old) ? [optimisticBook, ...old] : [optimisticBook],
      );

      return { previousBooks };
    },

    onError: (error: Error, _, context) => {
      if (context?.previousBooks) {
        queryClient.setQueryData(LIBRARY_QUERY_KEY, context.previousBooks);
      }
      toast.error(error.message || "Failed to add book");
    },

    onSuccess: (serverData, newBook) => {
      const addedBook = extractBookResponse(serverData);

      queryClient.setQueryData(
        LIBRARY_QUERY_KEY,
        (old: BookDetailsResponse[] | undefined) => {
          if (!Array.isArray(old)) return [addedBook];

          const updated = old.map((book) => {
            if (
              book._id.startsWith("temp-") &&
              book.title.trim().toLowerCase() ===
                newBook.title.trim().toLowerCase()
            ) {
              return { ...book, ...addedBook };
            }
            return book;
          });

          return updated;
        },
      );

      toast.success("Book added to library! 📚");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
};

export const useRemoveBookFromLibrary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookId: string) => removeBookFromLibrary(bookId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEY });
      await queryClient.invalidateQueries({ queryKey: ["books"] });
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
      const cachedBooks =
        queryClient.getQueryData<BookDetailsResponse[]>(LIBRARY_QUERY_KEY);

      if (isBookInLibrary(cachedBooks, title, author)) {
        throw new Error(
          `Book "${title}" by ${author} is already in your library`,
        );
      }

      return addBookToLibrary(bookId);
    },
    onMutate: async ({ title, author }) => {
      await queryClient.cancelQueries({ queryKey: LIBRARY_QUERY_KEY });

      const previousBooks =
        queryClient.getQueryData<BookDetailsResponse[]>(LIBRARY_QUERY_KEY);

      const optimisticBook: BookDetailsResponse = {
        _id: `temp-${Date.now()}`,
        title: title.trim(),
        author: author.trim(),
        imageUrl: "",
        totalPages: 0,
        status: "unread",
        owner: "me",
        progress: [],
      };

      queryClient.setQueryData(
        LIBRARY_QUERY_KEY,
        (old: BookDetailsResponse[] | undefined) =>
          Array.isArray(old) ? [optimisticBook, ...old] : [optimisticBook],
      );

      return { previousBooks };
    },
    onError: (err: Error, _, context) => {
      if (context?.previousBooks) {
        queryClient.setQueryData(LIBRARY_QUERY_KEY, context.previousBooks);
      }
      toast.error(err.message || "Failed to add book");
    },
    onSuccess: (serverData, variables) => {
      const addedBook = extractBookResponse(serverData);

      queryClient.setQueryData(
        LIBRARY_QUERY_KEY,
        (old: BookDetailsResponse[] | undefined) => {
          if (!Array.isArray(old)) return [addedBook];

          return old.map((book) =>
            book._id.startsWith("temp-") &&
            book.title.trim().toLowerCase() ===
              variables.title.trim().toLowerCase()
              ? { ...book, ...addedBook }
              : book,
          );
        },
      );

      toast.success("Book added to library! 📚");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
};
