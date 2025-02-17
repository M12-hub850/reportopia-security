
import type { Database, DatabaseFunctions, DatabaseEnums } from './base.types';
import type {
  NotificationTable,
  ProfileTable,
  ReportTable,
  StaffEntryTable,
  VehicleReportTable,
  VisitTable,
  ReportFileTable,
} from './tables.types';

export type {
  Database,
  DatabaseFunctions,
  DatabaseEnums,
  NotificationTable,
  ProfileTable,
  ReportTable,
  StaffEntryTable,
  VehicleReportTable,
  VisitTable,
  ReportFileTable,
};

// Re-export other type modules
export * from './reports.types';
export * from './staff.types';
export * from './vehicles.types';
export * from './visits.types';
