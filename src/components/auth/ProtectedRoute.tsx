
import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/auth";

type ProtectedRouteProps = {
  children: ReactNode;
  requiredRole?: "admin" | "employee";
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  
  // Temporarily bypass authentication checks due to Supabase authentication issues
  // TODO: Remove this bypass when Supabase authentication is fixed
  const bypassAuth = true;
  
  if (loading) {
    // Show loading state while checking authentication
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!user && !bypassAuth) {
    // Redirect to login if not authenticated and bypass is not enabled
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/auth/login" replace />;
  }
  
  // Allow access to the protected route
  return <>{children}</>;
}
