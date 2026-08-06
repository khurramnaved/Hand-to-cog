// =============================================
// Hand-To-Cog AI — Route Configuration
// =============================================

import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { ProtectedRoute } from './ProtectedRoute';

import AppShell from '@/components/layout/AppShell';

// Lazy load pages for code splitting
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));
const StudentsList = lazy(() => import('@/pages/students/StudentsList'));
const StudentDetail = lazy(() => import('@/pages/students/StudentDetail'));
const UploadPage = lazy(() => import('@/pages/upload/UploadPage'));

// Placeholder components for Phase 4+
function NotFoundPlaceholder() { return <Box sx={{ p: 4 }}>404 - Not Found</Box>; }

const SuspenseLoader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </Box>
);

export default function AppRoutes() {
  return (
    <Suspense fallback={<SuspenseLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Routes wrapped in AppShell */}
        <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          
          <Route path="/students" element={<StudentsList />} />
          <Route path="/students/:id" element={<StudentDetail />} />
          
          <Route path="/upload" element={<UploadPage />} />
          
          {/* Catch-all inside AppShell */}
          <Route path="*" element={<NotFoundPlaceholder />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
