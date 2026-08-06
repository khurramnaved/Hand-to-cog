// =============================================
// Hand-To-Cog AI — Upload API Service
// =============================================

import api from './api';
import type { Upload } from '@/types';

export const uploadApi = {
  /**
   * Upload a handwriting sample for a student
   * @param studentId The ID of the student
   * @param file The file object (PNG or JPEG)
   * @param onProgress Callback for upload progress
   */
  uploadFile: async (
    studentId: string, 
    file: File, 
    onProgress?: (percentCompleted: number) => void
  ): Promise<Upload> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`/uploads/student/${studentId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });
    
    return response.data.data;
  },

  /**
   * Get all uploads for a specific student
   */
  getStudentUploads: async (studentId: string): Promise<Upload[]> => {
    const response = await api.get(`/uploads/student/${studentId}`);
    return response.data.data;
  }
};
