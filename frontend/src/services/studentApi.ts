// =============================================
// Hand-To-Cog AI — Student API Service
// =============================================

import api from './api';
import type { Student, CreateStudentData, UpdateStudentData } from '@/types';

export const studentApi = {
  /**
   * Get all students for the current user
   */
  getAll: async (): Promise<Student[]> => {
    const response = await api.get('/students');
    return response.data.data;
  },

  /**
   * Get a specific student by ID
   */
  getById: async (id: string): Promise<Student> => {
    const response = await api.get(`/students/${id}`);
    return response.data.data;
  },

  /**
   * Create a new student
   */
  create: async (data: CreateStudentData): Promise<Student> => {
    const response = await api.post('/students', data);
    return response.data.data;
  },

  /**
   * Update an existing student
   */
  update: async (id: string, data: UpdateStudentData): Promise<Student> => {
    const response = await api.put(`/students/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete a student
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/students/${id}`);
  }
};
