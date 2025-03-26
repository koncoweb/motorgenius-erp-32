
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";
import { ExportFinanceData } from "./ExportFinanceData";
import { FinancialTransaction } from "@/services/financeService";

interface FinanceActionsProps {
  onAddRevenue: () => void;
  onAddExpense: () => void;
  filteredTransactions: FinancialTransaction[];
}

export function FinanceActions({ 
  onAddRevenue, 
  onAddExpense, 
  filteredTransactions 
}: FinanceActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h2 className="text-2xl font-bold tracking-tight">Transactions</h2>
      <div className="flex gap-2">
        <Button 
          variant="default" 
          size="sm" 
          onClick={onAddRevenue}
          className="gap-1"
        >
          <ArrowUp className="h-4 w-4" />
          Add Revenue
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onAddExpense}
          className="gap-1"
        >
          <ArrowDown className="h-4 w-4" />
          Add Expense
        </Button>
        <ExportFinanceData transactions={filteredTransactions} />
      </div>
    </div>
  );
}
