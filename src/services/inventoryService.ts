
import { supabase } from '@/integrations/supabase/client';
import { InventoryItem } from '@/components/inventory/inventoryUtils';

export async function fetchInventoryItems(): Promise<InventoryItem[]> {
  try {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*');
    
    if (error) {
      console.error('Error fetching inventory items:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Failed to fetch inventory items:', error);
    return [];
  }
}

export async function getLowStockItems(): Promise<InventoryItem[]> {
  try {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .lt('current_stock', supabase.raw('min_stock'));
    
    if (error) {
      console.error('Error fetching low stock items:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Failed to fetch low stock items:', error);
    return [];
  }
}
