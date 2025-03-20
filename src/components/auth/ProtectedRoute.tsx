
import React, { ReactNode } from "react";
import { useAuth } from "@/context/auth";

type ProtectedRouteProps = {
  children: ReactNode;
  requiredRole?: "admin" | "employee";
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // We're bypassing authentication checks as requested
  return <>{children}</>;
}
