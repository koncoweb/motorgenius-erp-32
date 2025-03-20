
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
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import { AuthProvider } from "./context/auth";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
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
            
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
