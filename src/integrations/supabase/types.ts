import { Database as DatabaseGeneric } from '@supabase/supabase-js';

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
          id: string
          user_id: string
          type: 'report_submitted' | 'report_updated' | 'new_report'
          title: string
          message: string
          read: boolean | null
          created_at: string | null
          report_id: string | null
          vehicle_report_id: string | null
        }
        Insert: {
          id?: string
          user_id: string
          type: 'report_submitted' | 'report_updated' | 'new_report'
          title: string
          message: string
          read?: boolean | null
          created_at?: string | null
          report_id?: string | null
          vehicle_report_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'report_submitted' | 'report_updated' | 'new_report'
          title?: string
          message?: string
          read?: boolean | null
          created_at?: string | null
          report_id?: string | null
          vehicle_report_id?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          created_at: string
          preferred_language: string
          full_name: string | null
          phone: string | null
          avatar_url: string | null
        }
        Insert: {
          id: string
          email: string
          created_at?: string
          preferred_language?: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          preferred_language?: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
        }
      }
      reports: {
        Row: {
          id: string
          user_id: string
          type: 'supervisor_weekly' | 'manager_monthly' | 'visitor_log' | 'vehicle_handover' | 'full_monthly' | 'event_incident'
          description: string
          photo_url: string
          created_at: string | null
          visitor_name: string | null
          visit_purpose: string | null
          staff_name: string | null
          shift: string | null
          attendance_rating: string | null
          duties_rating: string | null
          uniform_rating: string | null
          presence_rating: string | null
          location: string | null
          incident_date: string | null
          reporting_time: string | null
          action_taken: string | null
          reporting_person: string | null
        }
        Insert: {
          id?: string
          user_id: string
          type: 'supervisor_weekly' | 'manager_monthly' | 'visitor_log' | 'vehicle_handover' | 'full_monthly' | 'event_incident'
          description: string
          photo_url: string
          created_at?: string | null
          visitor_name?: string | null
          visit_purpose?: string | null
          staff_name?: string | null
          shift?: string | null
          attendance_rating?: string | null
          duties_rating?: string | null
          uniform_rating?: string | null
          presence_rating?: string | null
          location?: string | null
          incident_date?: string | null
          reporting_time?: string | null
          action_taken?: string | null
          reporting_person?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'supervisor_weekly' | 'manager_monthly' | 'visitor_log' | 'vehicle_handover' | 'full_monthly' | 'event_incident'
          description?: string
          photo_url?: string
          created_at?: string | null
          visitor_name?: string | null
          visit_purpose?: string | null
          staff_name?: string | null
          shift?: string | null
          attendance_rating?: string | null
          duties_rating?: string | null
          uniform_rating?: string | null
          presence_rating?: string | null
          location?: string | null
          incident_date?: string | null
          reporting_time?: string | null
          action_taken?: string | null
          reporting_person?: string | null
        }
      }
      staff_entries: {
        Row: {
          id: string
          report_id: string
          staff_name: string
          shift: string
          attendance_rating: string | null
          duties_rating: string | null
          uniform_rating: string | null
          presence_rating: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          report_id: string
          staff_name: string
          shift: string
          attendance_rating?: string | null
          duties_rating?: string | null
          uniform_rating?: string | null
          presence_rating?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          report_id?: string
          staff_name?: string
          shift?: string
          attendance_rating?: string | null
          duties_rating?: string | null
          uniform_rating?: string | null
          presence_rating?: string | null
          created_at?: string | null
        }
      }
      vehicle_reports: {
        Row: {
          id: string
          user_id: string
          car_model: string
          plate_number: string
          mileage: number
          project: string
          condition: string
          car_images: string[]
          mileage_image: string
          created_at: string
          receiver_id_image: string | null
          driving_license_image: string | null
        }
        Insert: {
          id?: string
          user_id: string
          car_model: string
          plate_number: string
          mileage: number
          project: string
          condition: string
          car_images: string[]
          mileage_image: string
          created_at?: string
          receiver_id_image?: string | null
          driving_license_image?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          car_model?: string
          plate_number?: string
          mileage?: number
          project?: string
          condition?: string
          car_images?: string[]
          mileage_image?: string
          created_at?: string
          receiver_id_image?: string | null
          driving_license_image?: string | null
        }
      }
      visits: {
        Row: {
          id: string
          user_id: string
          status: 'completed' | 'pending' | 'missed' | 'other'
          visit_date: string | null
          created_at: string | null
          type: string | null
        }
        Insert: {
          id?: string
          user_id: string
          status: 'completed' | 'pending' | 'missed' | 'other'
          visit_date?: string | null
          created_at?: string | null
          type?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          status?: 'completed' | 'pending' | 'missed' | 'other'
          visit_date?: string | null
          created_at?: string | null
          type?: string | null
        }
      }
      report_files: {
        Row: {
          id: string
          user_id: string
          report_type: string
          file_name: string
          file_path: string
          report_id: string | null
          vehicle_report_id: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          report_type: string
          file_name: string
          file_path: string
          report_id?: string | null
          vehicle_report_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          report_type?: string
          file_name?: string
          file_path?: string
          report_id?: string | null
          vehicle_report_id?: string | null
          created_at?: string | null
        }
      }
    }
    Functions: {
      get_weekly_visits: {
        Args: { user_id: string }
        Returns: { status: string; count: number }[]
      }
      get_monthly_visits: {
        Args: { user_id: string }
        Returns: { status: string; count: number }[]
      }
      get_report_counts: {
        Args: {
          p_user_id: string
          p_start_date: string
          p_end_date: string
        }
        Returns: { report_type: string; count: number }[]
      }
    }
    Enums: {
      visit_status: 'completed' | 'pending' | 'missed' | 'other'
      report_type: 'supervisor_weekly' | 'manager_monthly' | 'visitor_log' | 'vehicle_handover' | 'full_monthly' | 'event_incident'
      notification_type: 'report_submitted' | 'report_updated' | 'new_report'
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
export type Functions<T extends keyof Database['public']['Functions']> = Database['public']['Functions'][T]