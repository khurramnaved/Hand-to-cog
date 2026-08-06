// =============================================
// Hand-To-Cog AI — Report Types
// =============================================

import type { RiskLevel } from './student.types';

export type ReportStatus = 'generating' | 'generated' | 'failed';

export interface Report {
  id: string;
  screening_id: string;
  student_id: string;
  teacher_id: string;
  report_data: ReportData;
  pdf_url: string | null;
  status: ReportStatus;
  created_at: string;
  updated_at: string;
  student_name?: string;
  teacher_name?: string;
}

export interface ReportData {
  student_info: {
    full_name: string;
    date_of_birth: string;
    gender: string;
    grade: string;
    section: string | null;
  };
  screening_info: {
    risk_level: RiskLevel;
    confidence_score: number;
    probability: number;
    prediction_label: string;
    model_version: string;
    screened_at: string;
  };
  features: Record<string, number>;
  shap_values: Record<string, number>;
  recommendation: string;
  teacher_notes: string[];
  generated_at: string;
}

export interface ReportFilters {
  student_id?: string;
  risk_level?: RiskLevel;
  date_from?: string;
  date_to?: string;
  page?: number;
  page_size?: number;
}
