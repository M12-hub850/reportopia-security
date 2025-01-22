import { Database } from './base.types';

export interface NotificationTable {
  Row: {
    id: string;
    user_id: string;
    type: string;
    title: string;
    message: string;
    read: boolean | null;
    created_at: string | null;
    report_id: string | null;
    vehicle_report_id: string | null;
  };
  Insert: {
    id?: string;
    user_id: string;
    type: string;
    title: string;
    message: string;
    read?: boolean | null;
    created_at?: string | null;
    report_id?: string | null;
    vehicle_report_id?: string | null;
  };
  Update: {
    id?: string;
    user_id?: string;
    type?: string;
    title?: string;
    message?: string;
    read?: boolean | null;
    created_at?: string | null;
    report_id?: string | null;
    vehicle_report_id?: string | null;
  };
}

export interface ProfileTable {
  Row: {
    id: string;
    email: string;
    created_at: string;
    preferred_language: string;
    full_name: string | null;
    phone: string | null;
    avatar_url: string | null;
  };
  Insert: {
    id: string;
    email: string;
    created_at?: string;
    preferred_language?: string;
    full_name?: string | null;
    phone?: string | null;
    avatar_url?: string | null;
  };
  Update: {
    id?: string;
    email?: string;
    created_at?: string;
    preferred_language?: string;
    full_name?: string | null;
    phone?: string | null;
    avatar_url?: string | null;
  };
}

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
  };
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
  };
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
  };
}

export interface StaffEntryTable {
  Row: {
    id: string;
    report_id: string;
    staff_name: string;
    shift: string;
    attendance_rating: string | null;
    duties_rating: string | null;
    uniform_rating: string | null;
    presence_rating: string | null;
    created_at: string | null;
  };
  Insert: {
    id?: string;
    report_id: string;
    staff_name: string;
    shift: string;
    attendance_rating?: string | null;
    duties_rating?: string | null;
    uniform_rating?: string | null;
    presence_rating?: string | null;
    created_at?: string | null;
  };
  Update: {
    id?: string;
    report_id?: string;
    staff_name?: string;
    shift?: string;
    attendance_rating?: string | null;
    duties_rating?: string | null;
    uniform_rating?: string | null;
    presence_rating?: string | null;
    created_at?: string | null;
  };
}

export interface VehicleReportTable {
  Row: {
    id: string;
    user_id: string;
    car_model: string;
    plate_number: string;
    mileage: number;
    project: string;
    condition: string;
    car_images: string[];
    mileage_image: string;
    created_at: string;
    receiver_id_image: string | null;
    driving_license_image: string | null;
  };
  Insert: {
    id?: string;
    user_id: string;
    car_model: string;
    plate_number: string;
    mileage: number;
    project: string;
    condition: string;
    car_images: string[];
    mileage_image: string;
    created_at?: string;
    receiver_id_image?: string | null;
    driving_license_image?: string | null;
  };
  Update: {
    id?: string;
    user_id?: string;
    car_model?: string;
    plate_number?: string;
    mileage?: number;
    project?: string;
    condition?: string;
    car_images?: string[];
    mileage_image?: string;
    created_at?: string;
    receiver_id_image?: string | null;
    driving_license_image?: string | null;
  };
}

export interface VisitTable {
  Row: {
    id: string;
    user_id: string;
    status: 'completed' | 'pending' | 'missed' | 'other';
    visit_date: string | null;
    created_at: string | null;
    type: string | null;
  };
  Insert: {
    id?: string;
    user_id: string;
    status: 'completed' | 'pending' | 'missed' | 'other';
    visit_date?: string | null;
    created_at?: string | null;
    type?: string | null;
  };
  Update: {
    id?: string;
    user_id?: string;
    status?: 'completed' | 'pending' | 'missed' | 'other';
    visit_date?: string | null;
    created_at?: string | null;
    type?: string | null;
  };
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
  };
  Insert: {
    id?: string;
    user_id: string;
    report_type: string;
    file_name: string;
    file_path: string;
    report_id?: string | null;
    vehicle_report_id?: string | null;
    created_at?: string | null;
  };
  Update: {
    id?: string;
    user_id?: string;
    report_type?: string;
    file_name?: string;
    file_path?: string;
    report_id?: string | null;
    vehicle_report_id?: string | null;
    created_at?: string | null;
  };
}
