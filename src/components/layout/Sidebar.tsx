
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar as SidebarContainer,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Package, 
  UserCog,
  Clock,
  DollarSign,
  ClipboardCheck,
  BarChart4
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  
  const mainNavItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/projects", label: "Work Orders", icon: Briefcase },
    { path: "/customers", label: "Customers", icon: Users },
    { path: "/inventory", label: "Inventory", icon: Package },
    { path: "/team", label: "Team", icon: UserCog },
  ];
  
  const secondaryNavItems = [
    { path: "/scheduling", label: "Scheduling", icon: Clock },
    { path: "/finance", label: "Finance", icon: DollarSign },
    { path: "/quality", label: "Quality Control", icon: ClipboardCheck },
    { path: "/analytics", label: "Analytics", icon: BarChart4 },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <SidebarContainer className={`transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="flex items-center justify-center h-16 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2">
          {isOpen ? (
            <h1 className="text-xl font-bold tracking-tight text-primary">MotorGenius</h1>
          ) : (
            <span className="text-xl font-bold text-primary">MG</span>
          )}
        </Link>
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={isOpen ? "opacity-100" : "opacity-0 h-0 overflow-hidden"}>
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                      isActive(item.path)
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }`}
                  >
                    <Link to={item.path} className="flex items-center gap-3">
                      <item.icon size={20} />
                      {isOpen && <span>{item.label}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel className={isOpen ? "opacity-100 mt-6" : "opacity-0 h-0 overflow-hidden"}>
            Additional
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNavItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                      isActive(item.path)
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }`}
                  >
                    <Link to={item.path} className="flex items-center gap-3">
                      <item.icon size={20} />
                      {isOpen && <span>{item.label}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarContainer>
  );
};
