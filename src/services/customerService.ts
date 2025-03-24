
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
}

// Helper function to convert from Supabase format to our app format
const mapCustomer = (item: any): Customer => ({
  id: item.id.toString(),
  name: item.name || '',
  company: item.company || '',
  email: item.email || '',
  phone: item.phone || '',
  totalOrders: item.total_orders || 0,
  totalSpent: item.total_spent || 0,
  lastOrder: item.last_order || new Date().toISOString().split('T')[0]
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
      total_orders: customer.totalOrders,
      total_spent: customer.totalSpent,
      last_order: customer.lastOrder
    };

    console.log('Adding customer with data:', dbCustomer);

    const { data, error } = await supabase
      .from('customers')
      .insert(dbCustomer)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error adding customer:', error);
      throw error;
    }
    
    console.log('Successfully added customer:', data);
    return mapCustomer(data);
  } catch (error) {
    console.error('Failed to add customer:', error);
    return null;
  }
}

export async function deleteCustomer(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting customer:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to delete customer:', error);
    return false;
  }
}
