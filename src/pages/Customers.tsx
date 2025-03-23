
import React, { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { CustomerTable } from "@/components/customers/CustomerTable";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchCustomers, addCustomer, deleteCustomer, Customer } from "@/services/customerService";
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
  const [viewCustomerDetails, setViewCustomerDetails] = useState<Customer | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const handleCreateCustomer = () => {
    setIsCreateDialogOpen(true);
  };

  const handleViewCustomer = (id: string) => {
    const customer = customers.find(c => c.id === id);
    if (customer) {
      setViewCustomerDetails(customer);
      setIsViewDialogOpen(true);
    } else {
      toast.error("Customer not found");
    }
  };

  const handleEditCustomer = (id: string) => {
    toast.info(`Editing customer ${id}`);
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

  const handleSaveCustomer = async () => {
    try {
      // Create a customer object with default values for the required fields
      const customerToAdd = {
        ...newCustomer,
        totalOrders: 0,
        totalSpent: 0,
        lastOrder: new Date().toISOString().split('T')[0]
      };
      
      const customer = await addCustomer(customerToAdd);
      
      if (customer) {
        toast.success("Customer created successfully");
        // Refresh the customer list
        queryClient.invalidateQueries({ queryKey: ['customers'] });
        // Reset form and close dialog
        setNewCustomer({
          name: "",
          company: "",
          email: "",
          phone: "",
        });
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
          customer.name.toLowerCase().includes(query) ||
          customer.company.toLowerCase().includes(query) ||
          customer.email.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "company":
          return a.company.localeCompare(b.company);
        case "totalOrders":
          return b.totalOrders - a.totalOrders;
        case "totalSpent":
          return b.totalSpent - a.totalSpent;
        case "lastOrder":
          return new Date(b.lastOrder).getTime() - new Date(a.lastOrder).getTime();
        default:
          return 0;
      }
    });
    
    setFilteredCustomers(filtered);
  }, [customers, searchQuery, sortBy]);

  return (
    <Layout>
      <PageHeader
        title="Customers"
        description="Manage your customer relationships"
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
            onEdit={handleEditCustomer}
            onDelete={handleDeleteCustomer}
            onEmail={handleEmailCustomer}
            onCall={handleCallCustomer}
          />
        </div>
      )}
      
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new customer.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="company" className="text-right">
                Company
              </Label>
              <Input
                id="company"
                value={newCustomer.company}
                onChange={(e) => setNewCustomer({...newCustomer, company: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSaveCustomer}>
              Add Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          {viewCustomerDetails && (
            <div className="grid gap-4 py-4">
              <div className="flex flex-col space-y-1">
                <h3 className="font-medium text-sm text-muted-foreground">Name</h3>
                <p>{viewCustomerDetails.name}</p>
              </div>
              <div className="flex flex-col space-y-1">
                <h3 className="font-medium text-sm text-muted-foreground">Company</h3>
                <p>{viewCustomerDetails.company}</p>
              </div>
              <div className="flex flex-col space-y-1">
                <h3 className="font-medium text-sm text-muted-foreground">Contact</h3>
                <p>Email: {viewCustomerDetails.email}</p>
                <p>Phone: {viewCustomerDetails.phone}</p>
              </div>
              <div className="flex flex-col space-y-1">
                <h3 className="font-medium text-sm text-muted-foreground">Statistics</h3>
                <p>Total Orders: {viewCustomerDetails.totalOrders}</p>
                <p>Total Spent: ${viewCustomerDetails.totalSpent.toLocaleString()}</p>
                <p>Last Order: {viewCustomerDetails.lastOrder}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Customers;
