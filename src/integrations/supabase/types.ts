export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      customers: {
        Row: {
          company: string | null
          created_at: string
          email: string | null
          id: number
          last_order: string | null
          name: string | null
          phone: string | null
          total_orders: number | null
          total_spent: number | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email?: string | null
          id?: number
          last_order?: string | null
          name?: string | null
          phone?: string | null
          total_orders?: number | null
          total_spent?: number | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string | null
          id?: number
          last_order?: string | null
          name?: string | null
          phone?: string | null
          total_orders?: number | null
          total_spent?: number | null
        }
        Relationships: []
      }
      inventory: {
        Row: {
          category: string
          current_stock: number
          id: string
          last_restocked: string | null
          location: string
          min_stock: number
          name: string
          sku: string
          unit_price: number
        }
        Insert: {
          category: string
          current_stock?: number
          id?: string
          last_restocked?: string | null
          location: string
          min_stock?: number
          name: string
          sku: string
          unit_price?: number
        }
        Update: {
          category?: string
          current_stock?: number
          id?: string
          last_restocked?: string | null
          location?: string
          min_stock?: number
          name?: string
          sku?: string
          unit_price?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          department: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          role?: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      project: {
        Row: {
          assigned_to: string | null
          created_at: string
          customer: string | null
          due_date: string | null
          id: number
          status: string | null
          type: string | null
          work_order_number: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          customer?: string | null
          due_date?: string | null
          id?: number
          status?: string | null
          type?: string | null
          work_order_number?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          customer?: string | null
          due_date?: string | null
          id?: number
          status?: string | null
          type?: string | null
          work_order_number?: string | null
        }
        Relationships: []
      }
      team: {
        Row: {
          avatar: string | null
          created_at: string
          department: string | null
          email: string | null
          id: number
          name: string | null
          phone: string | null
          role: string | null
          status: string | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          id?: number
          name?: string | null
          phone?: string | null
          role?: string | null
          status?: string | null
        }
        Update: {
          avatar?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          id?: number
          name?: string | null
          phone?: string | null
          role?: string | null
          status?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: {
          user_id: string
        }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      min_stock_fn: {
        Args: {
          row_id: string
        }
        Returns: number
      }
    }
    Enums: {
      user_role: "admin" | "employee"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
