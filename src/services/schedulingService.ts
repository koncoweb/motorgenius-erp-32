
import { supabase } from '@/integrations/supabase/client';

export interface ScheduleItem {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  work_order_id: number | null;
  team_member_id: number | null;
  status: string;
  location: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Helper function to convert from Supabase format to our app format
const mapScheduleItem = (item: any): ScheduleItem => ({
  id: item.id,
  title: item.title || '',
  description: item.description || null,
  start_time: item.start_time || '',
  end_time: item.end_time || '',
  work_order_id: item.work_order_id || null,
  team_member_id: item.team_member_id || null,
  status: item.status || 'scheduled',
  location: item.location || null,
  notes: item.notes || null,
  created_at: item.created_at || '',
  updated_at: item.updated_at || '',
});

export async function fetchScheduleItems(): Promise<ScheduleItem[]> {
  try {
    const { data, error } = await supabase
      .from('scheduling')
      .select('*')
      .order('start_time', { ascending: true });
    
    if (error) {
      console.error('Error fetching schedule items:', error);
      throw error;
    }
    
    return (data || []).map(mapScheduleItem);
  } catch (error) {
    console.error('Failed to fetch schedule items:', error);
    return [];
  }
}

export async function addScheduleItem(item: Omit<ScheduleItem, 'id' | 'created_at' | 'updated_at'>): Promise<ScheduleItem | null> {
  try {
    console.log('Adding schedule item with data:', item);

    const { data, error } = await supabase
      .from('scheduling')
      .insert(item)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error adding schedule item:', error);
      throw error;
    }
    
    console.log('Successfully added schedule item:', data);
    return mapScheduleItem(data);
  } catch (error) {
    console.error('Failed to add schedule item:', error);
    return null;
  }
}

export async function updateScheduleItem(id: string, updates: Partial<Omit<ScheduleItem, 'id' | 'created_at'>>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('scheduling')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating schedule item:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to update schedule item:', error);
    return false;
  }
}

export async function deleteScheduleItem(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('scheduling')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting schedule item:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to delete schedule item:', error);
    return false;
  }
}
