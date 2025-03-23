
import { supabase } from '@/integrations/supabase/client';

export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
  avatar?: string;
}

// Helper function to convert from Supabase format to our app format
const mapCustomer = (item: any): Customer => ({
  id: item.id.toString(), // Convert to string to maintain consistent API
  name: item.name || '',
  company: item.company || '',
  email: item.email || '',
  phone: item.phone || '',
  totalOrders: item.total_orders || 0,
  totalSpent: item.total_spent || 0,
  lastOrder: item.last_order || '',
  avatar: item.avatar || undefined
});

export async function fetchCustomers(): Promise<Customer[]> {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*');
    
    if (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
    
    // Map the data from snake_case (database) to camelCase (frontend)
    return (data || []).map(mapCustomer);
  } catch (error) {
    console.error('Failed to fetch customers:', error);
    return [];
  }
}

export async function addCustomer(customer: Omit<Customer, 'id'>): Promise<Customer | null> {
  try {
    // Convert from camelCase (frontend) to snake_case (database)
    const dbCustomer = {
      name: customer.name,
      company: customer.company,
      email: customer.email,
      phone: customer.phone,
      total_orders: customer.totalOrders || 0,
      total_spent: customer.totalSpent || 0,
      last_order: customer.lastOrder || new Date().toISOString().split('T')[0]
    };

    const { data, error } = await supabase
      .from('customers')
      .insert(dbCustomer)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error adding customer:', error);
      throw error;
    }
    
    return mapCustomer(data);
  } catch (error) {
    console.error('Failed to add customer:', error);
    return null;
  }
}

export async function deleteCustomer(id: string): Promise<boolean> {
  try {
    // Convert string id to number since the database expects a number type
    const numericId = parseInt(id, 10);
    
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', numericId);
    
    if (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to delete customer:', error);
    return false;
  }
}
