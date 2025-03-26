
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
  adminOnly?: boolean;
  isAdmin?: boolean;
}

export const SidebarLink: React.FC<SidebarLinkProps> = ({
  to,
  icon,
  label,
  active = false,
  collapsed = false,
  onClick,
  adminOnly = false,
  isAdmin = false,
}) => {
  if (adminOnly && !isAdmin) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          to={to}
          onClick={onClick}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
            active
              ? "bg-accent text-accent-foreground"
              : "hover:bg-accent/50 hover:text-accent-foreground",
            collapsed ? "justify-center" : ""
          )}
        >
          <div className={collapsed ? "w-full flex justify-center" : ""}>
            {icon}
          </div>
          {!collapsed && <span>{label}</span>}
        </Link>
      </TooltipTrigger>
      {collapsed && <TooltipContent side="right">{label}</TooltipContent>}
    </Tooltip>
  );
};
