
import { supabase } from '@/integrations/supabase/client';
import { InventoryItem } from '@/components/inventory/inventoryUtils';

// Helper function to convert from Supabase format to our app format
const mapInventoryItem = (item: any): InventoryItem => ({
  id: item.id,
  sku: item.sku,
  name: item.name,
  category: item.category,
  currentStock: item.current_stock,
  minStock: item.min_stock,
  lastRestocked: item.last_restocked,
  location: item.location,
  unitPrice: item.unit_price
});

export async function fetchInventoryItems(): Promise<InventoryItem[]> {
  try {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*');
    
    if (error) {
      console.error('Error fetching inventory items:', error);
      throw error;
    }
    
    // Map the data from snake_case (database) to camelCase (frontend)
    return (data || []).map(mapInventoryItem);
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
      .lt('current_stock', 'min_stock');
    
    if (error) {
      console.error('Error fetching low stock items:', error);
      throw error;
    }
    
    // Map the data from snake_case (database) to camelCase (frontend)
    return (data || []).map(mapInventoryItem);
  } catch (error) {
    console.error('Failed to fetch low stock items:', error);
    return [];
  }
}
