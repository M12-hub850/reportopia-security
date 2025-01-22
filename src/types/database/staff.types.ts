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
  }
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
  }
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
  }
}