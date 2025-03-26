
import React, { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { CustomerTable } from "@/components/customers/CustomerTable";
import { CustomerDetailView } from "@/components/customers/CustomerDetailView";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  fetchCustomers, 
  addCustomer, 
  deleteCustomer, 
  updateCustomer, 
  getCustomerDetails,
  Customer 
} from "@/services/customerService";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const Customers: React.FC = () => {
  const queryClient = useQueryClient();
  
  // Fetch customers using React Query
  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers
  });
  
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
  });
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const handleCreateCustomer = () => {
    setIsCreateDialogOpen(true);
  };

  const handleViewCustomer = async (id: string) => {
    try {
      const customer = await getCustomerDetails(id);
      if (customer) {
        setSelectedCustomer(customer);
        setIsViewDialogOpen(true);
      } else {
        toast.error("Customer not found");
      }
    } catch (error) {
      console.error("Error fetching customer details:", error);
      toast.error("Failed to load customer details");
    }
  };

  const handleEditCustomer = async (id: string, updatedData: Partial<Customer>) => {
    try {
      const updatedCustomer = await updateCustomer(id, updatedData);
      if (updatedCustomer) {
        toast.success("Customer updated successfully");
        // Refresh customer data
        queryClient.invalidateQueries({ queryKey: ['customers'] });
        // Update selected customer with new data
        setSelectedCustomer(updatedCustomer);
      } else {
        toast.error("Failed to update customer");
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      toast.error("An error occurred while updating the customer");
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    try {
      const success = await deleteCustomer(id);
      if (success) {
        toast.success(`Customer deleted successfully`);
        // Refresh the customer list
        queryClient.invalidateQueries({ queryKey: ['customers'] });
      } else {
        toast.error("Failed to delete customer");
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error("An error occurred while deleting the customer");
    }
  };

  const handleEmailCustomer = (email: string) => {
    toast.info(`Opening email to ${email}`);
  };

  const handleCallCustomer = (phone: string) => {
    toast.info(`Calling ${phone}`);
  };

  const handleSaveCustomer = async (customerData: Partial<Customer>) => {
    try {
      // Ensure required fields have default values if not provided
      const customerToAdd = {
        name: customerData.name || "",  // Required field must have a default
        company: customerData.company || "",  // Required field must have a default
        email: customerData.email || "",  // Required field must have a default
        phone: customerData.phone || "",  // Required field must have a default
        totalOrders: 0,
        totalSpent: 0,
        lastOrder: new Date().toISOString().split('T')[0],
        // Include other optional fields
        address: customerData.address,
        pic_name: customerData.pic_name,
        contract_value: customerData.contract_value,
        contract_start_date: customerData.contract_start_date,
        contract_end_date: customerData.contract_end_date
      };
      
      const customer = await addCustomer(customerToAdd);
      
      if (customer) {
        toast.success("Customer created successfully");
        // Refresh the customer list
        queryClient.invalidateQueries({ queryKey: ['customers'] });
        // Close dialog
        setIsCreateDialogOpen(false);
      } else {
        toast.error("Failed to create customer");
      }
    } catch (error) {
      console.error("Error creating customer:", error);
      toast.error("An error occurred while creating the customer");
    }
  };

  // Filter and sort customers whenever the data, search query, or sort option changes
  useEffect(() => {
    let filtered = [...customers];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        customer =>
          customer.name?.toLowerCase().includes(query) ||
          customer.company?.toLowerCase().includes(query) ||
          customer.email?.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.name || '').localeCompare(b.name || '');
        case "company":
          return (a.company || '').localeCompare(b.company || '');
        case "totalOrders":
          return (b.totalOrders || 0) - (a.totalOrders || 0);
        case "totalSpent":
          return (b.totalSpent || 0) - (a.totalSpent || 0);
        case "lastOrder":
          return new Date(b.lastOrder || '').getTime() - new Date(a.lastOrder || '').getTime();
        default:
          return 0;
      }
    });
    
    setFilteredCustomers(filtered);
  }, [customers, searchQuery, sortBy]);

  return (
    <Layout>
      <PageHeader
        title="Customer Relationship Management"
        description="Manage customer data, contracts, and relationships"
        actionLabel="Add Customer"
        actionIcon={<Plus size={16} />}
        onAction={handleCreateCustomer}
      />

      <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
        <div className="w-full md:w-64">
          <Label htmlFor="search-customers" className="text-sm">Search</Label>
          <Input
            id="search-customers"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="w-full md:w-40">
          <Label htmlFor="sort-by" className="text-sm">Sort By</Label>
          <Select
            value={sortBy}
            onValueChange={setSortBy}
          >
            <SelectTrigger id="sort-by" className="w-full">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="company">Company</SelectItem>
              <SelectItem value="totalOrders">Total Orders</SelectItem>
              <SelectItem value="totalSpent">Total Spent</SelectItem>
              <SelectItem value="lastOrder">Last Order</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-10">Loading customers...</div>
      ) : (
        <div className="rounded-md border animate-in">
          <CustomerTable
            customers={filteredCustomers}
            onView={handleViewCustomer}
            onEdit={(id) => handleViewCustomer(id)}
            onDelete={handleDeleteCustomer}
            onEmail={handleEmailCustomer}
            onCall={handleCallCustomer}
          />
        </div>
      )}
      
      <CustomerForm
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSave={handleSaveCustomer}
        title="Add New Customer"
      />
      
      <CustomerDetailView
        customer={selectedCustomer}
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        onEdit={handleEditCustomer}
      />
    </Layout>
  );
};

export default Customers;
