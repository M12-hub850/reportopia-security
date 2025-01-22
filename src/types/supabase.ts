import { Database, Tables, Enums, DBInsert, DBUpdate } from './database/base.types';

export type { Database };

// Strongly typed table rows
export type Profile = Tables<'profiles'>;
export type Report = Tables<'reports'>;
export type Visit = Tables<'visits'>;
export type Notification = Tables<'notifications'>;
export type VehicleReport = Tables<'vehicle_reports'>;
export type StaffEntry = Tables<'staff_entries'>;
export type ReportFile = Tables<'report_files'>;

// Strongly typed table inserts
export type ProfileInsert = DBInsert<'profiles'>;
export type ReportInsert = DBInsert<'reports'>;
export type VisitInsert = DBInsert<'visits'>;
export type NotificationInsert = DBInsert<'notifications'>;
export type VehicleReportInsert = DBInsert<'vehicle_reports'>;
export type StaffEntryInsert = DBInsert<'staff_entries'>;
export type ReportFileInsert = DBInsert<'report_files'>;

// Strongly typed table updates
export type ProfileUpdate = DBUpdate<'profiles'>;
export type ReportUpdate = DBUpdate<'reports'>;
export type VisitUpdate = DBUpdate<'visits'>;
export type NotificationUpdate = DBUpdate<'notifications'>;
export type VehicleReportUpdate = DBUpdate<'vehicle_reports'>;
export type StaffEntryUpdate = DBUpdate<'staff_entries'>;
export type ReportFileUpdate = DBUpdate<'report_files'>;

// Strongly typed function returns
export type WeeklyVisitsReturn = Array<{
  status: Enums<'visit_status'>;
  count: number;
}>;

export type MonthlyVisitsReturn = Array<{
  status: Enums<'visit_status'>;
  count: number;
}>;

// Enums
export type VisitStatus = Enums<'visit_status'>;
export type ReportType = Enums<'report_type'>;
export type NotificationType = Enums<'notification_type'>;

// Helper type for database function returns
export type DatabaseFunctionReturn<T> = T[];