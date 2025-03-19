
import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

type ProtectedRouteProps = {
  children: ReactNode;
  requiredRole?: "admin" | "employee";
};

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, profile, loading, isAdmin } = useAuth();
  const location = useLocation();

  // If still loading auth state, show loading indicator
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check role-based access if required
  if (requiredRole) {
    // For admin routes
    if (requiredRole === "admin" && !isAdmin) {
      return <Navigate to="/" replace />;
    }
    
    // For employee routes - both admin and employees can access
    if (requiredRole === "employee" && !profile) {
      return <Navigate to="/" replace />;
    }
  }

  // User is authenticated and has required role, render children
  return <>{children}</>;
}
