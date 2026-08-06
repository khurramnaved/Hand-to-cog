// =============================================
// Hand-To-Cog AI — Teacher Dashboard
// =============================================

import { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import {
  People,
  Assessment,
  WarningAmber,
  Add as AddIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import StatCard from '@/components/dashboard/StatCard';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { analyticsApi, type DashboardStats } from '@/services/analyticsApi';

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await analyticsApi.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            Teacher Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's an overview of your students and recent screenings.
          </Typography>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            size="large"
            sx={{ borderRadius: 2, px: 3 }}
            onClick={() => navigate('/upload')}
          >
            New Screening
          </Button>
        </motion.div>
      </Box>

      {/* Stats Row */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <StatCard
                title="Total Students"
                value={stats?.total_students || 0}
                icon={<People />}
                color="primary"
              />
            </motion.div>
          </Box>
          <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <StatCard
                title="Screenings Completed"
                value={stats?.total_screenings || 0}
                icon={<Assessment />}
                color="success"
              />
            </motion.div>
          </Box>
          <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <StatCard
                title="High Risk Indicators"
                value={stats?.risk_distribution?.high || 0}
                icon={<WarningAmber />}
                color="warning"
              />
            </motion.div>
          </Box>
        </Box>
      )}

      {/* Main Content Area */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ flex: '1 1 600px', minWidth: 'min(100%, 600px)' }}>
          <Box className="glass-card" sx={{ height: 400, borderRadius: 4, p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              Analytics Chart (Coming in Phase 10)
            </Typography>
          </Box>
        </Box>
        <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ height: '100%' }}>
            <RecentActivity />
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
}
