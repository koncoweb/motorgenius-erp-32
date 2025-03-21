
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface InventoryFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  location: string;
  onLocationChange: (value: string) => void;
  stockStatus: string;
  onStockStatusChange: (value: string) => void;
}

export const InventoryFilters: React.FC<InventoryFiltersProps> = ({
  searchQuery,
  onSearchChange,
  category,
  onCategoryChange,
  location,
  onLocationChange,
  stockStatus,
  onStockStatusChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
      <div className="w-full md:w-72">
        <Label htmlFor="search-inventory" className="text-sm">Search</Label>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="search-inventory"
            placeholder="Search inventory..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 w-full"
          />
        </div>
      </div>
      
      <div className="w-full md:w-40">
        <Label htmlFor="category-filter" className="text-sm">Category</Label>
        <Select
          value={category}
          onValueChange={onCategoryChange}
        >
          <SelectTrigger id="category-filter" className="w-full">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Motors">Motors</SelectItem>
            <SelectItem value="Parts">Parts</SelectItem>
            <SelectItem value="Materials">Materials</SelectItem>
            <SelectItem value="Generators">Generators</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-full md:w-40">
        <Label htmlFor="location-filter" className="text-sm">Location</Label>
        <Select
          value={location}
          onValueChange={onLocationChange}
        >
          <SelectTrigger id="location-filter" className="w-full">
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="Warehouse A">Warehouse A</SelectItem>
            <SelectItem value="Warehouse B">Warehouse B</SelectItem>
            <SelectItem value="Warehouse C">Warehouse C</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-full md:w-40">
        <Label htmlFor="stock-filter" className="text-sm">Stock Status</Label>
        <Select
          value={stockStatus}
          onValueChange={onStockStatusChange}
        >
          <SelectTrigger id="stock-filter" className="w-full">
            <SelectValue placeholder="All Stock" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="low">Low Stock</SelectItem>
            <SelectItem value="medium">Medium Stock</SelectItem>
            <SelectItem value="good">Good Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
