
import React from "react";

interface SidebarOverlayProps {
  open: boolean;
  isMobile: boolean;
}

export const SidebarOverlay: React.FC<SidebarOverlayProps> = ({ open, isMobile }) => {
  if (isMobile && open) {
    return (
      <div
        className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
        aria-hidden="true"
      />
    );
  }
  
  return null;
};
