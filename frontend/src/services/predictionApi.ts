// =============================================
// Hand-To-Cog AI — Prediction API Service
// =============================================

import api from './api';
import type { Screening } from '@/types';

export const predictionApi = {
  createPrediction: async (uploadId: string): Promise<Screening> => {
    const response = await api.post('/predict', { upload_id: uploadId });
    return response.data.data;
  },

  getPrediction: async (screeningId: string): Promise<Screening> => {
    const response = await api.get(`/predict/${screeningId}`);
    return response.data.data;
  }
};
