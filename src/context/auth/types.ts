
import { Session, User } from "@supabase/supabase-js";

export type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: "admin" | "employee";
  department: string | null;
  phone: string | null;
  avatar_url: string | null;
};

export type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string, role?: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  refreshProfile: () => Promise<void>;
};
