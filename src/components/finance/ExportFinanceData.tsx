
import React, { useState } from "react";
import { FileDown, FileUp, X } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/lib/utils";
import { FinancialTransaction } from "@/services/financeService";

interface ExportFinanceDataProps {
  transactions: FinancialTransaction[];
}

export function ExportFinanceData({ transactions }: ExportFinanceDataProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [format, setFormat] = useState("csv");
  const [includeFields, setIncludeFields] = useState({
    id: true,
    type: true,
    amount: true,
    description: true,
    category: true,
    date: true,
    related_work_order_id: true,
    created_at: false,
  });

  const toggleField = (field: keyof typeof includeFields) => {
    setIncludeFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const exportData = () => {
    if (transactions.length === 0) {
      alert("No data to export.");
      return;
    }

    // Filter included fields
    const processedData = transactions.map((transaction) => {
      const filteredTransaction: Record<string, any> = {};
      
      // Only include selected fields
      Object.keys(includeFields).forEach((key) => {
        if (includeFields[key as keyof typeof includeFields]) {
          let value = transaction[key as keyof FinancialTransaction];
          
          // Format date fields
          if (key === "date" || key === "created_at") {
            value = formatDate(value as string);
          }
          
          filteredTransaction[key] = value;
        }
      });
      
      return filteredTransaction;
    });

    // Generate file content based on format
    let content = "";
    let fileName = `finance_data_${formatDate(new Date().toISOString())}`;
    let mimeType = "";

    if (format === "csv") {
      // CSV Format
      const headers = Object.keys(processedData[0]).join(",");
      const rows = processedData.map((item) => 
        Object.values(item).map(value => 
          typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value
        ).join(",")
      ).join("\n");
      
      content = `${headers}\n${rows}`;
      fileName += ".csv";
      mimeType = "text/csv";
    } else if (format === "json") {
      // JSON Format
      content = JSON.stringify(processedData, null, 2);
      fileName += ".json";
      mimeType = "application/json";
    }

    // Create and download file
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setIsOpen(false);
  };

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

            <div className="space-y-2">
              <Label>Fields to Include</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="field-id" 
                    checked={includeFields.id}
                    onCheckedChange={() => toggleField("id")}
                  />
                  <Label htmlFor="field-id">ID</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="field-type" 
                    checked={includeFields.type}
                    onCheckedChange={() => toggleField("type")}
                  />
                  <Label htmlFor="field-type">Type</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="field-amount" 
                    checked={includeFields.amount}
                    onCheckedChange={() => toggleField("amount")}
                  />
                  <Label htmlFor="field-amount">Amount</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="field-description" 
                    checked={includeFields.description}
                    onCheckedChange={() => toggleField("description")}
                  />
                  <Label htmlFor="field-description">Description</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="field-category" 
                    checked={includeFields.category}
                    onCheckedChange={() => toggleField("category")}
                  />
                  <Label htmlFor="field-category">Category</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="field-date" 
                    checked={includeFields.date}
                    onCheckedChange={() => toggleField("date")}
                  />
                  <Label htmlFor="field-date">Date</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="field-related-work-order" 
                    checked={includeFields.related_work_order_id}
                    onCheckedChange={() => toggleField("related_work_order_id")}
                  />
                  <Label htmlFor="field-related-work-order">Related Work Order</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="field-created-at" 
                    checked={includeFields.created_at}
                    onCheckedChange={() => toggleField("created_at")}
                  />
                  <Label htmlFor="field-created-at">Created At</Label>
                </div>
              </div>
            </div>
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
