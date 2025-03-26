
import { useState } from "react";
import { formatDate } from "@/lib/utils";
import { FinancialTransaction } from "@/services/financeService";

export interface ExportFields {
  id: boolean;
  type: boolean;
  amount: boolean;
  description: boolean;
  category: boolean;
  date: boolean;
  related_work_order_id: boolean;
  created_at: boolean;
}

export function useFinanceExport(transactions: FinancialTransaction[]) {
  const [format, setFormat] = useState("csv");
  const [includeFields, setIncludeFields] = useState<ExportFields>({
    id: true,
    type: true,
    amount: true,
    description: true,
    category: true,
    date: true,
    related_work_order_id: true,
    created_at: false,
  });

  const toggleField = (field: keyof ExportFields) => {
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
      
      Object.keys(includeFields).forEach((key) => {
        if (includeFields[key as keyof ExportFields]) {
          let value = transaction[key as keyof FinancialTransaction];
          
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
  };

  return {
    format,
    setFormat,
    includeFields,
    toggleField,
    exportData
  };
}
