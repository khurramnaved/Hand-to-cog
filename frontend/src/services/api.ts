// =============================================
// Hand-To-Cog AI — Axios API Client
// =============================================

import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';
import { API_BASE_URL, API_TIMEOUT_MS } from '@/constants';
import { supabase } from './supabase';
import type { ApiError } from '@/types';

/**
 * Creates and configures the Axios instance used for all API requests.
 * Automatically attaches the JWT token from the active Supabase session
 * and handles 401 responses by redirecting to the login page.
 */
function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: `${API_BASE_URL}/api/v1`,
    timeout: API_TIMEOUT_MS,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor: attach JWT
  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  // Response interceptor: handle errors globally
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiError>) => {
      const status = error.response?.status;

      if (status === 401) {
        // Token expired or invalid — sign out and redirect
        await supabase.auth.signOut();
        if (window.location.pathname !== '/login') {
          window.location.href = '/login?session_expired=true';
        }
      }

      // Build a consistent error object
      const apiError: ApiError = error.response?.data ?? {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: error.message || 'An unexpected network error occurred',
        },
        timestamp: new Date().toISOString(),
      };

      return Promise.reject(apiError);
    }
  );

  return client;
}

export const api = createApiClient();
export default api;
