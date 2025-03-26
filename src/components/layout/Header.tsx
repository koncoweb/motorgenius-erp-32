
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  Search,
  Maximize,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  toggleSidebar,
  isSidebarOpen,
}) => {
  return (
    <header className="flex items-center h-16 px-6 border-b bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="hover:bg-accent"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        
        <div className="hidden md:flex relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search..." 
            className="pl-8 w-[200px] lg:w-[300px] bg-background" 
          />
        </div>
      </div>
      
      <div className="flex items-center gap-3 ml-auto">
        <NotificationDropdown />
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon">
              <Maximize className="h-5 w-5" />
              <span className="sr-only">Fullscreen</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle Fullscreen</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
