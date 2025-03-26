
import React from "react";
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
import { MoreHorizontal, QrCode, Eye } from "lucide-react";
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

interface InventoryTableProps {
  items: InventoryItem[];
  onViewItem: (id: string) => void;
  onReorderItem: (sku: string) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  items,
  onViewItem,
  onReorderItem,
}) => {
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
          {items.map((item) => (
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
              <TableCell>{formatRupiah(item.unitPrice)}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onViewItem(item.id)}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View Details</span>
                  </Button>
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
                      <DropdownMenuItem onClick={() => onReorderItem(item.sku)}>
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
  );
};
