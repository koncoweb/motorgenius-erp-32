
import React from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Plus, Calendar, Mail, Phone, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

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

interface Assignment {
  id: string;
  workOrderId: string;
  workOrderNumber: string;
  assigneeId: string;
  assigneeName: string;
  task: string;
  startTime: string;
  endTime: string;
  progress: number;
}

const mockTeamMembers = [
  {
    id: "1",
    name: "John Doe",
    role: "Senior Technician",
    department: "Motor Repair",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    status: "available" as const,
  },
  {
    id: "2",
    name: "Alice Smith",
    role: "Electrical Engineer",
    department: "QA & Testing",
    email: "alice.smith@example.com",
    phone: "+1 (555) 987-6543",
    status: "busy" as const,
  },
  {
    id: "3",
    name: "Bob Johnson",
    role: "Technician",
    department: "Generator Repair",
    email: "bob.johnson@example.com",
    phone: "+1 (555) 456-7890",
    status: "offsite" as const,
  },
  {
    id: "4",
    name: "Emma Wilson",
    role: "Lead Engineer",
    department: "Design & Development",
    email: "emma.wilson@example.com",
    phone: "+1 (555) 234-5678",
    status: "available" as const,
  },
  {
    id: "5",
    name: "Mike Thomas",
    role: "Junior Technician",
    department: "Motor Repair",
    email: "mike.thomas@example.com",
    phone: "+1 (555) 345-6789",
    status: "leave" as const,
  },
];

const mockAssignments = [
  {
    id: "1",
    workOrderId: "1",
    workOrderNumber: "WO-2023-001",
    assigneeId: "1",
    assigneeName: "John Doe",
    task: "Motor rewinding for Acme Industries",
    startTime: "08:00 AM",
    endTime: "11:30 AM",
    progress: 75,
  },
  {
    id: "2",
    workOrderId: "2",
    workOrderNumber: "WO-2023-002",
    assigneeId: "2",
    assigneeName: "Alice Smith",
    task: "Quality testing for TechCorp",
    startTime: "09:00 AM",
    endTime: "01:00 PM",
    progress: 40,
  },
  {
    id: "3",
    workOrderId: "3",
    workOrderNumber: "WO-2023-003",
    assigneeId: "4",
    assigneeName: "Emma Wilson",
    task: "Design review for Global Enterprises",
    startTime: "10:30 AM",
    endTime: "12:30 PM",
    progress: 100,
  },
  {
    id: "4",
    workOrderId: "4",
    workOrderNumber: "WO-2023-004",
    assigneeId: "3",
    assigneeName: "Bob Johnson",
    task: "On-site generator maintenance",
    startTime: "01:00 PM",
    endTime: "04:30 PM",
    progress: 25,
  },
];

const Team: React.FC = () => {
  const handleAddTeamMember = () => {
    toast.success("This feature will be available in the next update.");
  };
  
  const handleAddAssignment = () => {
    toast.success("This feature will be available in the next update.");
  };
  
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
    <Layout>
      <PageHeader
        title="Team Management"
        description="Manage your team members and assignments"
        actionLabel="Add Team Member"
        actionIcon={<UserPlus size={16} />}
        onAction={handleAddTeamMember}
      />
      
      <div className="grid gap-6 mb-6 md:grid-cols-4">
        <DashboardCard title="Total Team Members">
          <div className="text-3xl font-bold">{mockTeamMembers.length}</div>
          <p className="text-sm text-muted-foreground mt-1">Active team members</p>
        </DashboardCard>
        
        <DashboardCard title="Available Today">
          <div className="text-3xl font-bold text-green-600">
            {mockTeamMembers.filter(m => m.status === "available").length}
          </div>
          <p className="text-sm text-muted-foreground mt-1">Team members available</p>
        </DashboardCard>
        
        <DashboardCard title="Busy/Offsite">
          <div className="text-3xl font-bold text-yellow-600">
            {mockTeamMembers.filter(m => m.status === "busy" || m.status === "offsite").length}
          </div>
          <p className="text-sm text-muted-foreground mt-1">Currently on assignment</p>
        </DashboardCard>
        
        <DashboardCard title="On Leave">
          <div className="text-3xl font-bold text-gray-600">
            {mockTeamMembers.filter(m => m.status === "leave").length}
          </div>
          <p className="text-sm text-muted-foreground mt-1">Team members on leave</p>
        </DashboardCard>
      </div>
      
      <Tabs defaultValue="team">
        <TabsList className="mb-4">
          <TabsTrigger value="team">Team Members</TabsTrigger>
          <TabsTrigger value="schedule">Today's Schedule</TabsTrigger>
        </TabsList>
        
        <TabsContent value="team" className="animate-in">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTeamMembers.map((member) => (
                  <TableRow key={member.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>
                            {member.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{member.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>{member.department}</TableCell>
                    <TableCell>{getStatusBadge(member.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => toast.info(`Emailing ${member.name}`)}
                        >
                          <Mail className="h-4 w-4" />
                          <span className="sr-only">Email</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => toast.info(`Calling ${member.name}`)}
                        >
                          <Phone className="h-4 w-4" />
                          <span className="sr-only">Call</span>
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => toast.info(`View schedule for ${member.name}`)}
                      >
                        <Calendar className="h-4 w-4" />
                        <span>Schedule</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="schedule" className="animate-in">
          <div className="flex justify-end mb-4">
            <Button
              onClick={handleAddAssignment}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Assignment
            </Button>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Work Order</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAssignments.map((assignment) => (
                  <TableRow key={assignment.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="font-medium">{assignment.assigneeName}</div>
                    </TableCell>
                    <TableCell>{assignment.workOrderNumber}</TableCell>
                    <TableCell>{assignment.task}</TableCell>
                    <TableCell>
                      {assignment.startTime} - {assignment.endTime}
                    </TableCell>
                    <TableCell>
                      <div className="w-full flex items-center gap-2">
                        <Progress value={assignment.progress} className="h-2 w-full" />
                        <span className="text-xs font-medium w-9 text-right">{assignment.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast.info(`Updating assignment ${assignment.id}`)}
                      >
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Team;
