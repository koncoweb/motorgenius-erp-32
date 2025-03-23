
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "./types";

// Function to fetch profile data
export const fetchProfile = async (userId: string): Promise<Profile | null> => {
  try {
    console.log("Fetching profile for user:", userId);
    
    // Using a typed query with proper casting
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    } else {
      console.log("Profile data retrieved:", data);
      
      // Map the data to our Profile type
      const profile: Profile = {
        id: data.id,
        first_name: data.first_name,
        last_name: data.last_name,
        role: data.role as "admin" | "employee",
        department: data.department,
        phone: data.phone,
        avatar_url: data.avatar_url
      };
      
      return profile;
    }
  } catch (error) {
    console.error('Exception fetching profile:', error);
    return null;
  }
};
