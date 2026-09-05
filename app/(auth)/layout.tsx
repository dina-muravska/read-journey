import { ReactNode } from "react";
import AuthLayout from "@/components/layout/AuthLayout";

export default function AuthRouteLayout({ children }: { children: ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}
