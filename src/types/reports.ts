
export interface StaffEntry {
  staff_name: string;
  shift: string;
  attendance_rating: string | null;
  duties_rating: string | null;
  uniform_rating: string | null;
  presence_rating: string | null;
}

export interface ReportDetails {
  description: string;
  photo_url: string;
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
  staff_entries?: StaffEntry[];
}

export interface VehicleReportDetails {
  car_model: string;
  plate_number: string;
  mileage: number;
  project: string;
  condition: string;
  car_images: string[];
  mileage_image: string;
  receiver_id_image: string | null;
  driving_license_image: string | null;
}

export interface DatabaseReportFile {
  id: string;
  report_type: string;
  file_name: string;
  file_path: string;
  created_at: string;
  report_id: string;
  vehicle_report_id: string;
  user_id: string;
  report: (ReportDetails & { staff_entries: any }) | null;
  vehicle_report: VehicleReportDetails | null;
}

export interface ReportFile {
  id: string;
  report_type: string;
  file_name: string;
  file_path: string;
  created_at: string;
  report: ReportDetails & Partial<VehicleReportDetails>;
}
