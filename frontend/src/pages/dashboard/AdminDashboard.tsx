// =============================================
// Hand-To-Cog AI — Admin/Principal Dashboard
// =============================================

import { Box, Typography, Button } from '@mui/material';
import {
  School,
  Assessment,
  Group,
  TrendingUp,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import StatCard from '@/components/dashboard/StatCard';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { useAuth } from '@/hooks/useAuth';

export default function AdminDashboard() {
  const { user } = useAuth();
  
  const isPrincipal = user?.role === 'principal';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            {isPrincipal ? 'Principal Dashboard' : 'Admin Dashboard'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            System-wide overview of screenings, users, and activity.
          </Typography>
        </motion.div>

        {!isPrincipal && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              sx={{ borderRadius: 2, px: 3 }}
            >
              Export System Report
            </Button>
          </motion.div>
        )}
      </Box>

      {/* Stats Row */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ flex: '1 1 240px', minWidth: 240 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <StatCard
              title="Active Teachers"
              value={24}
              icon={<School />}
              color="primary"
            />
          </motion.div>
        </Box>
        <Box sx={{ flex: '1 1 240px', minWidth: 240 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <StatCard
              title="Total Students"
              value={845}
              icon={<Group />}
              color="info"
              trend={{ value: 2.5, label: 'vs last month' }}
            />
          </motion.div>
        </Box>
        <Box sx={{ flex: '1 1 240px', minWidth: 240 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <StatCard
              title="Total Screenings"
              value={1204}
              icon={<Assessment />}
              color="success"
              trend={{ value: 15, label: 'vs last month' }}
            />
          </motion.div>
        </Box>
        <Box sx={{ flex: '1 1 240px', minWidth: 240 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <StatCard
              title="Average Accuracy"
              value="94.2%"
              icon={<TrendingUp />}
              color="secondary"
            />
          </motion.div>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ flex: '1 1 600px', minWidth: 'min(100%, 600px)' }}>
          <Box className="glass-card" sx={{ height: 400, borderRadius: 4, p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Placeholder for Analytics Chart in Phase 10 */}
            <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              System-Wide Analytics Chart (Coming in Phase 10)
            </Typography>
          </Box>
        </Box>
        <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={{ height: '100%' }}>
            <RecentActivity />
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
}
