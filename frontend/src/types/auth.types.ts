// =============================================
// Hand-To-Cog AI — User & Auth Types
// =============================================

export type UserRole = 'teacher' | 'admin' | 'principal';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url: string | null;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  role: UserRole;
}

export interface ResetPasswordData {
  email: string;
}

export interface UpdateProfileData {
  full_name?: string;
  avatar_url?: string | null;
}

export interface AuthState {
  user: User | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
