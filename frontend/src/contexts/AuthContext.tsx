// =============================================
// Hand-To-Cog AI — Auth Context
// =============================================

import {
  createContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import { supabase } from '@/services/supabase';
import { authService } from '@/services/authService';
import type { AuthState, User, AuthSession } from '@/types';
import type { Session } from '@supabase/supabase-js';

export interface AuthContextValue extends AuthState {
  signIn: () => void; // Usually redirects to provider or handled in LoginPage
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await authService.getProfile();
      if (response.success) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      setUser(null);
    }
  }, []);

  const handleSession = useCallback(async (sbSession: Session | null) => {
    if (sbSession) {
      setSession({
        access_token: sbSession.access_token,
        refresh_token: sbSession.refresh_token,
        expires_at: sbSession.expires_at ?? 0,
        user: user as User, // Will be updated by fetchUserProfile
      });
      await fetchUserProfile();
    } else {
      setSession(null);
      setUser(null);
    }
    setIsLoading(false);
  }, [fetchUserProfile, user]);

  useEffect(() => {
    // Check active session on mount
    supabase.auth.getSession().then(({ data: { session: sbSession } }) => {
      handleSession(sbSession);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, sbSession) => {
        handleSession(sbSession);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch {
      // Ignore backend logout failure
    }
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setIsLoading(false);
  }, []);

  const signIn = useCallback(() => {
    // Implementation placeholder if using OAuth
  }, []);

  const refreshUser = useCallback(async () => {
    await fetchUserProfile();
  }, [fetchUserProfile]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      isAuthenticated: !!session && !!user,
      isLoading,
      signIn,
      signOut,
      refreshUser,
    }),
    [user, session, isLoading, signIn, signOut, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
