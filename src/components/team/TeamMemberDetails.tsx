
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Mail, Phone } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  status: "available" | "busy" | "offsite" | "leave";
  avatar?: string;
}

interface TeamMemberDetailsProps {
  member: TeamMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEmail: (email: string) => void;
  onCall: (phone: string) => void;
  onViewSchedule: (name: string) => void;
}

export const TeamMemberDetails: React.FC<TeamMemberDetailsProps> = ({
  member,
  open,
  onOpenChange,
  onEmail,
  onCall,
  onViewSchedule,
}) => {
  if (!member) return null;

  const getStatusBadge = (status: TeamMember["status"]) => {
    switch (status) {
      case "available":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200">Available</Badge>;
      case "busy":
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-200">Busy</Badge>;
      case "offsite":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-200">Offsite</Badge>;
      case "leave":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-200">Leave</Badge>;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Team Member Details</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={member.avatar} alt={member.name} />
            <AvatarFallback className="text-lg">
              {member.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h2 className="text-xl font-bold">{member.name}</h2>
            <p className="text-muted-foreground">{member.role}</p>
            {getStatusBadge(member.status)}
          </div>
        </div>
        
        <div className="grid gap-4">
          <div className="flex flex-col space-y-1">
            <h3 className="font-medium text-sm text-muted-foreground">Department</h3>
            <p>{member.department}</p>
          </div>
          
          <div className="flex flex-col space-y-1">
            <h3 className="font-medium text-sm text-muted-foreground">Contact Information</h3>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <p>{member.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <p>{member.phone}</p>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => onViewSchedule(member.name)}
          >
            <Calendar className="h-4 w-4" />
            View Schedule
          </Button>
          <Button onClick={() => onEmail(member.email)}>
            Contact
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
