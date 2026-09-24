import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { api } from "../../../app/api/api";

interface StartReadingParams {
  bookId: string;
  page: number;
}

interface FinishReadingParams {
  bookId: string;
  page: number;
}

interface DeleteReadingParams {
  progressId: string;
  bookId: string;
}

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

export function useStartReading() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookId, page }: StartReadingParams) => {
      const { data } = await api.post("/books/reading/start", { bookId, page });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["library", "book", variables.bookId],
      });
      queryClient.invalidateQueries({ queryKey: ["library", "books"] });
      toast.success("Reading session started!");
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to start reading";
      toast.error(message);
    },
  });
}

export function useFinishReading() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookId, page }: FinishReadingParams) => {
      const { data } = await api.post("/books/reading/finish", {
        bookId,
        page,
      });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["library", "book", variables.bookId],
      });
      queryClient.invalidateQueries({ queryKey: ["library", "books"] });
      toast.success("Reading session finished!");
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to finish reading";
      toast.error(message);
    },
  });
}

export function useDeleteReadingSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ progressId, bookId }: DeleteReadingParams) => {
      const { data } = await api.delete("/books/reading", {
        params: { readingId: progressId, bookId },
      });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["library", "book", variables.bookId],
      });
      queryClient.invalidateQueries({ queryKey: ["library", "books"] });
      toast.success("Reading session deleted");
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to delete reading session";
      toast.error(message);
    },
  });
}
