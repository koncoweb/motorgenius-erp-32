
export interface InventoryItem {
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

export const mockInventoryItems: InventoryItem[] = [
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

export const getStockStatus = (current: number, min: number): "low" | "medium" | "good" => {
  if (current <= min) {
    return "low";
  } else if (current <= min * 1.5) {
    return "medium";
  } else {
    return "good";
  }
};

export const getLowStockItems = (items: InventoryItem[]) => {
  return items.filter(item => item.currentStock <= item.minStock);
};

export const filterInventoryItems = (
  items: InventoryItem[],
  searchQuery: string,
  categoryFilter: string,
  locationFilter: string,
  stockStatusFilter: string
): InventoryItem[] => {
  let filtered = [...items];
  
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      item =>
        item.sku.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query)
    );
  }
  
  if (categoryFilter !== "all") {
    filtered = filtered.filter(item => item.category === categoryFilter);
  }
  
  if (locationFilter !== "all") {
    filtered = filtered.filter(item => item.location === locationFilter);
  }
  
  if (stockStatusFilter !== "all") {
    filtered = filtered.filter(item => {
      const status = getStockStatus(item.currentStock, item.minStock);
      return status === stockStatusFilter;
    });
  }
  
  return filtered;
};
