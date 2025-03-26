
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";

interface FinanceFiltersProps {
  filters: {
    type: string;
    search: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    type: string;
    search: string;
  }>>;
}

export function FinanceFilters({ filters, setFilters }: FinanceFiltersProps) {
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  // Handle type filter change
  const handleTypeFilterChange = (value: string) => {
    setFilters(prev => ({ ...prev, type: value }));
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="w-full sm:w-1/3 md:w-1/4">
        <Select
          value={filters.type}
          onValueChange={handleTypeFilterChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Transactions</SelectItem>
            <SelectItem value="revenue">Revenue Only</SelectItem>
            <SelectItem value="expense">Expenses Only</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full sm:flex-1">
        <Input
          placeholder="Search transactions..."
          value={filters.search}
          onChange={handleSearchChange}
        />
      </div>
    </div>
  );
}
