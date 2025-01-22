import { 
  NotificationTable,
  ProfileTable,
  ReportTable,
  StaffEntryTable,
  VehicleReportTable,
  VisitTable,
  ReportFileTable 
} from './tables.types';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      notifications: NotificationTable;
      profiles: ProfileTable;
      reports: ReportTable;
      staff_entries: StaffEntryTable;
      vehicle_reports: VehicleReportTable;
      visits: VisitTable;
      report_files: ReportFileTable;
    }
    Functions: DatabaseFunctions;
    Enums: DatabaseEnums;
    CompositeTypes: {
      [_ in never]: never;
    }
  }
}

export interface DatabaseFunctions {
  get_weekly_visits: {
    Args: { user_id: string };
    Returns: Array<{ status: string; count: number }>;
  }
  get_monthly_visits: {
    Args: { user_id: string };
    Returns: Array<{ status: string; count: number }>;
  }
  get_report_counts: {
    Args: {
      p_user_id: string;
      p_start_date: string;
      p_end_date: string;
    };
    Returns: Array<{ report_type: string; count: number }>;
  }
}

export interface DatabaseEnums {
  notification_type: 'report_submitted' | 'report_updated' | 'new_report';
  report_type: 'supervisor_weekly' | 'manager_monthly' | 'visitor_log' | 'vehicle_handover' | 'full_monthly' | 'event_incident';
  visit_status: 'completed' | 'pending' | 'missed' | 'other';
}

// Helper types for database operations
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];
export type DBInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type DBUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];