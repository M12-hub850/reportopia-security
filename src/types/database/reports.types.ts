export interface ReportTable {
  Row: {
    id: string;
    user_id: string;
    type: string;
    description: string;
    photo_url: string;
    created_at: string | null;
    visitor_name: string | null;
    visit_purpose: string | null;
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
  }
  Insert: {
    id?: string;
    user_id: string;
    type: string;
    description: string;
    photo_url: string;
    created_at?: string | null;
    visitor_name?: string | null;
    visit_purpose?: string | null;
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
  }
  Update: {
    id?: string;
    user_id?: string;
    type?: string;
    description?: string;
    photo_url?: string;
    created_at?: string | null;
    visitor_name?: string | null;
    visit_purpose?: string | null;
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
  }
}

export interface ReportFileTable {
  Row: {
    id: string;
    user_id: string;
    report_type: string;
    file_name: string;
    file_path: string;
    report_id: string | null;
    vehicle_report_id: string | null;
    created_at: string | null;
  }
  Insert: {
    id?: string;
    user_id: string;
    report_type: string;
    file_name: string;
    file_path: string;
    report_id?: string | null;
    vehicle_report_id?: string | null;
    created_at?: string | null;
  }
  Update: {
    id?: string;
    user_id?: string;
    report_type?: string;
    file_name?: string;
    file_path?: string;
    report_id?: string | null;
    vehicle_report_id?: string | null;
    created_at?: string | null;
  }
}