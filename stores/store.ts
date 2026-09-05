"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";
import type { User } from "../types/user";
import type { LoginRequest, RegisterRequest } from "@/types/auth";

type AuthState = {
  user: User | null;
  isLoading: boolean;
  isChecked: boolean;
  error: string | null;

  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isChecked: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await axios.post("/api/users/signin", credentials);

          set({
            user: { email: data.email, name: data.name },
            isLoading: false,
            error: null,
          });
        } catch (err) {
          const message =
            axios.isAxiosError(err) && err.response?.data?.message
              ? err.response.data.message
              : "Login error";

          set({ error: message, isLoading: false });
          throw new Error(message);
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await axios.post("/api/users/signup", userData);

          set({
            user: { email: data.email, name: data.name },
            isLoading: false,
            error: null,
          });
        } catch (err) {
          const message =
            axios.isAxiosError(err) && err.response?.data?.message
              ? err.response.data.message
              : "Error during registration";

          set({ error: message, isLoading: false });
          throw new Error(message);
        }
      },

      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          await axios.post("/api/users/signout");
          set({ user: null, isLoading: false, error: null });
        } catch (err) {
          const message =
            axios.isAxiosError(err) && err.response?.data?.message
              ? err.response.data.message
              : "Error while logging out";

          set({ error: message, isLoading: false });
        }
      },

      checkAuth: async () => {
        if (get().isChecked) return;

        set({ isLoading: true });

        try {
          const { data } = await axios.get("/api/users/refresh", {
            withCredentials: true,
          });

          set({
            user: { email: data.email, name: data.name },
            isChecked: true,
            isLoading: false,
          });
        } catch {
          set({ user: null, isChecked: true, isLoading: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
