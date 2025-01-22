export interface VisitTable {
  Row: {
    id: string;
    user_id: string;
    status: 'completed' | 'pending' | 'missed' | 'other';
    visit_date: string | null;
    created_at: string | null;
    type: string | null;
  }
  Insert: {
    id?: string;
    user_id: string;
    status: 'completed' | 'pending' | 'missed' | 'other';
    visit_date?: string | null;
    created_at?: string | null;
    type?: string | null;
  }
  Update: {
    id?: string;
    user_id?: string;
    status?: 'completed' | 'pending' | 'missed' | 'other';
    visit_date?: string | null;
    created_at?: string | null;
    type?: string | null;
  }
}