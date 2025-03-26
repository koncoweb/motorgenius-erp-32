
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InventoryItem, getStockStatus } from "./inventoryUtils";
import { formatRupiah } from "@/lib/utils";

interface InventoryDetailsProps {
  item: InventoryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReorder: (sku: string) => void;
}

export const InventoryDetails: React.FC<InventoryDetailsProps> = ({
  item,
  open,
  onOpenChange,
  onReorder,
}) => {
  if (!item) return null;
  
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

  const stockStatus = getStockStatus(item.currentStock, item.minStock);
  const needsReorder = stockStatus === "low";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Inventory Item Details</DialogTitle>
          <DialogDescription>
            Detailed information about {item.name}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">SKU:</span>
            <span className="font-mono">{item.sku}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Name:</span>
            <span>{item.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Category:</span>
            <span>{item.category}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Stock Status:</span>
            <div className="flex items-center gap-2">
              <span>{item.currentStock}</span>
              {getStockStatusBadge(stockStatus)}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Minimum Stock:</span>
            <span>{item.minStock}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Location:</span>
            <span>{item.location}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Unit Price:</span>
            <span>{formatRupiah(item.unitPrice)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Last Restocked:</span>
            <span>{item.lastRestocked}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Value:</span>
            <span>{formatRupiah(item.currentStock * item.unitPrice)}</span>
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {needsReorder && (
            <Button onClick={() => onReorder(item.sku)}>
              Reorder Now
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
