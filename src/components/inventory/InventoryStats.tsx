
import React from "react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart3 } from "lucide-react";

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

  const getCategoryStockData = () => {
    const categoryMap = new Map<string, { category: string; stock: number }>();
    
    inventoryItems.forEach((item) => {
      const current = categoryMap.get(item.category);
      if (current) {
        current.stock += item.currentStock;
      } else {
        categoryMap.set(item.category, { 
          category: item.category, 
          stock: item.currentStock 
        });
      }
    });
    
    return Array.from(categoryMap.values());
  };

  const categoryStockData = getCategoryStockData();
  const totalValue = inventoryItems.reduce(
    (total, item) => total + (item.currentStock * item.unitPrice), 
    0
  );
  const uniqueCategories = new Set(inventoryItems.map(item => item.category)).size;

  return (
    <div className="grid gap-6 mb-6">
      <div className="grid gap-6 md:grid-cols-4">
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
            ${totalValue.toLocaleString()}
          </div>
          <p className="text-sm text-muted-foreground mt-1">Total value of inventory</p>
        </DashboardCard>
        
        <DashboardCard title="Categories">
          <div className="text-3xl font-bold">
            {uniqueCategories}
          </div>
          <p className="text-sm text-muted-foreground mt-1">Different item categories</p>
        </DashboardCard>
      </div>

      <DashboardCard 
        title="Inventory by Category" 
        className="col-span-full"
        headerAction={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
      >
        <div className="h-[300px] w-full">
          <ChartContainer
            config={{
              primary: {
                color: "#8B5CF6",
              },
              grid: {
                color: "#e5e7eb",
              }
            }}
          >
            <BarChart data={categoryStockData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-color, #e5e7eb)" />
              <XAxis 
                dataKey="category" 
                angle={-45} 
                textAnchor="end" 
                height={60} 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                label={{ value: "Stock Level", angle: -90, position: "insideLeft", style: { textAnchor: "middle" } }} 
                tick={{ fontSize: 12 }}
              />
              <ChartTooltip
                content={<ChartTooltipContent 
                  formatter={(value, name) => [value, "Stock Level"]} 
                  labelFormatter={(label) => `Category: ${label}`}
                />}
              />
              <Bar dataKey="stock" fill="var(--color-primary, #8B5CF6)" name="Stock Level" />
            </BarChart>
          </ChartContainer>
        </div>
      </DashboardCard>
    </div>
  );
};
