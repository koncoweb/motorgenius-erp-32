
import React from "react";
import { useLocation } from "react-router-dom";
import { SidebarLink } from "./SidebarLink";
import {
  LayoutDashboard,
  Package,
  Users,
  ClipboardList,
  CalendarClock,
  CircleDollarSign,
  LineChart,
  ShieldCheck,
} from "lucide-react";

interface SidebarLinksProps {
  collapsed: boolean;
  isAdmin: boolean;
}

export const SidebarLinks: React.FC<SidebarLinksProps> = ({ collapsed, isAdmin }) => {
  const location = useLocation();
  
  return (
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
      />
      <SidebarLink
        to="/analytics"
        icon={<LineChart className="h-5 w-5" />}
        label="Analytics"
        active={location.pathname === "/analytics"}
        collapsed={collapsed}
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
  );
};
