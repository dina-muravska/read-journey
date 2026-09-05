"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/store";
import { usePathname, useRouter } from "next/navigation";

const publicRoutes = ["/login", "/register", "/"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { checkAuth, user, isLoading, isChecked } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isChecked) {
      checkAuth();
    }
  }, [isChecked, checkAuth]);

  useEffect(() => {
    if (!isChecked || isLoading) return;

    const isPublic = publicRoutes.some((r) => pathname.startsWith(r));

    if (!user && !isPublic) {
      router.replace("/login");
    }

    if (user && isPublic && pathname !== "/") {
    }
  }, [user, isChecked, isLoading, pathname, router]);

  if (!isChecked || isLoading) return null;

  return <>{children}</>;
}
