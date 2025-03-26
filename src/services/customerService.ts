
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
  address?: string;
  pic_name?: string;
  contract_value?: number;
  contract_start_date?: string;
  contract_end_date?: string;
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
  lastOrder: item.last_order || new Date().toISOString().split('T')[0],
  address: item.address || '',
  pic_name: item.pic_name || '',
  contract_value: item.contract_value || 0,
  contract_start_date: item.contract_start_date || '',
  contract_end_date: item.contract_end_date || ''
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
      last_order: customer.lastOrder,
      address: customer.address,
      pic_name: customer.pic_name,
      contract_value: customer.contract_value,
      contract_start_date: customer.contract_start_date,
      contract_end_date: customer.contract_end_date
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
    // Convert string id to number since the database expects a number type
    const numericId = parseInt(id, 10);
    
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', numericId);
    
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

export async function getCustomerDetails(id: string): Promise<Customer | null> {
  try {
    const numericId = parseInt(id, 10);
    
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', numericId)
      .single();
      
    if (error) {
      console.error('Error fetching customer details:', error);
      throw error;
    }
    
    return data ? mapCustomer(data) : null;
  } catch (error) {
    console.error('Failed to fetch customer details:', error);
    return null;
  }
}

export async function updateCustomer(id: string, customer: Partial<Customer>): Promise<Customer | null> {
  try {
    const numericId = parseInt(id, 10);
    
    // Convert from camelCase to snake_case
    const dbCustomer: any = {};
    if (customer.name !== undefined) dbCustomer.name = customer.name;
    if (customer.company !== undefined) dbCustomer.company = customer.company;
    if (customer.email !== undefined) dbCustomer.email = customer.email;
    if (customer.phone !== undefined) dbCustomer.phone = customer.phone;
    if (customer.totalOrders !== undefined) dbCustomer.total_orders = customer.totalOrders;
    if (customer.totalSpent !== undefined) dbCustomer.total_spent = customer.totalSpent;
    if (customer.lastOrder !== undefined) dbCustomer.last_order = customer.lastOrder;
    if (customer.address !== undefined) dbCustomer.address = customer.address;
    if (customer.pic_name !== undefined) dbCustomer.pic_name = customer.pic_name;
    if (customer.contract_value !== undefined) dbCustomer.contract_value = customer.contract_value;
    if (customer.contract_start_date !== undefined) dbCustomer.contract_start_date = customer.contract_start_date;
    if (customer.contract_end_date !== undefined) dbCustomer.contract_end_date = customer.contract_end_date;

    const { data, error } = await supabase
      .from('customers')
      .update(dbCustomer)
      .eq('id', numericId)
      .select('*')
      .single();
      
    if (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
    
    return mapCustomer(data);
  } catch (error) {
    console.error('Failed to update customer:', error);
    return null;
  }
}

export interface CustomerDocument {
  id: string;
  customer_id: string; // Changed from number to string to match the interface
  file_name: string;
  file_path: string;
  uploaded_at: string;
  document_type: string;
}

export async function uploadContractDocument(
  customerId: string,
  file: File,
  documentType: string
): Promise<CustomerDocument | null> {
  try {
    const numericId = parseInt(customerId, 10);
    const filePath = `${numericId}/${Date.now()}_${file.name}`;
    
    // Upload file to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('customer_contracts')
      .upload(filePath, file);
      
    if (uploadError) {
      console.error('Error uploading contract document:', uploadError);
      throw uploadError;
    }
    
    // Create database record
    const { data, error } = await supabase
      .from('customer_documents')
      .insert({
        customer_id: numericId,
        file_name: file.name,
        file_path: filePath,
        document_type: documentType
      })
      .select('*')
      .single();
      
    if (error) {
      console.error('Error adding document record:', error);
      throw error;
    }
    
    // Konversi customer_id menjadi string sebelum dikembalikan ke aplikasi
    return {
      ...data,
      customer_id: data.customer_id.toString()
    } as CustomerDocument;
  } catch (error) {
    console.error('Failed to upload contract document:', error);
    return null;
  }
}

export async function getCustomerDocuments(customerId: string): Promise<CustomerDocument[]> {
  try {
    const numericId = parseInt(customerId, 10);
    
    const { data, error } = await supabase
      .from('customer_documents')
      .select('*')
      .eq('customer_id', numericId);
      
    if (error) {
      console.error('Error fetching customer documents:', error);
      throw error;
    }
    
    // Konversi semua customer_id menjadi string
    return (data || []).map(doc => ({
      ...doc,
      customer_id: doc.customer_id.toString()
    })) as CustomerDocument[];
  } catch (error) {
    console.error('Failed to fetch customer documents:', error);
    return [];
  }
}

export async function getDocumentUrl(filePath: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from('customer_contracts')
      .createSignedUrl(filePath, 60 * 60); // 1 hour expiry
      
    if (error) {
      console.error('Error getting document URL:', error);
      throw error;
    }
    
    return data.signedUrl;
  } catch (error) {
    console.error('Failed to get document URL:', error);
    return null;
  }
}

export async function deleteDocument(documentId: string): Promise<boolean> {
  try {
    // First get the document to get the file path
    const { data: document, error: fetchError } = await supabase
      .from('customer_documents')
      .select('file_path')
      .eq('id', documentId)
      .single();
      
    if (fetchError) {
      console.error('Error fetching document:', fetchError);
      throw fetchError;
    }
    
    // Delete the file from storage
    const { error: storageError } = await supabase.storage
      .from('customer_contracts')
      .remove([document.file_path]);
      
    if (storageError) {
      console.error('Error deleting file from storage:', storageError);
      throw storageError;
    }
    
    // Delete the record from the database
    const { error } = await supabase
      .from('customer_documents')
      .delete()
      .eq('id', documentId);
      
    if (error) {
      console.error('Error deleting document record:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to delete document:', error);
    return false;
  }
}
