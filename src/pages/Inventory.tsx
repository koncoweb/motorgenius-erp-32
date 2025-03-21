
import React, { useState, useEffect } from "react";
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

const Inventory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [stockStatusFilter, setStockStatusFilter] = useState("all");
  const [filteredItems, setFilteredItems] = useState(mockInventoryItems);
  const [selectedItem, setSelectedItem] = useState<null | InventoryItem>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  
  const handleAddItem = () => {
    toast.success("This feature will be available in the next update.");
  };
  
  const handleViewItem = (id: string) => {
    const item = mockInventoryItems.find(item => item.id === id);
    if (item) {
      setSelectedItem(item);
      setDetailsDialogOpen(true);
    }
  };
  
  const handleReorderItem = (sku: string) => {
    toast.success(`Reorder placed for ${sku}`);
    setDetailsDialogOpen(false);
  };
  
  useEffect(() => {
    const filtered = filterInventoryItems(
      mockInventoryItems,
      searchQuery,
      categoryFilter,
      locationFilter,
      stockStatusFilter
    );
    
    setFilteredItems(filtered);
  }, [searchQuery, categoryFilter, locationFilter, stockStatusFilter]);

  return (
    <Layout>
      <PageHeader
        title="Inventory"
        description="Manage your parts and materials inventory"
        actionLabel="Add Item"
        actionIcon={<Plus size={16} />}
        onAction={handleAddItem}
      />
      
      <InventoryStats inventoryItems={mockInventoryItems} />
      
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
          
          <InventoryTable 
            items={filteredItems} 
            onViewItem={handleViewItem}
            onReorderItem={handleReorderItem}
          />
        </TabsContent>
        
        <TabsContent value="low-stock" className="animate-in">
          <LowStockTable items={mockInventoryItems} />
        </TabsContent>
      </Tabs>
      
      <InventoryDetails
        item={selectedItem}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        onReorder={handleReorderItem}
      />
    </Layout>
  );
};

export default Inventory;
