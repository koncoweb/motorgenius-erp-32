
import { supabase } from '@/integrations/supabase/client';

export interface WorkOrder {
  id: string;
  workOrderNumber: string;
  customer: string;
  type: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  assignedTo: string;
  dueDate: string;
}

// Helper function to convert from Supabase format to our app format
const mapWorkOrder = (item: any): WorkOrder => ({
  id: item.id.toString(),
  workOrderNumber: item.work_order_number || '',
  customer: item.customer || '',
  type: item.type || '',
  status: item.status || 'pending',
  assignedTo: item.assigned_to || '',
  dueDate: item.due_date || ''
});

export async function fetchWorkOrders(): Promise<WorkOrder[]> {
  try {
    const { data, error } = await supabase
      .from('project')
      .select('*');
    
    if (error) {
      console.error('Error fetching work orders:', error);
      throw error;
    }
    
    return (data || []).map(mapWorkOrder);
  } catch (error) {
    console.error('Failed to fetch work orders:', error);
    return [];
  }
}

export async function addWorkOrder(workOrder: Omit<WorkOrder, 'id'>): Promise<WorkOrder | null> {
  try {
    // Convert from camelCase (frontend) to snake_case (database)
    const dbWorkOrder = {
      work_order_number: workOrder.workOrderNumber,
      customer: workOrder.customer,
      type: workOrder.type,
      status: workOrder.status,
      assigned_to: workOrder.assignedTo,
      due_date: workOrder.dueDate
    };

    console.log('Adding work order with data:', dbWorkOrder);

    const { data, error } = await supabase
      .from('project')
      .insert(dbWorkOrder)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error adding work order:', error);
      throw error;
    }
    
    console.log('Successfully added work order:', data);
    return mapWorkOrder(data);
  } catch (error) {
    console.error('Failed to add work order:', error);
    return null;
  }
}

export async function updateWorkOrderStatus(id: string, status: WorkOrder['status']): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('project')
      .update({ status })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating work order status:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to update work order status:', error);
    return false;
  }
}

export async function deleteWorkOrder(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('project')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting work order:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to delete work order:', error);
    return false;
  }
}
