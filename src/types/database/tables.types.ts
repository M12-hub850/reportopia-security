import { Json } from './base.types';

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
  }
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
  }
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
  }
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
  }
  Insert: {
    id: string;
    email: string;
    created_at?: string;
    preferred_language?: string;
    full_name?: string | null;
    phone?: string | null;
    avatar_url?: string | null;
  }
  Update: {
    id?: string;
    email?: string;
    created_at?: string;
    preferred_language?: string;
    full_name?: string | null;
    phone?: string | null;
    avatar_url?: string | null;
  }
}