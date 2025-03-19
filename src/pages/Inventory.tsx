
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, MoreHorizontal, QrCode, Search } from "lucide-react";
import { toast } from "sonner";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  lastRestocked: string;
  location: string;
  unitPrice: number;
}

const mockInventoryItems = [
  {
    id: "1",
    sku: "MTR-001",
    name: "Electric Motor 5kW",
    category: "Motors",
    currentStock: 12,
    minStock: 5,
    lastRestocked: "2023-07-15",
    location: "Warehouse A",
    unitPrice: 450,
  },
  {
    id: "2",
    sku: "BRG-101",
    name: "Bearing Assembly",
    category: "Parts",
    currentStock: 45,
    minStock: 20,
    lastRestocked: "2023-08-02",
    location: "Warehouse B",
    unitPrice: 85,
  },
  {
    id: "3",
    sku: "WRE-202",
    name: "Copper Winding Wire",
    category: "Materials",
    currentStock: 8,
    minStock: 10,
    lastRestocked: "2023-07-28",
    location: "Warehouse A",
    unitPrice: 120,
  },
  {
    id: "4",
    sku: "GEN-005",
    name: "Generator 15kW",
    category: "Generators",
    currentStock: 3,
    minStock: 2,
    lastRestocked: "2023-08-10",
    location: "Warehouse C",
    unitPrice: 1250,
  },
  {
    id: "5",
    sku: "CAP-330",
    name: "Capacitor Bank",
    category: "Parts",
    currentStock: 28,
    minStock: 15,
    lastRestocked: "2023-07-22",
    location: "Warehouse B",
    unitPrice: 65,
  },
];

const Inventory: React.FC = () => {
  const handleAddItem = () => {
    toast.success("This feature will be available in the next update.");
  };
  
  const getLowStockItems = () => {
    return mockInventoryItems.filter(item => item.currentStock <= item.minStock);
  };
  
  const getStockStatus = (current: number, min: number) => {
    if (current <= min) {
      return "low";
    } else if (current <= min * 1.5) {
      return "medium";
    } else {
      return "good";
    }
  };
  
  const getStockStatusBadge = (status: string) => {
    switch (status) {
      case "low":
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-200">Low Stock</Badge>;
      case "medium":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Medium</Badge>;
      case "good":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200">Good</Badge>;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <PageHeader
        title="Inventory"
        description="Manage your parts and materials inventory"
        actionLabel="Add Item"
        actionIcon={<Plus size={16} />}
        onAction={handleAddItem}
      />
      
      <div className="grid gap-6 mb-6 md:grid-cols-4">
        <DashboardCard title="Total Items">
          <div className="text-3xl font-bold">{mockInventoryItems.length}</div>
          <p className="text-sm text-muted-foreground mt-1">Items in inventory</p>
        </DashboardCard>
        
        <DashboardCard title="Low Stock">
          <div className="text-3xl font-bold text-red-600">{getLowStockItems().length}</div>
          <p className="text-sm text-muted-foreground mt-1">Items below minimum level</p>
        </DashboardCard>
        
        <DashboardCard title="Inventory Value">
          <div className="text-3xl font-bold">
            ${mockInventoryItems.reduce((total, item) => total + (item.currentStock * item.unitPrice), 0).toLocaleString()}
          </div>
          <p className="text-sm text-muted-foreground mt-1">Total value of inventory</p>
        </DashboardCard>
        
        <DashboardCard title="Categories">
          <div className="text-3xl font-bold">
            {new Set(mockInventoryItems.map(item => item.category)).size}
          </div>
          <p className="text-sm text-muted-foreground mt-1">Different item categories</p>
        </DashboardCard>
      </div>
      
      <Tabs defaultValue="all">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
          </TabsList>
          
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search inventory..." 
              className="pl-8 w-[250px]" 
            />
          </div>
        </div>
        
        <TabsContent value="all" className="animate-in">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockInventoryItems.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{item.sku}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{item.currentStock}</span>
                        {getStockStatusBadge(getStockStatus(item.currentStock, item.minStock))}
                      </div>
                    </TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>${item.unitPrice}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toast.info(`Viewing QR code for ${item.sku}`)}
                        >
                          <QrCode className="h-4 w-4" />
                          <span className="sr-only">View QR Code</span>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => toast.info(`Editing item ${item.id}`)}>
                              Edit Item
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.info(`Updating stock for ${item.sku}`)}>
                              Update Stock
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.success(`Reorder placed for ${item.sku}`)}>
                              Place Reorder
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="low-stock" className="animate-in">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Min Stock</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getLowStockItems().map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{item.sku}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="text-red-600 font-medium">{item.currentStock}</TableCell>
                    <TableCell>{item.minStock}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        onClick={() => toast.success(`Reorder placed for ${item.sku}`)}
                      >
                        Reorder Now
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

export default Inventory;
