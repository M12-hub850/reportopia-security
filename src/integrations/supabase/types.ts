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
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          report_id: string | null
          title: string
          type: string
          user_id: string
          vehicle_report_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          report_id?: string | null
          title: string
          type: string
          user_id: string
          vehicle_report_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          report_id?: string | null
          title?: string
          type?: string
          user_id?: string
          vehicle_report_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
          preferred_language: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          preferred_language?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          preferred_language?: string | null
        }
        Relationships: []
      }
      report_files: {
        Row: {
          created_at: string | null
          file_name: string
          file_path: string
          id: string
          report_id: string | null
          report_type: string
          user_id: string
          vehicle_report_id: string | null
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_path: string
          id?: string
          report_id?: string | null
          report_type: string
          user_id: string
          vehicle_report_id?: string | null
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_path?: string
          id?: string
          report_id?: string | null
          report_type?: string
          user_id?: string
          vehicle_report_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "report_files_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_files_vehicle_report_id_fkey"
            columns: ["vehicle_report_id"]
            isOneToOne: false
            referencedRelation: "vehicle_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          action_taken: string | null
          attendance_rating: string | null
          created_at: string | null
          description: string | null
          duties_rating: string | null
          id: string
          incident_date: string | null
          location: string | null
          photo_url: string | null
          presence_rating: string | null
          reporting_person: string | null
          reporting_time: string | null
          shift: string | null
          staff_name: string | null
          type: string
          uniform_rating: string | null
          user_id: string
        }
        Insert: {
          action_taken?: string | null
          attendance_rating?: string | null
          created_at?: string | null
          description?: string | null
          duties_rating?: string | null
          id?: string
          incident_date?: string | null
          location?: string | null
          photo_url?: string | null
          presence_rating?: string | null
          reporting_person?: string | null
          reporting_time?: string | null
          shift?: string | null
          staff_name?: string | null
          type: string
          uniform_rating?: string | null
          user_id: string
        }
        Update: {
          action_taken?: string | null
          attendance_rating?: string | null
          created_at?: string | null
          description?: string | null
          duties_rating?: string | null
          id?: string
          incident_date?: string | null
          location?: string | null
          photo_url?: string | null
          presence_rating?: string | null
          reporting_person?: string | null
          reporting_time?: string | null
          shift?: string | null
          staff_name?: string | null
          type?: string
          uniform_rating?: string | null
          user_id?: string
        }
        Relationships: []
      }
      staff_entries: {
        Row: {
          attendance_rating: string | null
          created_at: string | null
          duties_rating: string | null
          id: string
          presence_rating: string | null
          report_id: string | null
          shift: string
          staff_name: string
          uniform_rating: string | null
        }
        Insert: {
          attendance_rating?: string | null
          created_at?: string | null
          duties_rating?: string | null
          id?: string
          presence_rating?: string | null
          report_id?: string | null
          shift: string
          staff_name: string
          uniform_rating?: string | null
        }
        Update: {
          attendance_rating?: string | null
          created_at?: string | null
          duties_rating?: string | null
          id?: string
          presence_rating?: string | null
          report_id?: string | null
          shift?: string
          staff_name?: string
          uniform_rating?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_entries_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_reports: {
        Row: {
          car_images: string[]
          car_model: string
          condition: string
          created_at: string | null
          driving_license_image: string | null
          id: string
          mileage: number
          mileage_image: string
          plate_number: string
          project: string
          receiver_id_image: string | null
          user_id: string
        }
        Insert: {
          car_images: string[]
          car_model: string
          condition: string
          created_at?: string | null
          driving_license_image?: string | null
          id?: string
          mileage: number
          mileage_image: string
          plate_number: string
          project: string
          receiver_id_image?: string | null
          user_id: string
        }
        Update: {
          car_images?: string[]
          car_model?: string
          condition?: string
          created_at?: string | null
          driving_license_image?: string | null
          id?: string
          mileage?: number
          mileage_image?: string
          plate_number?: string
          project?: string
          receiver_id_image?: string | null
          user_id?: string
        }
        Relationships: []
      }
      visits: {
        Row: {
          created_at: string | null
          id: string
          status: Database["public"]["Enums"]["visit_status"]
          type: string | null
          user_id: string
          visit_date: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          status: Database["public"]["Enums"]["visit_status"]
          type?: string | null
          user_id: string
          visit_date?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          status?: Database["public"]["Enums"]["visit_status"]
          type?: string | null
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
      get_pending_monthly_visits: {
        Args: {
          user_id: string
        }
        Returns: {
          count: number
        }[]
      }
      get_pending_supervisor_visits: {
        Args: {
          user_id: string
        }
        Returns: {
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
          report_type: string
          count: number
        }[]
      }
      schedule_weekly_visits: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      rating_type: "Excellent" | "Good" | "Fair" | "Poor"
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
