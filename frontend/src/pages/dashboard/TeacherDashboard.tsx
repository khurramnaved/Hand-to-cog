// =============================================
// Hand-To-Cog AI — Teacher Dashboard
// =============================================

import { Box, Typography, Button } from '@mui/material';
import {
  People,
  Assessment,
  WarningAmber,
  Add as AddIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import StatCard from '@/components/dashboard/StatCard';
import RecentActivity from '@/components/dashboard/RecentActivity';

export default function TeacherDashboard() {
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
          >
            New Screening
          </Button>
        </motion.div>
      </Box>

      {/* Stats Row */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <StatCard
              title="Total Students"
              value={42}
              icon={<People />}
              color="primary"
              trend={{ value: 5, label: 'vs last month' }}
            />
          </motion.div>
        </Box>
        <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <StatCard
              title="Screenings Completed"
              value={128}
              icon={<Assessment />}
              color="success"
              trend={{ value: 12, label: 'vs last month' }}
            />
          </motion.div>
        </Box>
        <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <StatCard
              title="High Risk Indicators"
              value={3}
              icon={<WarningAmber />}
              color="warning"
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
