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

export const fetchRecommendedServer = async (
  params: FetchRecommendedParams,
): Promise<FetchRecommendedResponse> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.title) query.set("title", params.title);
  if (params.author) query.set("author", params.author);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "https://readjourney-backend.onrender.com/api"}/books/recommend?${query.toString()}`,
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch recommended books on server");
  }

  return res.json();
};
