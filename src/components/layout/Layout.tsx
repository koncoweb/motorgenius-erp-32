
import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Toaster } from "@/components/ui/sonner";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  return (
    <div className="min-h-screen bg-background">
      <Sidebar open={sidebarOpen} />
      <div className={`flex flex-col ${sidebarOpen ? 'md:pl-64' : 'md:pl-16'} transition-all duration-300`}>
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} />
        <main className="flex-1 px-4 md:px-6 py-4 md:py-6">
          {children}
        </main>
        <Toaster />
      </div>
    </div>
  );
};
