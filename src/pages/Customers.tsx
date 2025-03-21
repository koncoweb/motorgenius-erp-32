
import React, { useState } from "react";
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
  const [filteredCustomers, setFilteredCustomers] = useState(mockCustomers);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
  });
  const [viewCustomerDetails, setViewCustomerDetails] = useState<typeof mockCustomers[0] | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const handleCreateCustomer = () => {
    setIsCreateDialogOpen(true);
  };

  const handleViewCustomer = (id: string) => {
    const customer = mockCustomers.find(c => c.id === id);
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

  const handleDeleteCustomer = (id: string) => {
    setFilteredCustomers(filteredCustomers.filter(customer => customer.id !== id));
    toast.success(`Customer ${id} deleted successfully`);
  };

  const handleEmailCustomer = (email: string) => {
    toast.info(`Opening email to ${email}`);
  };

  const handleCallCustomer = (phone: string) => {
    toast.info(`Calling ${phone}`);
  };

  const handleSaveCustomer = () => {
    // In a real app, this would be a database operation
    toast.success("Customer created successfully");
    setIsCreateDialogOpen(false);
    // Reset form
    setNewCustomer({
      name: "",
      company: "",
      email: "",
      phone: "",
    });
  };

  // Filter and sort customers
  React.useEffect(() => {
    let filtered = [...mockCustomers];
    
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
  }, [searchQuery, sortBy]);

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
