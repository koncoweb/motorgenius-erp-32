
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
      .from('inventory')
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
    // Fixed query: use a where clause comparing current_stock and min_stock columns
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .lt('current_stock', supabase.rpc('min_stock_fn', { row_id: 'id' }));
    
    if (error) {
      console.error('Error fetching low stock items:', error);
      
      // Fallback to client-side filtering if server-side filtering fails
      const { data: allItems, error: allItemsError } = await supabase
        .from('inventory')
        .select('*');
        
      if (allItemsError) {
        console.error('Error fetching all inventory items:', allItemsError);
        return [];
      }
      
      // Filter low stock items on the client side
      const lowStockItems = allItems.filter(item => item.current_stock < item.min_stock);
      return lowStockItems.map(mapInventoryItem);
    }
    
    // Map the data from snake_case (database) to camelCase (frontend)
    return (data || []).map(mapInventoryItem);
  } catch (error) {
    console.error('Failed to fetch low stock items:', error);
    return [];
  }
}

// Function to add inventory item with proper type checking
export async function addInventoryItem(item: Omit<InventoryItem, 'id'>): Promise<InventoryItem | null> {
  try {
    // Convert from camelCase (frontend) to snake_case (database)
    const dbItem = {
      sku: item.sku,
      name: item.name,
      category: item.category,
      current_stock: item.currentStock,
      min_stock: item.minStock,
      last_restocked: item.lastRestocked,
      location: item.location,
      unit_price: item.unitPrice
    };

    console.log('Adding inventory item:', dbItem);

    const { data, error } = await supabase
      .from('inventory')
      .insert(dbItem)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error adding inventory item:', error);
      throw error;
    }
    
    console.log('Successfully added inventory item:', data);
    return mapInventoryItem(data);
  } catch (error) {
    console.error('Failed to add inventory item:', error);
    return null;
  }
}

// Function to update inventory item stock
export async function updateInventoryItemStock(id: string, newStock: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('inventory')
      .update({ current_stock: newStock, last_restocked: new Date().toISOString() })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating inventory item stock:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to update inventory item stock:', error);
    return false;
  }
}
