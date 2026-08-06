// =============================================
// Hand-To-Cog AI — Dashboard & Analytics Types
// =============================================

import type { RiskLevel } from './student.types';

export interface DashboardStats {
  total_students: number;
  todays_screenings: number;
  high_risk_count: number;
  medium_risk_count: number;
  low_risk_count: number;
  total_screenings: number;
  total_uploads: number;
}

export interface MonthlyTrend {
  month: string;
  label: string;
  screenings: number;
  high_risk: number;
  medium_risk: number;
  low_risk: number;
}

export interface RecentUpload {
  id: string;
  student_name: string;
  file_name: string;
  status: string;
  risk_level: RiskLevel | null;
  created_at: string;
}

export interface DashboardData {
  stats: DashboardStats;
  monthly_trends: MonthlyTrend[];
  recent_uploads: RecentUpload[];
}

export interface ClassAnalysis {
  grade: string;
  total_students: number;
  screened: number;
  high_risk: number;
  medium_risk: number;
  low_risk: number;
}

export interface RiskDistribution {
  risk_level: RiskLevel;
  count: number;
  percentage: number;
}

export interface MonthlyScreening {
  month: string;
  label: string;
  count: number;
}

export interface AnalyticsData {
  class_analysis: ClassAnalysis[];
  risk_distribution: RiskDistribution[];
  monthly_screenings: MonthlyScreening[];
  total_screenings: number;
  total_students: number;
  average_confidence: number;
}

export interface AnalyticsFilters {
  date_from?: string;
  date_to?: string;
  grade?: string;
}
