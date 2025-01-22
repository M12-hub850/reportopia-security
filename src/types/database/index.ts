// Re-export only what's needed from base.types
export type { Database, DatabaseFunctions, DatabaseEnums, Json } from './base.types';

// Re-export specific types from tables.types
export type {
  NotificationTable,
  ProfileTable,
  ReportTable,
  StaffEntryTable,
  VehicleReportTable,
  VisitTable,
  ReportFileTable,
} from './tables.types';

// Re-export other type modules
export * from './reports.types';
export * from './staff.types';
export * from './vehicles.types';
export * from './visits.types';