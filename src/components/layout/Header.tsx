
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  Search,
  Maximize,
  Bell
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

interface Notification {
  id: string;
  title: string;
  content: string;
  is_read: boolean;
  created_at: string;
  notification_type: string;
  link: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  toggleSidebar,
  isSidebarOpen,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    fetchNotifications();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('public:notifications')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'notifications' 
      }, (payload) => {
        fetchNotifications();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (error) throw error;
      
      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.is_read).length || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };
  
  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error("Failed to mark notification as read");
    }
  };
  
  const markAllAsRead = async () => {
    try {
      const ids = notifications.filter(n => !n.is_read).map(n => n.id);
      if (ids.length === 0) return;
      
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .in('id', ids);
        
      if (error) throw error;
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      );
      setUnreadCount(0);
      toast.success("All notifications marked as read");
      
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error("Failed to mark all notifications as read");
    }
  };

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
        <NotificationDropdown 
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
        />
        
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
