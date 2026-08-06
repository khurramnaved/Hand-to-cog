// =============================================
// Hand-To-Cog AI — Dashboard Main Page
// =============================================

import { useAuth } from '@/hooks/useAuth';
import TeacherDashboard from './TeacherDashboard';
import AdminDashboard from './AdminDashboard';
import { Box, CircularProgress } from '@mui/material';

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Render different views based on user role
  if (user.role === 'admin' || user.role === 'principal') {
    return <AdminDashboard />;
  }

  return <TeacherDashboard />;
}
