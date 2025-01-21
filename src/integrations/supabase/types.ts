export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
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
    }
    Functions: {
      get_monthly_visits: {
        Args: { user_id: string }
        Returns: { status: string; count: number }[]
      }
      get_weekly_visits: {
        Args: { user_id: string }
        Returns: { status: string; count: number }[]
      }
    }
    Enums: {
      notification_type: 'report_submitted' | 'report_updated' | 'new_report'
      report_type: 'supervisor_weekly' | 'manager_monthly' | 'visitor_log' | 'vehicle_handover' | 'full_monthly' | 'event_incident'
      visit_status: 'completed' | 'pending' | 'missed' | 'other'
    }
  }
}
