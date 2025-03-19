
import React from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { WorkOrderTable } from "@/components/projects/WorkOrderTable";
import { Plus } from "lucide-react";
import { toast } from "sonner";

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
  const handleCreateWorkOrder = () => {
    toast.success("This feature will be available in the next update.");
  };

  const handleViewWorkOrder = (id: string) => {
    toast.info(`Viewing work order ${id}`);
  };

  const handleEditWorkOrder = (id: string) => {
    toast.info(`Editing work order ${id}`);
  };

  const handleDeleteWorkOrder = (id: string) => {
    toast.success(`Work order ${id} deleted successfully`);
  };

  return (
    <Layout>
      <PageHeader
        title="Work Orders"
        description="Manage your service projects and work orders"
        actionLabel="Create Work Order"
        actionIcon={<Plus size={16} />}
        onAction={handleCreateWorkOrder}
      />

      <div className="rounded-md border animate-in">
        <WorkOrderTable
          workOrders={mockWorkOrders}
          onView={handleViewWorkOrder}
          onEdit={handleEditWorkOrder}
          onDelete={handleDeleteWorkOrder}
        />
      </div>
    </Layout>
  );
};

export default Projects;
