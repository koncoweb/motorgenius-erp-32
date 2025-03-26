
import React, { useState } from "react";
import { FileDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ExportFieldsSelection } from "./ExportFieldsSelection";
import { useFinanceExport } from "@/hooks/useFinanceExport";
import { FinancialTransaction } from "@/services/financeService";

interface ExportFinanceDataProps {
  transactions: FinancialTransaction[];
}

export function ExportFinanceData({ transactions }: ExportFinanceDataProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { format, setFormat, includeFields, toggleField, exportData } = useFinanceExport(transactions);

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setIsOpen(true)}
        className="gap-1"
      >
        <FileDown className="h-4 w-4" />
        Export Data
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Export Finance Data</DialogTitle>
            <DialogDescription>
              Choose format and fields to include in your export.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="format">Export Format</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger id="format">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV (.csv)</SelectItem>
                  <SelectItem value="json">JSON (.json)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <ExportFieldsSelection 
              includeFields={includeFields}
              onToggleField={toggleField}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={exportData}>
              <FileDown className="mr-2 h-4 w-4" />
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
