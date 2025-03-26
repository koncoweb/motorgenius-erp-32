
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatRupiah } from "@/lib/utils";

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

interface LowStockTableProps {
  items: InventoryItem[];
}

export const LowStockTable: React.FC<LowStockTableProps> = ({ items }) => {
  const getLowStockItems = () => {
    return items.filter(item => item.currentStock <= item.minStock);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SKU</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Min Stock</TableHead>
            <TableHead>Unit Price</TableHead>
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
              <TableCell>{formatRupiah(item.unitPrice)}</TableCell>
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
  );
};
