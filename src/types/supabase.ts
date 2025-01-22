import { Database as DatabaseGenerated } from '@/integrations/supabase/types';

export type Database = DatabaseGenerated;

// Strongly typed table rows
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Report = Database['public']['Tables']['reports']['Row'];
export type Visit = Database['public']['Tables']['visits']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];
export type VehicleReport = Database['public']['Tables']['vehicle_reports']['Row'];
export type StaffEntry = Database['public']['Tables']['staff_entries']['Row'];
export type ReportFile = Database['public']['Tables']['report_files']['Row'];

// Strongly typed table inserts
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ReportInsert = Database['public']['Tables']['reports']['Insert'];
export type VisitInsert = Database['public']['Tables']['visits']['Insert'];
export type NotificationInsert = Database['public']['Tables']['notifications']['Insert'];
export type VehicleReportInsert = Database['public']['Tables']['vehicle_reports']['Insert'];
export type StaffEntryInsert = Database['public']['Tables']['staff_entries']['Insert'];
export type ReportFileInsert = Database['public']['Tables']['report_files']['Insert'];

// Strongly typed table updates
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
export type ReportUpdate = Database['public']['Tables']['reports']['Update'];
export type VisitUpdate = Database['public']['Tables']['visits']['Update'];
export type NotificationUpdate = Database['public']['Tables']['notifications']['Update'];
export type VehicleReportUpdate = Database['public']['Tables']['vehicle_reports']['Update'];
export type StaffEntryUpdate = Database['public']['Tables']['staff_entries']['Update'];
export type ReportFileUpdate = Database['public']['Tables']['report_files']['Update'];

// Strongly typed function returns
export type WeeklyVisitsReturn = Array<{
  status: Database['public']['Enums']['visit_status'];
  count: number;
}>;

export type MonthlyVisitsReturn = Array<{
  status: Database['public']['Enums']['visit_status'];
  count: number;
}>;

// Enums
export type VisitStatus = Database['public']['Enums']['visit_status'];
export type ReportType = Database['public']['Enums']['report_type'];
export type NotificationType = Database['public']['Enums']['notification_type'];