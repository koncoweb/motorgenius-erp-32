
import React from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { CustomerTable } from "@/components/customers/CustomerTable";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const mockCustomers = [
  {
    id: "1",
    name: "John Williams",
    company: "Acme Industries",
    email: "jwilliams@acme.com",
    phone: "+1 (555) 123-4567",
    totalOrders: 12,
    totalSpent: 45800,
    lastOrder: "2023-07-28",
  },
  {
    id: "2",
    name: "Sarah Chen",
    company: "TechCorp LLC",
    email: "schen@techcorp.com",
    phone: "+1 (555) 987-6543",
    totalOrders: 8,
    totalSpent: 28500,
    lastOrder: "2023-08-05",
  },
  {
    id: "3",
    name: "Robert Martinez",
    company: "Global Enterprises",
    email: "rmartinez@global.com",
    phone: "+1 (555) 456-7890",
    totalOrders: 5,
    totalSpent: 18200,
    lastOrder: "2023-08-12",
  },
  {
    id: "4",
    name: "Emma Wilson",
    company: "City Power Co",
    email: "ewilson@citypower.com",
    phone: "+1 (555) 234-5678",
    totalOrders: 15,
    totalSpent: 67300,
    lastOrder: "2023-08-03",
  },
  {
    id: "5",
    name: "David Johnson",
    company: "United Manufacturing",
    email: "djohnson@united.com",
    phone: "+1 (555) 345-6789",
    totalOrders: 9,
    totalSpent: 32600,
    lastOrder: "2023-07-22",
  },
];

const Customers: React.FC = () => {
  const handleCreateCustomer = () => {
    toast.success("This feature will be available in the next update.");
  };

  const handleViewCustomer = (id: string) => {
    toast.info(`Viewing customer ${id}`);
  };

  const handleEditCustomer = (id: string) => {
    toast.info(`Editing customer ${id}`);
  };

  const handleDeleteCustomer = (id: string) => {
    toast.success(`Customer ${id} deleted successfully`);
  };

  const handleEmailCustomer = (email: string) => {
    toast.info(`Opening email to ${email}`);
  };

  const handleCallCustomer = (phone: string) => {
    toast.info(`Calling ${phone}`);
  };

  return (
    <Layout>
      <PageHeader
        title="Customers"
        description="Manage your customer relationships"
        actionLabel="Add Customer"
        actionIcon={<Plus size={16} />}
        onAction={handleCreateCustomer}
      />

      <div className="rounded-md border animate-in">
        <CustomerTable
          customers={mockCustomers}
          onView={handleViewCustomer}
          onEdit={handleEditCustomer}
          onDelete={handleDeleteCustomer}
          onEmail={handleEmailCustomer}
          onCall={handleCallCustomer}
        />
      </div>
    </Layout>
  );
};

export default Customers;
