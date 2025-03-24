
import { supabase } from '@/integrations/supabase/client';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  status: "available" | "busy" | "offsite" | "leave";
  avatar?: string;
}

// Helper function to convert from Supabase format to our app format
const mapTeamMember = (item: any): TeamMember => ({
  id: item.id.toString(),
  name: item.name || '',
  role: item.role || '',
  department: item.department || '',
  email: item.email || '',
  phone: item.phone || '',
  status: item.status || 'available',
  avatar: item.avatar || undefined
});

export async function fetchTeamMembers(): Promise<TeamMember[]> {
  try {
    const { data, error } = await supabase
      .from('team')
      .select('*');
    
    if (error) {
      console.error('Error fetching team members:', error);
      throw error;
    }
    
    return (data || []).map(mapTeamMember);
  } catch (error) {
    console.error('Failed to fetch team members:', error);
    return [];
  }
}

export async function addTeamMember(member: Omit<TeamMember, 'id'>): Promise<TeamMember | null> {
  try {
    // Convert from camelCase (frontend) to snake_case (database)
    const dbMember = {
      name: member.name,
      role: member.role,
      department: member.department,
      email: member.email,
      phone: member.phone,
      status: member.status,
      avatar: member.avatar
    };

    console.log('Adding team member with data:', dbMember);

    const { data, error } = await supabase
      .from('team')
      .insert(dbMember)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error adding team member:', error);
      throw error;
    }
    
    console.log('Successfully added team member:', data);
    return mapTeamMember(data);
  } catch (error) {
    console.error('Failed to add team member:', error);
    return null;
  }
}

export async function updateTeamMemberStatus(id: string, status: TeamMember['status']): Promise<boolean> {
  try {
    // Convert string id to number since the database expects a number type
    const numericId = parseInt(id, 10);
    
    const { error } = await supabase
      .from('team')
      .update({ status })
      .eq('id', numericId);
    
    if (error) {
      console.error('Error updating team member status:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to update team member status:', error);
    return false;
  }
}

export async function deleteTeamMember(id: string): Promise<boolean> {
  try {
    // Convert string id to number since the database expects a number type
    const numericId = parseInt(id, 10);
    
    const { error } = await supabase
      .from('team')
      .delete()
      .eq('id', numericId);
    
    if (error) {
      console.error('Error deleting team member:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to delete team member:', error);
    return false;
  }
}
