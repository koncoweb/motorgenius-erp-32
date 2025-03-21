
import React from "react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";

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

interface InventoryStatsProps {
  inventoryItems: InventoryItem[];
}

export const InventoryStats: React.FC<InventoryStatsProps> = ({ inventoryItems }) => {
  const getLowStockItems = () => {
    return inventoryItems.filter(item => item.currentStock <= item.minStock);
  };

  return (
    <div className="grid gap-6 mb-6 md:grid-cols-4">
      <DashboardCard title="Total Items">
        <div className="text-3xl font-bold">{inventoryItems.length}</div>
        <p className="text-sm text-muted-foreground mt-1">Items in inventory</p>
      </DashboardCard>
      
      <DashboardCard title="Low Stock">
        <div className="text-3xl font-bold text-red-600">{getLowStockItems().length}</div>
        <p className="text-sm text-muted-foreground mt-1">Items below minimum level</p>
      </DashboardCard>
      
      <DashboardCard title="Inventory Value">
        <div className="text-3xl font-bold">
          ${inventoryItems.reduce((total, item) => total + (item.currentStock * item.unitPrice), 0).toLocaleString()}
        </div>
        <p className="text-sm text-muted-foreground mt-1">Total value of inventory</p>
      </DashboardCard>
      
      <DashboardCard title="Categories">
        <div className="text-3xl font-bold">
          {new Set(inventoryItems.map(item => item.category)).size}
        </div>
        <p className="text-sm text-muted-foreground mt-1">Different item categories</p>
      </DashboardCard>
    </div>
  );
};
