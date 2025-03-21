
import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { WorkOrderTable } from "@/components/projects/WorkOrderTable";
import { Plus, Filter } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const mockWorkOrders = [
  {
    id: "1",
    workOrderNumber: "WO-2023-001",
    customer: "Acme Industries",
    type: "Repair",
    status: "in-progress" as const,
    assignedTo: "John Doe",
    dueDate: "2023-08-15",
  },
  {
    id: "2",
    workOrderNumber: "WO-2023-002",
    customer: "TechCorp LLC",
    type: "Maintenance",
    status: "pending" as const,
    assignedTo: "Alice Smith",
    dueDate: "2023-08-20",
  },
  {
    id: "3",
    workOrderNumber: "WO-2023-003",
    customer: "Global Enterprises",
    type: "Installation",
    status: "completed" as const,
    assignedTo: "Bob Johnson",
    dueDate: "2023-08-10",
  },
  {
    id: "4",
    workOrderNumber: "WO-2023-004",
    customer: "City Power Co",
    type: "Reconditioning",
    status: "cancelled" as const,
    assignedTo: "Emma Wilson",
    dueDate: "2023-08-05",
  },
  {
    id: "5",
    workOrderNumber: "WO-2023-005",
    customer: "United Manufacturing",
    type: "Testing",
    status: "pending" as const,
    assignedTo: "Mike Thomas",
    dueDate: "2023-08-25",
  },
];

const Projects: React.FC = () => {
  const [filteredWorkOrders, setFilteredWorkOrders] = useState(mockWorkOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newWorkOrder, setNewWorkOrder] = useState({
    workOrderNumber: "",
    customer: "",
    type: "",
    assignedTo: "",
    dueDate: "",
  });

  const handleCreateWorkOrder = () => {
    setIsCreateDialogOpen(true);
  };

  const handleViewWorkOrder = (id: string) => {
    toast.info(`Viewing work order ${id}`);
  };

  const handleEditWorkOrder = (id: string) => {
    toast.info(`Editing work order ${id}`);
  };

  const handleDeleteWorkOrder = (id: string) => {
    setFilteredWorkOrders(filteredWorkOrders.filter(order => order.id !== id));
    toast.success(`Work order ${id} deleted successfully`);
  };

  const handleSaveWorkOrder = () => {
    // In a real app, this would be a database operation
    toast.success("Work order created successfully");
    setIsCreateDialogOpen(false);
    // Reset form
    setNewWorkOrder({
      workOrderNumber: "",
      customer: "",
      type: "",
      assignedTo: "",
      dueDate: "",
    });
  };

  // Filter work orders based on search query and status filter
  React.useEffect(() => {
    let filtered = mockWorkOrders;
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        order =>
          order.workOrderNumber.toLowerCase().includes(query) ||
          order.customer.toLowerCase().includes(query) ||
          order.assignedTo.toLowerCase().includes(query)
      );
    }
    
    setFilteredWorkOrders(filtered);
  }, [searchQuery, statusFilter]);

  return (
    <Layout>
      <PageHeader
        title="Work Orders"
        description="Manage your service projects and work orders"
        actionLabel="Create Work Order"
        actionIcon={<Plus size={16} />}
        onAction={handleCreateWorkOrder}
      />

      <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
        <div className="w-full md:w-64">
          <Label htmlFor="search-work-orders" className="text-sm">Search</Label>
          <Input
            id="search-work-orders"
            placeholder="Search work orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="w-full md:w-40">
          <Label htmlFor="status-filter" className="text-sm">Status</Label>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger id="status-filter" className="w-full">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border animate-in">
        <WorkOrderTable
          workOrders={filteredWorkOrders}
          onView={handleViewWorkOrder}
          onEdit={handleEditWorkOrder}
          onDelete={handleDeleteWorkOrder}
        />
      </div>
      
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Work Order</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new work order.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="workOrderNumber" className="text-right">
                Work Order #
              </Label>
              <Input
                id="workOrderNumber"
                value={newWorkOrder.workOrderNumber}
                onChange={(e) => setNewWorkOrder({...newWorkOrder, workOrderNumber: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customer" className="text-right">
                Customer
              </Label>
              <Input
                id="customer"
                value={newWorkOrder.customer}
                onChange={(e) => setNewWorkOrder({...newWorkOrder, customer: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select
                value={newWorkOrder.type}
                onValueChange={(value) => setNewWorkOrder({...newWorkOrder, type: value})}
              >
                <SelectTrigger id="type" className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Repair">Repair</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Installation">Installation</SelectItem>
                  <SelectItem value="Testing">Testing</SelectItem>
                  <SelectItem value="Reconditioning">Reconditioning</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assignedTo" className="text-right">
                Assigned To
              </Label>
              <Input
                id="assignedTo"
                value={newWorkOrder.assignedTo}
                onChange={(e) => setNewWorkOrder({...newWorkOrder, assignedTo: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">
                Due Date
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={newWorkOrder.dueDate}
                onChange={(e) => setNewWorkOrder({...newWorkOrder, dueDate: e.target.value})}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSaveWorkOrder}>
              Create Work Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Projects;
