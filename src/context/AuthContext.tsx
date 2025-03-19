
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { toast } from "sonner";

type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: "admin" | "employee";
  department: string | null;
  phone: string | null;
  avatar_url: string | null;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Function to fetch profile data
  const fetchProfile = async (userId: string) => {
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

  useEffect(() => {
    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        console.log("Auth state changed:", _event, newSession?.user?.id);
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (newSession?.user) {
          const profileData = await fetchProfile(newSession.user.id);
          setProfile(profileData);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Initial session check
    const initializeAuth = async () => {
      try {
        console.log("Initializing auth...");
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Initial session:", session?.user?.id);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const profileData = await fetchProfile(session.user.id);
          setProfile(profileData);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Signing in with email:", email);
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        console.error("Sign in error:", error);
        throw error;
      }
      
      console.log("Sign in successful, user:", data.user?.id);
      
      if (data.user) {
        try {
          const profileData = await fetchProfile(data.user.id);
          setProfile(profileData);
        } catch (profileError) {
          console.error("Error fetching profile after sign in:", profileError);
          // Continue with login even if profile fetch fails
        }
      }
      
      navigate('/');
      return;
    } catch (error: any) {
      console.error("Exception during sign in:", error);
      toast.error(error.message || "Failed to sign in");
      throw error;
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email, 
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role: 'employee' // Default role for new sign-ups
          }
        }
      });
      
      if (error) throw error;
      toast.success("Account created successfully! You can now sign in.");
      navigate('/auth/login');
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
      toast.success("Logged out successfully");
      navigate('/auth/login');
    } catch (error: any) {
      toast.error(error.message || "Failed to sign out");
    }
  };

  const isAdmin = profile?.role === 'admin';

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      profile,
      loading,
      signIn, 
      signUp, 
      signOut,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
