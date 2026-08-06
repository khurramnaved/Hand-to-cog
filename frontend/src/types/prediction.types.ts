// =============================================
// Hand-To-Cog AI — Prediction & Screening Types
// =============================================

import type { RiskLevel } from './student.types';

export interface Screening {
  id: string;
  upload_id: string;
  student_id: string;
  teacher_id: string;
  risk_level: RiskLevel;
  confidence_score: number;
  probability: number;
  prediction_label: string;
  features: Record<string, number>;
  shap_values: Record<string, number>;
  shap_plot_url: string | null;
  recommendation: string;
  model_version: string;
  processing_time_ms: number | null;
  created_at: string;
  updated_at: string;
  student_name?: string;
  upload_file_url?: string;
}

export interface PredictionRequest {
  upload_id: string;
  student_id: string;
}

export interface PredictionResponse {
  screening: Screening;
  message: string;
}

export interface FeatureExplanation {
  feature_name: string;
  display_name: string;
  value: number;
  shap_value: number;
  description: string;
}

export interface TeacherNote {
  id: string;
  screening_id: string;
  teacher_id: string;
  note: string;
  created_at: string;
  updated_at: string;
  teacher_name?: string;
}

export interface CreateTeacherNoteData {
  screening_id: string;
  note: string;
}
