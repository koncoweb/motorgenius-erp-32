
import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { InventoryFilters } from "@/components/inventory/InventoryFilters";
import { InventoryDetails } from "@/components/inventory/InventoryDetails";
import { InventoryStats } from "@/components/inventory/InventoryStats";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { LowStockTable } from "@/components/inventory/LowStockTable";
import { 
  mockInventoryItems, 
  filterInventoryItems, 
  InventoryItem 
} from "@/components/inventory/inventoryUtils";
import { useQuery } from "@tanstack/react-query";
import { fetchInventoryItems } from "@/services/inventoryService";
import { AddInventoryForm } from "@/components/inventory/AddInventoryForm";

const Inventory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [stockStatusFilter, setStockStatusFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState<null | InventoryItem>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false);
  
  // Fetch inventory items with react-query
  const { data: inventoryItems, isLoading, error } = useQuery({
    queryKey: ['inventoryItems'],
    queryFn: fetchInventoryItems,
    initialData: mockInventoryItems, // Use mock data as fallback
  });
  
  const handleAddItem = () => {
    setAddItemDialogOpen(true);
  };
  
  const handleViewItem = (id: string) => {
    const item = inventoryItems.find(item => item.id === id);
    if (item) {
      setSelectedItem(item);
      setDetailsDialogOpen(true);
    }
  };
  
  const handleReorderItem = (sku: string) => {
    toast.success(`Reorder placed for ${sku}`);
    setDetailsDialogOpen(false);
  };
  
  // Filter items based on user selections
  const filteredItems = React.useMemo(() => {
    return filterInventoryItems(
      inventoryItems,
      searchQuery,
      categoryFilter,
      locationFilter,
      stockStatusFilter
    );
  }, [inventoryItems, searchQuery, categoryFilter, locationFilter, stockStatusFilter]);

  if (error) {
    toast.error("Failed to load inventory data");
  }

  return (
    <Layout>
      <PageHeader
        title="Inventory"
        description="Manage your parts and materials inventory"
        actionLabel="Add Item"
        actionIcon={<Plus size={16} />}
        onAction={handleAddItem}
      />
      
      <InventoryStats inventoryItems={inventoryItems} />
      
      <Tabs defaultValue="all">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="animate-in">
          <InventoryFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            category={categoryFilter}
            onCategoryChange={setCategoryFilter}
            location={locationFilter}
            onLocationChange={setLocationFilter}
            stockStatus={stockStatusFilter}
            onStockStatusChange={setStockStatusFilter}
          />
          
          {isLoading ? (
            <div className="flex justify-center p-8">
              <p>Loading inventory data...</p>
            </div>
          ) : (
            <InventoryTable 
              items={filteredItems} 
              onViewItem={handleViewItem}
              onReorderItem={handleReorderItem}
            />
          )}
        </TabsContent>
        
        <TabsContent value="low-stock" className="animate-in">
          <LowStockTable items={inventoryItems} />
        </TabsContent>
      </Tabs>
      
      <InventoryDetails
        item={selectedItem}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        onReorder={handleReorderItem}
      />
      
      <AddInventoryForm 
        open={addItemDialogOpen}
        onOpenChange={setAddItemDialogOpen}
      />
    </Layout>
  );
};

export default Inventory;
