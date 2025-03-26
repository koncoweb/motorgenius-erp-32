
import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";
import { 
  fetchTransactions, 
  fetchSummaries, 
  addTransaction, 
  deleteTransaction,
  FinancialTransaction,
  FinancialSummary
} from "@/services/financeService";

export function useFinanceData() {
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
  const filteredTransactions = useMemo(() => {
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

  return {
    transactions,
    summaries,
    currentSummary,
    filteredTransactions,
    isLoadingTransactions,
    isLoadingSummaries,
    filters,
    setFilters,
    isFormOpen,
    setIsFormOpen,
    formType,
    handleAddTransaction,
    handleDeleteTransaction,
    handleAddRevenue,
    handleAddExpense
  };
}
