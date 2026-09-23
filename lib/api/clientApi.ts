import { isAxiosError } from "axios";
import { nextServer } from "./api";
import {
  LoginRequest,
  RegisterRequest,
  SignupResponse,
  MeResponse,
} from "@/types/auth";
import {
  FetchRecommendedParams,
  FetchRecommendedResponse,
  BookDetailsResponse,
  BookObject,
} from "@/types/book";

export const register = async (
  data: RegisterRequest,
): Promise<SignupResponse> => {
  try {
    const res = await nextServer.post<SignupResponse>("/users/signup", data);
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
    throw new Error("Registration failed");
  }
};

export const login = async (data: LoginRequest): Promise<SignupResponse> => {
  try {
    const res = await nextServer.post<SignupResponse>("/users/signin", data);
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
    throw new Error("Login failed");
  }
};

export const logout = async (): Promise<void> => {
  try {
    await nextServer.post("/users/signout");
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Logout failed");
    }
    throw new Error("Logout failed");
  }
};

export const getCurrentUser = async (): Promise<MeResponse> => {
  try {
    const { data } = await nextServer.get<MeResponse>("/users/current");
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Fetching current user failed",
      );
    }
    throw new Error("Fetching current user failed");
  }
};

export const refreshTokens = async (): Promise<SignupResponse> => {
  try {
    const { data } = await nextServer.get<SignupResponse>(
      "/users/current/refresh",
    );
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Refreshing token failed",
      );
    }
    throw new Error("Refreshing token failed");
  }
};

export const fetchRecommended = async (
  params: FetchRecommendedParams,
): Promise<FetchRecommendedResponse> => {
  try {
    const { data } = await nextServer.get<FetchRecommendedResponse>(
      "/books/recommend",
      { params },
    );
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Fetching recommended books failed",
      );
    }
    throw new Error("Fetching recommended books failed");
  }
};

export const addBookToLibrary = async (
  bookId: string,
): Promise<BookDetailsResponse> => {
  try {
    const { data } = await nextServer.post<BookDetailsResponse>(
      `/books/add/${bookId}`,
    );
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Adding book to library failed",
      );
    }
    throw new Error("Adding book to library failed");
  }
};

export const fetchLibraryBooks = async (
  status?: number,
): Promise<BookDetailsResponse[]> => {
  try {
    const { data } = await nextServer.get<BookDetailsResponse[]>("/books/own", {
      params: status !== undefined ? { status } : undefined,
    });
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Fetching library books failed",
      );
    }
    throw new Error("Fetching library books failed");
  }
};

export const fetchBookDetails = async (
  bookId: string,
): Promise<BookDetailsResponse> => {
  try {
    const { data } = await nextServer.get<BookDetailsResponse>(
      `/books/${bookId}`,
    );
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Fetching book details failed",
      );
    }
    throw new Error("Fetching book details failed");
  }
};

export const removeBookFromLibrary = async (bookId: string): Promise<void> => {
  try {
    await nextServer.delete(`/books/remove/${bookId}`);
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Removing book from library failed",
      );
    }
    throw new Error("Removing book from library failed");
  }
};

export const addBookAsObjectToLibrary = async (
  book: BookObject,
): Promise<BookDetailsResponse> => {
  try {
    const { data } = await nextServer.post<BookDetailsResponse>(
      "/books/add",
      book,
    );
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Adding custom book failed",
      );
    }
    throw new Error("Adding custom book failed");
  }
};

export const startReading = async (
  bookId: string,
  page: number,
): Promise<BookDetailsResponse> => {
  try {
    const { data } = await nextServer.post<BookDetailsResponse>(
      "/books/reading/start",
      { id: bookId, page },
    );
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Starting reading failed",
      );
    }
    throw new Error("Starting reading failed");
  }
};

export const finishReading = async (
  bookId: string,
  page: number,
): Promise<BookDetailsResponse> => {
  try {
    const { data } = await nextServer.post<BookDetailsResponse>(
      "/books/reading/finish",
      { id: bookId, page },
    );
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Finishing reading failed",
      );
    }
    throw new Error("Finishing reading failed");
  }
};

export const deleteReading = async (
  bookId: string,
  readingId: string,
): Promise<BookDetailsResponse> => {
  try {
    const { data } = await nextServer.delete<BookDetailsResponse>(
      "/books/reading",
      { params: { bookId, readingId } },
    );
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Deleting reading failed",
      );
    }
    throw new Error("Deleting reading failed");
  }
};
