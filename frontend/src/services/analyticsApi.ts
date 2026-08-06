// =============================================
// Hand-To-Cog AI — Analytics API Service
// =============================================

import api from './api';

export interface DashboardStats {
  total_students: number;
  total_screenings: number;
  risk_distribution: {
    low: number;
    medium: number;
    high: number;
  };
  monthly_trend: { date: string; count: number }[];
}

export const analyticsApi = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/analytics/dashboard');
    return response.data.data;
  }
};
