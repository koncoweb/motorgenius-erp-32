
import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { TransactionsTable } from "@/components/finance/TransactionsTable";
import { FinancialSummaryCards } from "@/components/finance/FinancialSummaryCards";
import { RevenueChart } from "@/components/finance/RevenueChart";
import { TransactionForm } from "@/components/finance/TransactionForm";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { PlusCircle, TrendingUp, ArrowDown, ArrowUp, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  fetchTransactions, 
  fetchSummaries, 
  addTransaction, 
  deleteTransaction,
  FinancialTransaction,
  FinancialSummary
} from "@/services/financeService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Finance: React.FC = () => {
  const { toast: hookToast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState<'revenue' | 'expense'>('revenue');
  const [filters, setFilters] = useState({
    type: "all",
    search: "",
  });

  // Fetch transactions and summaries
  const { 
    data: transactions = [], 
    isLoading: isLoadingTransactions 
  } = useQuery({
    queryKey: ['financialTransactions'],
    queryFn: fetchTransactions,
  });

  const { 
    data: summaries = [], 
    isLoading: isLoadingSummaries 
  } = useQuery({
    queryKey: ['financialSummaries'],
    queryFn: fetchSummaries,
  });

  // Add transaction mutation
  const addTransactionMutation = useMutation({
    mutationFn: addTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financialTransactions'] });
      queryClient.invalidateQueries({ queryKey: ['financialSummaries'] });
      toast.success("Transaction added successfully");
      setIsFormOpen(false);
    },
    onError: (error) => {
      console.error('Error adding transaction:', error);
      hookToast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add transaction."
      });
    }
  });

  // Delete transaction mutation
  const deleteTransactionMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financialTransactions'] });
      queryClient.invalidateQueries({ queryKey: ['financialSummaries'] });
      toast.success("Transaction deleted successfully");
    },
    onError: (error) => {
      console.error('Error deleting transaction:', error);
      hookToast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete transaction."
      });
    }
  });

  // Filter transactions
  const filteredTransactions = React.useMemo(() => {
    return transactions.filter((transaction) => {
      // Filter by type
      if (filters.type !== "all" && transaction.type !== filters.type) {
        return false;
      }
      
      // Filter by search term
      if (filters.search && !transaction.description.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }, [transactions, filters]);

  // Current month summary (first item in the summaries array)
  const currentSummary = summaries.length > 0 ? summaries[0] : null;

  // Handle adding a transaction
  const handleAddTransaction = (data: any) => {
    addTransactionMutation.mutate(data);
  };

  // Handle deleting a transaction
  const handleDeleteTransaction = (id: string) => {
    deleteTransactionMutation.mutate(id);
  };

  // Handle opening form for revenue
  const handleAddRevenue = () => {
    setFormType('revenue');
    setIsFormOpen(true);
  };

  // Handle opening form for expense
  const handleAddExpense = () => {
    setFormType('expense');
    setIsFormOpen(true);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  // Handle type filter change
  const handleTypeFilterChange = (value: string) => {
    setFilters(prev => ({ ...prev, type: value }));
  };

  return (
    <Layout>
      <PageHeader
        title="Finance"
        description="Track revenue, expenses, and financial performance."
      />
      
      <div className="space-y-6">
        {/* Financial Summary Cards */}
        <FinancialSummaryCards 
          summary={currentSummary} 
          isLoading={isLoadingSummaries} 
        />
        
        {/* Revenue Chart */}
        <RevenueChart 
          data={summaries} 
          isLoading={isLoadingSummaries} 
        />
        
        {/* Transactions */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-2xl font-bold tracking-tight">Transactions</h2>
            <div className="flex gap-2">
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleAddRevenue}
                className="gap-1"
              >
                <ArrowUp className="h-4 w-4" />
                Add Revenue
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleAddExpense}
                className="gap-1"
              >
                <ArrowDown className="h-4 w-4" />
                Add Expense
              </Button>
            </div>
          </div>
          
          {/* Filters */}
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
          
          {/* Transactions Table */}
          <TransactionsTable 
            transactions={filteredTransactions} 
            onDelete={handleDeleteTransaction}
            isLoading={isLoadingTransactions}
          />
        </div>
      </div>
      
      {/* Transaction Form Dialog */}
      <TransactionForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddTransaction}
        defaultType={formType}
      />
    </Layout>
  );
};

export default Finance;
