import { Database, DatabaseEnums } from './database/base.types';
import type { 
  NotificationTable,
  ProfileTable,
  ReportTable,
  StaffEntryTable,
  VehicleReportTable,
  VisitTable,
  ReportFileTable 
} from './database/tables.types';

export type { Database };

// Strongly typed table rows
export type Profile = ProfileTable['Row'];
export type Report = ReportTable['Row'];
export type Visit = VisitTable['Row'];
export type Notification = NotificationTable['Row'];
export type VehicleReport = VehicleReportTable['Row'];
export type StaffEntry = StaffEntryTable['Row'];
export type ReportFile = ReportFileTable['Row'];

// Strongly typed table inserts
export type ProfileInsert = ProfileTable['Insert'];
export type ReportInsert = ReportTable['Insert'];
export type VisitInsert = VisitTable['Insert'];
export type NotificationInsert = NotificationTable['Insert'];
export type VehicleReportInsert = VehicleReportTable['Insert'];
export type StaffEntryInsert = StaffEntryTable['Insert'];
export type ReportFileInsert = ReportFileTable['Insert'];

// Strongly typed table updates
export type ProfileUpdate = ProfileTable['Update'];
export type ReportUpdate = ReportTable['Update'];
export type VisitUpdate = VisitTable['Update'];
export type NotificationUpdate = NotificationTable['Update'];
export type VehicleReportUpdate = VehicleReportTable['Update'];
export type StaffEntryUpdate = StaffEntryTable['Update'];
export type ReportFileUpdate = ReportFileTable['Update'];

// Strongly typed function returns
export type WeeklyVisitsReturn = Array<{
  status: DatabaseEnums['visit_status'];
  count: number;
}>;

export type MonthlyVisitsReturn = Array<{
  status: DatabaseEnums['visit_status'];
  count: number;
}>;

// Enums
export type VisitStatus = DatabaseEnums['visit_status'];
export type ReportType = DatabaseEnums['report_type'];
export type NotificationType = DatabaseEnums['notification_type'];

// Helper type for database function returns
export type DatabaseFunctionReturn<T> = T[];