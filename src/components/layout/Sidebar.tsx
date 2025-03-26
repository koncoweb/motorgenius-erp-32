
import React from "react";
import { useAuth } from "@/context/auth";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarLinks } from "./sidebar/SidebarLinks";
import { SidebarUser } from "./sidebar/SidebarUser";
import { SidebarOverlay } from "./sidebar/SidebarOverlay";
import { SidebarHeader } from "./sidebar/SidebarHeader";

interface SidebarProps {
  open?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ open = true }) => {
  const { user, profile, signOut, isAdmin } = useAuth();
  const isMobile = useIsMobile();
  const collapsed = !open && !isMobile;

  const handleSignOut = () => {
    signOut();
  };

  return (
    <>
      <SidebarOverlay open={open} isMobile={isMobile} />

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full flex-col bg-sidebar border-r",
          open
            ? "w-64"
            : isMobile
            ? "w-0 -translate-x-full"
            : "w-16 items-center",
          "transition-all duration-300",
          isMobile ? "border-r-0 bg-background/95 backdrop-blur-sm" : ""
        )}
      >
        <SidebarHeader 
          open={open} 
          collapsed={collapsed} 
          isMobile={isMobile} 
        />

        <div className="flex-1 overflow-auto py-4">
          <SidebarLinks 
            collapsed={collapsed} 
            isAdmin={isAdmin} 
          />
        </div>

        <div
          className={cn(
            "mt-auto flex border-t p-4",
            collapsed ? "flex-col items-center" : "justify-between"
          )}
        >
          <SidebarUser
            collapsed={collapsed}
            profile={profile}
            user={user}
            handleSignOut={handleSignOut}
          />
        </div>
      </aside>
    </>
  );
};
