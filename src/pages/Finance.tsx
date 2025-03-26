
import React from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { TransactionsTable } from "@/components/finance/TransactionsTable";
import { FinancialSummaryCards } from "@/components/finance/FinancialSummaryCards";
import { RevenueChart } from "@/components/finance/RevenueChart";
import { TransactionForm } from "@/components/finance/TransactionForm";
import { FinanceFilters } from "@/components/finance/FinanceFilters";
import { FinanceActions } from "@/components/finance/FinanceActions";
import { useFinanceData } from "@/hooks/useFinanceData";

const Finance: React.FC = () => {
  const {
    currentSummary,
    filteredTransactions,
    isLoadingTransactions,
    isLoadingSummaries,
    summaries,
    filters,
    setFilters,
    isFormOpen,
    setIsFormOpen,
    formType,
    handleAddTransaction,
    handleDeleteTransaction,
    handleAddRevenue,
    handleAddExpense
  } = useFinanceData();

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
          <FinanceActions 
            onAddRevenue={handleAddRevenue}
            onAddExpense={handleAddExpense}
            filteredTransactions={filteredTransactions}
          />
          
          {/* Filters */}
          <FinanceFilters 
            filters={filters} 
            setFilters={setFilters} 
          />
          
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
