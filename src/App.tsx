
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Customers from "./pages/Customers";
import Inventory from "./pages/Inventory";
import Team from "./pages/Team";
import Scheduling from "./pages/Scheduling";
import Finance from "./pages/Finance";
import QualityControl from "./pages/QualityControl";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import { AuthProvider } from "./context/auth";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import React from "react";

// Create a new QueryClient instance
const queryClient = new QueryClient();

// Define App component as a regular function component
function App() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <TooltipProvider>
              <Routes>
                {/* Auth Routes - redirecting to dashboard */}
                <Route path="/auth/login" element={<Navigate to="/dashboard" />} />
                <Route path="/auth/register" element={<Navigate to="/dashboard" />} />
                <Route path="/auth/forgot-password" element={<Navigate to="/dashboard" />} />
                <Route path="/auth/reset-password" element={<Navigate to="/dashboard" />} />
                
                {/* All pages now accessible without authentication */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/team" element={<Team />} />
                
                {/* Additional routes */}
                <Route path="/scheduling" element={<Scheduling />} />
                <Route path="/finance" element={<Finance />} />
                <Route path="/quality" element={<QualityControl />} />
                <Route path="/analytics" element={<Analytics />} />
                
                {/* Redirect root to dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" />} />
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;
