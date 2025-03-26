
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  LayoutDashboard,
  LineChart,
  LogOut,
  Package,
  Settings,
  Users,
  ShieldCheck,
  Menu,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

const SidebarLink: React.FC<SidebarLinkProps> = ({
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

interface SidebarProps {
  open?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ open = true }) => {
  const location = useLocation();
  const { user, profile, signOut, isAdmin } = useAuth();
  const isMobile = useMobile();
  const collapsed = !open && !isMobile;

  const handleSignOut = () => {
    signOut();
  };

  const initials = profile
    ? `${profile.first_name?.[0] || ""}${profile.last_name?.[0] || ""}`
    : user?.email?.[0]?.toUpperCase() || "U";

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isMobile && open && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
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
        {/* Sidebar header with logo/title */}
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

        {/* Sidebar content with navigation */}
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid gap-1 px-2">
            <SidebarLink
              to="/dashboard"
              icon={<LayoutDashboard className="h-5 w-5" />}
              label="Dashboard"
              active={location.pathname === "/dashboard"}
              collapsed={collapsed}
            />
            <SidebarLink
              to="/inventory"
              icon={<Package className="h-5 w-5" />}
              label="Inventory"
              active={location.pathname === "/inventory"}
              collapsed={collapsed}
            />
            <SidebarLink
              to="/customers"
              icon={<Users className="h-5 w-5" />}
              label="Customers"
              active={location.pathname === "/customers"}
              collapsed={collapsed}
            />
            <SidebarLink
              to="/projects"
              icon={<ClipboardList className="h-5 w-5" />}
              label="Work Orders"
              active={location.pathname === "/projects"}
              collapsed={collapsed}
            />
            <SidebarLink
              to="/scheduling"
              icon={<CalendarClock className="h-5 w-5" />}
              label="Scheduling"
              active={location.pathname === "/scheduling"}
              collapsed={collapsed}
            />
            <SidebarLink
              to="/finance"
              icon={<CircleDollarSign className="h-5 w-5" />}
              label="Finance"
              active={location.pathname === "/finance"}
              collapsed={collapsed}
              adminOnly={true}
              isAdmin={isAdmin}
            />
            <SidebarLink
              to="/analytics"
              icon={<LineChart className="h-5 w-5" />}
              label="Analytics"
              active={location.pathname === "/analytics"}
              collapsed={collapsed}
              adminOnly={true}
              isAdmin={isAdmin}
            />
            <SidebarLink
              to="/quality-control"
              icon={<ShieldCheck className="h-5 w-5" />}
              label="Quality Control"
              active={location.pathname === "/quality-control"}
              collapsed={collapsed}
            />
            <SidebarLink
              to="/team"
              icon={<Users className="h-5 w-5" />}
              label="Team"
              active={location.pathname === "/team"}
              collapsed={collapsed}
              adminOnly={true}
              isAdmin={isAdmin}
            />
          </nav>
        </div>

        {/* Sidebar footer with user menu */}
        <div
          className={cn(
            "mt-auto flex border-t p-4",
            collapsed ? "flex-col items-center" : "justify-between"
          )}
        >
          {!collapsed ? (
            <>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={profile?.avatar_url || undefined}
                    alt={profile?.first_name || user?.email || "User"}
                  />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {profile?.first_name
                      ? `${profile.first_name} ${profile.last_name || ""}`
                      : user?.email}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {profile?.role || "User"}
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5" />
                    <span className="sr-only">Settings</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <div className="mb-2 flex justify-center">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={profile?.avatar_url || undefined}
                    alt={profile?.first_name || user?.email || "User"}
                  />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      asChild
                    >
                      <Link to="/settings">
                        <Settings className="h-5 w-5" />
                        <span className="sr-only">Settings</span>
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Settings</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-5 w-5" />
                      <span className="sr-only">Log out</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Log out</TooltipContent>
                </Tooltip>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
};
