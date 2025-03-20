import React, { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth";

type ProtectedRouteProps = {
  children: ReactNode;
  requiredRole?: "admin" | "employee";
};

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, profile, loading, isAdmin } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      console.log("User not authenticated, redirecting to login");
    }
    if (!loading && user) {
      console.log("User authenticated:", user.id, "Profile:", profile?.role);
    }
  }, [user, loading, profile]);

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
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // If we have a user but profile is still null (can happen during race conditions)
  if (requiredRole && !profile) {
    console.log("Profile not loaded yet, showing loading");
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Check role-based access if required
  if (requiredRole) {
    // For admin routes
    if (requiredRole === "admin" && !isAdmin) {
      console.log("Not admin, redirecting to dashboard");
      return <Navigate to="/dashboard" replace />;
    }
    
    // For employee routes - both admin and employees can access
    if (requiredRole === "employee" && !profile) {
      console.log("Not employee, redirecting to dashboard");
      return <Navigate to="/dashboard" replace />;
    }
  }

  // User is authenticated and has required role, render children
  return <>{children}</>;
}
