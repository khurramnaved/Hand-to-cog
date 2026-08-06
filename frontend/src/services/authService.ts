// =============================================
// Hand-To-Cog AI — Auth Service API
// =============================================

import api from './api';
import type {
  LoginCredentials,
  RegisterData,
  UpdateProfileData,
  ApiResponse,
  User,
} from '@/types';

export const authService = {
  /**
   * Register a new user
   */
  register: async (data: RegisterData): Promise<ApiResponse<User>> => {
    const response = await api.post<ApiResponse<User>>('/auth/register', data);
    return response.data;
  },

  /**
   * Login (Note: Client-side usually uses Supabase directly, but we might hit backend for sync)
   */
  login: async (data: LoginCredentials): Promise<ApiResponse<{ user: User; access_token: string }>> => {
    const response = await api.post<ApiResponse<{ user: User; access_token: string }>>('/auth/login', data);
    return response.data;
  },

  /**
   * Logout from backend session
   */
  logout: async (): Promise<ApiResponse<null>> => {
    const response = await api.post<ApiResponse<null>>('/auth/logout');
    return response.data;
  },

  /**
   * Get current user profile from backend
   */
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await api.get<ApiResponse<User>>('/auth/profile');
    return response.data;
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: UpdateProfileData): Promise<ApiResponse<User>> => {
    const response = await api.put<ApiResponse<User>>('/auth/profile', data);
    return response.data;
  },
};
