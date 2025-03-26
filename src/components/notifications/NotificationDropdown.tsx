
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Bell, CheckCircle, Clock, DollarSign, Package, ClipboardCheck } from "lucide-react";
import { 
  Notification,
  fetchNotifications,
  getUnreadNotificationsCount,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from "@/services/notificationService";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const loadNotifications = async () => {
    setIsLoading(true);
    const data = await fetchNotifications();
    setNotifications(data);
    const count = await getUnreadNotificationsCount();
    setUnreadCount(count);
    setIsLoading(false);
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  // Reload notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read
    await markNotificationAsRead(notification.id);
    
    // Navigate to the linked page if there is one
    if (notification.link) {
      navigate(notification.link);
    }
    
    // Refresh notification list
    loadNotifications();
    
    // Close dropdown
    setIsOpen(false);
  };

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsRead();
    toast({
      title: "All notifications marked as read",
      description: "Your notifications have been cleared",
    });
    loadNotifications();
  };

  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'inventory':
        return <Package className="h-4 w-4 mr-2 text-blue-500" />;
      case 'quality':
        return <ClipboardCheck className="h-4 w-4 mr-2 text-green-500" />;
      case 'finance':
        return <DollarSign className="h-4 w-4 mr-2 text-purple-500" />;
      case 'scheduling':
        return <Clock className="h-4 w-4 mr-2 text-amber-500" />;
      default:
        return <Bell className="h-4 w-4 mr-2 text-gray-500" />;
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications {unreadCount > 0 && `(${unreadCount})`}</span>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs flex items-center" 
              onClick={handleMarkAllAsRead}
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="max-h-80 overflow-y-auto">
          <DropdownMenuGroup>
            {isLoading ? (
              <div className="p-4 text-center text-muted-foreground">Loading notifications...</div>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => (
                <DropdownMenuItem 
                  key={notification.id} 
                  onClick={() => handleNotificationClick(notification)}
                  className={`cursor-pointer ${!notification.is_read ? 'bg-muted/50 font-medium' : ''}`}
                >
                  <div className="flex items-start">
                    {getNotificationIcon(notification.notification_type)}
                    <div>
                      <div className="font-medium">{notification.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">{notification.content}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(notification.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">No notifications</div>
            )}
          </DropdownMenuGroup>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
