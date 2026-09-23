"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { register, login, logout, getCurrentUser } from "../lib/api/clientApi";
import type { User } from "@/types/user";
import type { LoginRequest, RegisterRequest } from "@/types/auth";

const setAuthCookies = (token: string, refreshToken: string) => {
  document.cookie = `token=${encodeURIComponent(token)}; path=/; SameSite=Lax`;
  document.cookie = `refreshToken=${encodeURIComponent(refreshToken)}; path=/; SameSite=Lax`;
};

const clearAuthCookies = () => {
  document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
  document.cookie = "refreshToken=; path=/; max-age=0; SameSite=Lax";
};

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
          const data = await login(credentials);
          setAuthCookies(data.token, data.refreshToken);
          set({
            user: { email: data.email, name: data.name },
            isLoading: false,
            error: null,
          });
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "Login failed";
          set({ error: message, isLoading: false });
          throw err;
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const data = await register(userData);
          setAuthCookies(data.token, data.refreshToken);
          set({
            user: { email: data.email, name: data.name },
            isLoading: false,
            error: null,
          });
        } catch (err: unknown) {
          const message =
            err instanceof Error ? err.message : "Registration failed";
          set({ error: message, isLoading: false });
          throw err;
        }
      },

      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          await logout();
          clearAuthCookies();
          set({ user: null, isLoading: false, error: null });
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "Logout failed";
          set({ error: message, isLoading: false });
        }
      },

      checkAuth: async () => {
        if (get().isChecked) return;
        set({ isLoading: true });

        try {
          const data = await getCurrentUser();
          set({
            user: { email: data.email, name: data.name },
            isChecked: true,
            isLoading: false,
          });
        } catch {
          clearAuthCookies();
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
