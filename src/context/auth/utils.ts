
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "./types";

// Function to fetch profile data
export const fetchProfile = async (userId: string): Promise<Profile | null> => {
  try {
    console.log("Fetching profile for user:", userId);
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
      return data as Profile;
    }
  } catch (error) {
    console.error('Exception fetching profile:', error);
    return null;
  }
};
