// =============================================
// Hand-To-Cog AI — Role Route Guard
// =============================================

import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/types';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null; // Handled by ProtectedRoute
  }

  if (!user || !allowedRoles.includes(user.role)) {
    // Alternatively, redirect to a 403 Forbidden page
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
