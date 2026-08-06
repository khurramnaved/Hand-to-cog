// =============================================
// Hand-To-Cog AI — Student Types
// =============================================

export type Gender = 'male' | 'female' | 'other';

export interface Student {
  id: string;
  teacher_id: string;
  full_name: string;
  date_of_birth: string;
  gender: Gender;
  grade: string;
  section: string | null;
  parent_name: string | null;
  parent_contact: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  latest_risk_level?: RiskLevel | null;
  screening_count?: number;
}

export interface CreateStudentData {
  full_name: string;
  date_of_birth: string;
  gender: Gender;
  grade: string;
  section?: string;
  parent_name?: string;
  parent_contact?: string;
  notes?: string;
}

export interface UpdateStudentData extends Partial<CreateStudentData> {
  is_active?: boolean;
}

export interface StudentFilters {
  search?: string;
  grade?: string;
  gender?: Gender;
  risk_level?: RiskLevel;
  is_active?: boolean;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  page?: number;
  page_size?: number;
}

export type RiskLevel = 'high' | 'medium' | 'low';
