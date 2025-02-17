
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface DatabaseFunctions {
  get_pending_monthly_visits: {
    Args: { user_id: string };
    Returns: { count: number }[];
  };
  get_pending_supervisor_visits: {
    Args: { user_id: string };
    Returns: { count: number }[];
  };
  schedule_weekly_visits: {
    Args: Record<string, never>;
    Returns: void;
  };
  get_report_counts: {
    Args: {
      p_user_id: string;
      p_start_date: string;
      p_end_date: string;
    };
    Returns: { report_type: string; count: number }[];
  };
}

export interface DatabaseEnums {
  visit_status: 'completed' | 'pending' | 'missed' | 'other';
  rating_type: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  notification_type: 'report_submitted' | 'report_updated' | 'new_report';
  report_type: 'supervisor_weekly' | 'manager_monthly' | 'visitor_log' | 'vehicle_handover' | 'full_monthly' | 'event_incident';
}

export interface Database {
  public: {
    Tables: {
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: DatabaseEnums['notification_type'];
          title: string;
          message: string;
          read: boolean | null;
          report_id: string | null;
          vehicle_report_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: DatabaseEnums['notification_type'];
          title: string;
          message: string;
          read?: boolean | null;
          report_id?: string | null;
          vehicle_report_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: DatabaseEnums['notification_type'];
          title?: string;
          message?: string;
          read?: boolean | null;
          report_id?: string | null;
          vehicle_report_id?: string | null;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          preferred_language: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
        };
        Insert: {
          id: string;
          email: string;
          created_at?: string;
          preferred_language?: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
          preferred_language?: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
        };
      };
      reports: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          description: string | null;
          photo_url: string | null;
          created_at: string;
          staff_name: string | null;
          shift: string | null;
          attendance_rating: string | null;
          duties_rating: string | null;
          uniform_rating: string | null;
          presence_rating: string | null;
          location: string | null;
          incident_date: string | null;
          reporting_time: string | null;
          action_taken: string | null;
          reporting_person: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          description?: string | null;
          photo_url?: string | null;
          created_at?: string;
          staff_name?: string | null;
          shift?: string | null;
          attendance_rating?: string | null;
          duties_rating?: string | null;
          uniform_rating?: string | null;
          presence_rating?: string | null;
          location?: string | null;
          incident_date?: string | null;
          reporting_time?: string | null;
          action_taken?: string | null;
          reporting_person?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          description?: string | null;
          photo_url?: string | null;
          created_at?: string;
          staff_name?: string | null;
          shift?: string | null;
          attendance_rating?: string | null;
          duties_rating?: string | null;
          uniform_rating?: string | null;
          presence_rating?: string | null;
          location?: string | null;
          incident_date?: string | null;
          reporting_time?: string | null;
          action_taken?: string | null;
          reporting_person?: string | null;
        };
      };
      staff_entries: {
        Row: {
          id: string;
          report_id: string;
          staff_name: string;
          shift: string;
          attendance_rating: string | null;
          duties_rating: string | null;
          uniform_rating: string | null;
          presence_rating: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          report_id: string;
          staff_name: string;
          shift: string;
          attendance_rating?: string | null;
          duties_rating?: string | null;
          uniform_rating?: string | null;
          presence_rating?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          report_id?: string;
          staff_name?: string;
          shift?: string;
          attendance_rating?: string | null;
          duties_rating?: string | null;
          uniform_rating?: string | null;
          presence_rating?: string | null;
          created_at?: string;
        };
      };
      vehicle_reports: {
        Row: {
          id: string;
          user_id: string;
          car_model: string;
          plate_number: string;
          mileage: number;
          project: string;
          condition: string;
          car_images: string[];
          mileage_image: string;
          created_at: string;
          receiver_id_image: string | null;
          driving_license_image: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          car_model: string;
          plate_number: string;
          mileage: number;
          project: string;
          condition: string;
          car_images: string[];
          mileage_image: string;
          created_at?: string;
          receiver_id_image?: string | null;
          driving_license_image?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          car_model?: string;
          plate_number?: string;
          mileage?: number;
          project?: string;
          condition?: string;
          car_images?: string[];
          mileage_image?: string;
          created_at?: string;
          receiver_id_image?: string | null;
          driving_license_image?: string | null;
        };
      };
      report_files: {
        Row: {
          id: string;
          user_id: string;
          report_type: string;
          file_name: string;
          file_path: string;
          report_id: string | null;
          vehicle_report_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          report_type: string;
          file_name: string;
          file_path: string;
          report_id?: string | null;
          vehicle_report_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          report_type?: string;
          file_name?: string;
          file_path?: string;
          report_id?: string | null;
          vehicle_report_id?: string | null;
          created_at?: string;
        };
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: 'user' | 'manager' | 'admin';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: 'user' | 'manager' | 'admin';
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: 'user' | 'manager' | 'admin';
          created_at?: string;
        };
      };
      visits: {
        Row: {
          id: string;
          user_id: string;
          status: 'completed' | 'pending' | 'missed' | 'other';
          type: string | null;
          visit_date: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          status: 'completed' | 'pending' | 'missed' | 'other';
          type?: string | null;
          visit_date?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          status?: 'completed' | 'pending' | 'missed' | 'other';
          type?: string | null;
          visit_date?: string | null;
          created_at?: string | null;
        };
      };
    };
    Functions: DatabaseFunctions;
    Enums: DatabaseEnums;
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type { Database as default };
