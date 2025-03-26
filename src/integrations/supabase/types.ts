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
      analytics_metrics: {
        Row: {
          created_at: string
          id: string
          metric_category: string
          metric_date: string
          metric_name: string
          metric_value: number
          source_page: string
        }
        Insert: {
          created_at?: string
          id?: string
          metric_category: string
          metric_date?: string
          metric_name: string
          metric_value: number
          source_page: string
        }
        Update: {
          created_at?: string
          id?: string
          metric_category?: string
          metric_date?: string
          metric_name?: string
          metric_value?: number
          source_page?: string
        }
        Relationships: []
      }
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
      financial_transactions: {
        Row: {
          amount: number
          category: string | null
          created_at: string | null
          date: string
          description: string | null
          id: string
          related_work_order_id: number | null
          type: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          related_work_order_id?: number | null
          type: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          related_work_order_id?: number | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_transactions_related_work_order_id_fkey"
            columns: ["related_work_order_id"]
            isOneToOne: false
            referencedRelation: "project"
            referencedColumns: ["id"]
          },
        ]
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
      notifications: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          notification_type: string
          title: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          notification_type: string
          title: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          notification_type?: string
          title?: string
          user_id?: string | null
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
      quality_check_results: {
        Row: {
          comments: string | null
          created_at: string
          id: string
          passed: boolean
          quality_check_id: string
          standard_id: string
        }
        Insert: {
          comments?: string | null
          created_at?: string
          id?: string
          passed: boolean
          quality_check_id: string
          standard_id: string
        }
        Update: {
          comments?: string | null
          created_at?: string
          id?: string
          passed?: boolean
          quality_check_id?: string
          standard_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quality_check_results_quality_check_id_fkey"
            columns: ["quality_check_id"]
            isOneToOne: false
            referencedRelation: "quality_checks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quality_check_results_standard_id_fkey"
            columns: ["standard_id"]
            isOneToOne: false
            referencedRelation: "quality_standards"
            referencedColumns: ["id"]
          },
        ]
      }
      quality_checks: {
        Row: {
          action_items: string | null
          created_at: string
          id: string
          inspection_date: string
          inspector: string
          notes: string | null
          rating: number | null
          status: string
          updated_at: string
          work_order_id: number | null
        }
        Insert: {
          action_items?: string | null
          created_at?: string
          id?: string
          inspection_date?: string
          inspector: string
          notes?: string | null
          rating?: number | null
          status: string
          updated_at?: string
          work_order_id?: number | null
        }
        Update: {
          action_items?: string | null
          created_at?: string
          id?: string
          inspection_date?: string
          inspector?: string
          notes?: string | null
          rating?: number | null
          status?: string
          updated_at?: string
          work_order_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quality_checks_work_order_id_fkey"
            columns: ["work_order_id"]
            isOneToOne: false
            referencedRelation: "project"
            referencedColumns: ["id"]
          },
        ]
      }
      quality_standards: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      scheduling: {
        Row: {
          created_at: string | null
          description: string | null
          end_time: string
          id: string
          location: string | null
          notes: string | null
          start_time: string
          status: string | null
          team_member_id: number | null
          title: string
          updated_at: string | null
          work_order_id: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_time: string
          id?: string
          location?: string | null
          notes?: string | null
          start_time: string
          status?: string | null
          team_member_id?: number | null
          title: string
          updated_at?: string | null
          work_order_id?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_time?: string
          id?: string
          location?: string | null
          notes?: string | null
          start_time?: string
          status?: string | null
          team_member_id?: number | null
          title?: string
          updated_at?: string | null
          work_order_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "scheduling_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "team"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduling_work_order_id_fkey"
            columns: ["work_order_id"]
            isOneToOne: false
            referencedRelation: "project"
            referencedColumns: ["id"]
          },
        ]
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
      financial_summaries: {
        Row: {
          month: string | null
          net_income: number | null
          total_expenses: number | null
          total_revenue: number | null
        }
        Relationships: []
      }
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
