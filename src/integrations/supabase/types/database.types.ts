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
      notifications: NotificationTable
      profiles: ProfileTable
      reports: ReportTable
      staff_entries: StaffEntryTable
      vehicle_reports: VehicleReportTable
      visits: VisitTable
      report_files: ReportFileTable
    }
    Functions: DatabaseFunctions
    Enums: DatabaseEnums
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]