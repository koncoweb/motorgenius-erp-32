
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ShieldCheck, Menu } from "lucide-react";

interface SidebarHeaderProps {
  open: boolean;
  collapsed: boolean;
  isMobile: boolean;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  open,
  collapsed,
  isMobile,
}) => {
  return (
    <div
      className={cn(
        "flex h-16 items-center border-b px-4",
        collapsed ? "justify-center" : "justify-between"
      )}
    >
      {!collapsed ? (
        <>
          <Link to="/dashboard" className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">Mesindo APP</span>
          </Link>
          {!isMobile && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                // This will be handled by the Layout component
              }}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          )}
        </>
      ) : (
        <>
          <Link to="/dashboard">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </Link>
          {!isMobile && (
            <div className="absolute right-0 translate-x-1/2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border"
                onClick={() => {
                  // This will be handled by the Layout component
                }}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Toggle sidebar</span>
              </Button>
            </div>
          )}
        </>
      )}

      {isMobile && (
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      )}
    </div>
  );
};
