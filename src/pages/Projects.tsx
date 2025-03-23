
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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AddWorkOrderForm } from "@/components/projects/AddWorkOrderForm";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchWorkOrders, WorkOrder } from "@/services/workOrderService";

const Projects: React.FC = () => {
  // Fetch work orders using React Query
  const { data: workOrders = [], isLoading } = useQuery({
    queryKey: ['workOrders'],
    queryFn: fetchWorkOrders,
  });
  
  const queryClient = useQueryClient();
  const [filteredWorkOrders, setFilteredWorkOrders] = useState<WorkOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

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
    // In a real app, this would call an API
    toast.success(`Work order ${id} deleted successfully`);
    // Refresh work orders
    queryClient.invalidateQueries({ queryKey: ['workOrders'] });
  };

  // Filter work orders based on search query and status filter
  React.useEffect(() => {
    let filtered = [...workOrders];
    
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
  }, [workOrders, searchQuery, statusFilter]);

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
        {isLoading ? (
          <div className="flex justify-center p-8">
            <p>Loading work orders...</p>
          </div>
        ) : (
          <WorkOrderTable
            workOrders={filteredWorkOrders}
            onView={handleViewWorkOrder}
            onEdit={handleEditWorkOrder}
            onDelete={handleDeleteWorkOrder}
          />
        )}
      </div>
      
      <AddWorkOrderForm 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
      />
    </Layout>
  );
};

export default Projects;
