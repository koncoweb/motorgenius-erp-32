
import { supabase } from "@/integrations/supabase/client";

export interface FinancialTransaction {
  id: string;
  type: 'revenue' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  related_work_order_id: number | null;
  created_at: string;
}

export interface FinancialSummary {
  month: string;
  total_revenue: number;
  total_expenses: number;
  net_income: number;
}

export async function fetchTransactions(): Promise<FinancialTransaction[]> {
  const { data, error } = await supabase
    .from('financial_transactions')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }

  // Validate and convert the type property to ensure it matches our union type
  return (data || []).map(item => ({
    ...item,
    type: item.type === 'revenue' ? 'revenue' : 'expense'
  } as FinancialTransaction));
}

export async function fetchSummaries(): Promise<FinancialSummary[]> {
  const { data, error } = await supabase
    .from('financial_summaries')
    .select('*');

  if (error) {
    console.error('Error fetching summaries:', error);
    throw error;
  }

  return data || [];
}

export async function addTransaction(transaction: Omit<FinancialTransaction, 'id' | 'created_at'>): Promise<FinancialTransaction> {
  const { data, error } = await supabase
    .from('financial_transactions')
    .insert(transaction)
    .select()
    .single();

  if (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }

  // Ensure the returned data has the correct type format
  return {
    ...data,
    type: data.type === 'revenue' ? 'revenue' : 'expense'
  } as FinancialTransaction;
}

export async function deleteTransaction(id: string): Promise<void> {
  const { error } = await supabase
    .from('financial_transactions')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
}

export const transactionCategories = {
  revenue: ['Service', 'Parts', 'Consultation', 'Other'],
  expense: ['Parts', 'Tools', 'Utilities', 'Rent', 'Payroll', 'Marketing', 'Other']
};
