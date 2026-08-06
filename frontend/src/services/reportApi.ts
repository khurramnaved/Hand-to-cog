// =============================================
// Hand-To-Cog AI — Report API Service
// =============================================

import api from './api';
import type { Report } from '@/types';

export const reportApi = {
  generateReport: async (screeningId: string): Promise<Report> => {
    const response = await api.post('/reports/generate', { screening_id: screeningId });
    return response.data.data;
  },

  getAllReports: async (): Promise<Report[]> => {
    const response = await api.get('/reports');
    return response.data.data;
  }
};
