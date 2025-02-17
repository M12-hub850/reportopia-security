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
      user_roles: UserRolesTable;
    };
    Functions: DatabaseFunctions;
    Enums: DatabaseEnums;
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export interface DatabaseFunctions {
  get_weekly_visits: {
    Args: { user_id: string };
    Returns: Array<{ status: string; count: number }>;
  };
  get_monthly_visits: {
    Args: { user_id: string };
    Returns: Array<{ status: string; count: number }>;
  };
  get_pending_monthly_visits: {
    Args: { user_id: string };
    Returns: Array<{ count: number }>;
  };
  get_pending_supervisor_visits: {
    Args: { user_id: string };
    Returns: Array<{ count: number }>;
  };
  has_role: {
    Args: { user_id: string; required_role: string };
    Returns: boolean;
  };
  get_report_counts: {
    Args: {
      p_user_id: string;
      p_start_date: string;
      p_end_date: string;
    };
    Returns: Array<{ report_type: string; count: number }>;
  };
}

export interface DatabaseEnums {
  notification_type: 'report_submitted' | 'report_updated' | 'new_report';
  report_type: 'supervisor_weekly' | 'manager_monthly' | 'visitor_log' | 'vehicle_handover' | 'full_monthly' | 'event_incident';
  visit_status: 'completed' | 'pending' | 'missed' | 'other';
  app_role: 'user' | 'manager' | 'admin';
  rating_type: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}

interface UserRolesTable {
  Row: {
    id: string;
    user_id: string;
    role: DatabaseEnums['app_role'];
    created_at: string;
  };
  Insert: {
    id?: string;
    user_id: string;
    role: DatabaseEnums['app_role'];
    created_at?: string;
  };
  Update: {
    id?: string;
    user_id?: string;
    role?: DatabaseEnums['app_role'];
    created_at?: string;
  };
}

interface VisitTable {
  Row: {
    id: string;
    user_id: string;
    status: DatabaseEnums['visit_status'];
    type: string;
    visit_date: string;
    created_at: string;
  };
  Insert: {
    id?: string;
    user_id: string;
    status: DatabaseEnums['visit_status'];
    type: string;
    visit_date?: string;
    created_at?: string;
  };
  Update: {
    id?: string;
    user_id?: string;
    status?: DatabaseEnums['visit_status'];
    type?: string;
    visit_date?: string;
    created_at?: string;
  };
}

interface NotificationTable {
  Row: {
    id: string;
    created_at: string;
    title: string;
    message: string;
    type: DatabaseEnums['notification_type'];
    read: boolean;
  };
  Insert: {
    id?: string;
    created_at?: string;
    title: string;
    message: string;
    type: DatabaseEnums['notification_type'];
    read?: boolean;
  };
  Update: {
    id?: string;
    created_at?: string;
    title?: string;
    message?: string;
    type?: DatabaseEnums['notification_type'];
    read?: boolean;
  };
}

interface ProfileTable {
  Row: {
    id: string;
    updated_at: string | null;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
    email: string | null;
    phone: string | null;
    reports_to: string | null;
    created_at: string;
  };
  Insert: {
    id: string;
    updated_at?: string | null;
    username?: string | null;
    full_name?: string | null;
    avatar_url?: string | null;
    email?: string | null;
    phone?: string | null;
    reports_to?: string | null;
    created_at?: string;
  };
  Update: {
    id?: string;
    updated_at?: string | null;
    username?: string | null;
    full_name?: string | null;
    avatar_url?: string | null;
    email?: string | null;
    phone?: string | null;
    reports_to?: string | null;
    created_at?: string;
  };
}

interface ReportTable {
  Row: {
    id: string;
    created_at: string;
    type: DatabaseEnums['report_type'];
    title: string | null;
    content: string | null;
    user_id: string | null;
  };
  Insert: {
    id?: string;
    created_at?: string;
    type: DatabaseEnums['report_type'];
    title?: string | null;
    content?: string | null;
    user_id?: string | null;
  };
  Update: {
    id?: string;
    created_at?: string;
    type?: DatabaseEnums['report_type'];
    title?: string | null;
    content?: string | null;
    user_id?: string | null;
  };
}

interface StaffEntryTable {
  Row: {
    id: string;
    created_at: string;
    user_id: string | null;
    entry_time: string | null;
    exit_time: string | null;
    notes: string | null;
  };
  Insert: {
    id?: string;
    created_at?: string;
    user_id?: string | null;
    entry_time?: string | null;
    exit_time?: string | null;
    notes?: string | null;
  };
  Update: {
    id?: string;
    created_at?: string;
    user_id?: string | null;
    entry_time?: string | null;
    exit_time?: string | null;
    notes?: string | null;
  };
}

interface VehicleReportTable {
  Row: {
    id: string;
    created_at: string;
    user_id: string | null;
    vehicle_id: string | null;
    handover_time: string | null;
    receiver_name: string | null;
    notes: string | null;
  };
  Insert: {
    id?: string;
    created_at?: string;
    user_id?: string | null;
    vehicle_id?: string | null;
    handover_time?: string | null;
    receiver_name?: string | null;
    notes?: string | null;
  };
  Update: {
    id?: string;
    created_at?: string;
    user_id?: string | null;
    vehicle_id?: string | null;
    handover_time?: string | null;
    receiver_name?: string | null;
    notes?: string | null;
  };
}

interface ReportFileTable {
  Row: {
    id: string;
    created_at: string;
    report_id: string | null;
    file_path: string | null;
    file_name: string | null;
  };
  Insert: {
    id?: string;
    created_at?: string;
    report_id?: string | null;
    file_path?: string | null;
    file_name?: string | null;
  };
  Update: {
    id?: string;
    created_at?: string;
    report_id?: string | null;
    file_path?: string | null;
    file_name?: string | null;
  };
}
