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
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string | null
          description: string
          id: string
          photo_url: string
          type: Database["public"]["Enums"]["report_type"]
          user_id: string
          visit_purpose: string | null
          visitor_name: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          photo_url: string
          type: Database["public"]["Enums"]["report_type"]
          user_id: string
          visit_purpose?: string | null
          visitor_name?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          photo_url?: string
          type?: Database["public"]["Enums"]["report_type"]
          user_id?: string
          visit_purpose?: string | null
          visitor_name?: string | null
        }
        Relationships: []
      }
      vehicle_reports: {
        Row: {
          car_images: string[]
          car_model: string
          condition: string
          created_at: string
          id: string
          mileage: number
          mileage_image: string
          plate_number: string
          project: string
          user_id: string
        }
        Insert: {
          car_images: string[]
          car_model: string
          condition: string
          created_at?: string
          id?: string
          mileage: number
          mileage_image: string
          plate_number: string
          project: string
          user_id: string
        }
        Update: {
          car_images?: string[]
          car_model?: string
          condition?: string
          created_at?: string
          id?: string
          mileage?: number
          mileage_image?: string
          plate_number?: string
          project?: string
          user_id?: string
        }
        Relationships: []
      }
      visits: {
        Row: {
          created_at: string | null
          id: string
          status: Database["public"]["Enums"]["visit_status"]
          user_id: string
          visit_date: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          status: Database["public"]["Enums"]["visit_status"]
          user_id: string
          visit_date?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          status?: Database["public"]["Enums"]["visit_status"]
          user_id?: string
          visit_date?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_monthly_visits: {
        Args: {
          user_id: string
        }
        Returns: {
          status: Database["public"]["Enums"]["visit_status"]
          count: number
        }[]
      }
      get_report_counts: {
        Args: {
          p_user_id: string
          p_start_date: string
          p_end_date: string
        }
        Returns: {
          report_type: Database["public"]["Enums"]["report_type"]
          count: number
        }[]
      }
      get_weekly_visits: {
        Args: {
          user_id: string
        }
        Returns: {
          status: Database["public"]["Enums"]["visit_status"]
          count: number
        }[]
      }
    }
    Enums: {
      report_type:
        | "supervisor_weekly"
        | "manager_monthly"
        | "visitor_log"
        | "vehicle_handover"
        | "full_monthly"
      visit_status: "completed" | "pending" | "missed" | "other"
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
