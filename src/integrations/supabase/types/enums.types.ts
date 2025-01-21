export interface DatabaseEnums {
  notification_type: 'report_submitted' | 'report_updated' | 'new_report'
  report_type: 'supervisor_weekly' | 'manager_monthly' | 'visitor_log' | 'vehicle_handover' | 'full_monthly' | 'event_incident'
  visit_status: 'completed' | 'pending' | 'missed' | 'other'
}