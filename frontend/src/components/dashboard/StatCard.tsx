// =============================================
// Hand-To-Cog AI — Stat Card Component
// =============================================

import { Card, Box, Typography, alpha, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  trend?: {
    value: number;
    label: string;
  };
}

export default function StatCard({ title, value, icon, color = 'primary', trend }: StatCardProps) {
  const theme = useTheme();
  
  // Custom colors for gradients based on theme palette keys
  const colorMap = {
    primary: ['#6366f1', '#4f46e5'],
    secondary: ['#ec4899', '#db2777'],
    success: ['#22c55e', '#16a34a'],
    warning: ['#f59e0b', '#d97706'],
    error: ['#ef4444', '#dc2626'],
    info: ['#0ea5e9', '#0284c7'],
  };

  const [colorLight, colorDark] = colorMap[color] as [string, string];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      style={{ height: '100%' }}
    >
      <Card
        className="glass-card"
        sx={{
          p: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 4,
          border: '1px solid',
          borderColor: alpha(theme.palette[color].main, 0.1),
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${alpha(colorLight, 0.2)}, ${alpha(colorDark, 0)})`,
            zIndex: 0,
          }}
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, zIndex: 1 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `linear-gradient(135deg, ${colorLight}, ${colorDark})`,
              color: 'white',
              boxShadow: `0 4px 12px ${alpha(colorDark, 0.3)}`,
            }}
          >
            {icon}
          </Box>
          {trend && (
            <Box
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                bgcolor: trend.value >= 0 ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.error.main, 0.1),
                color: trend.value >= 0 ? theme.palette.success.main : theme.palette.error.main,
                typography: 'caption',
                fontWeight: 600,
              }}
            >
              {trend.value > 0 ? '+' : ''}{trend.value}%
            </Box>
          )}
        </Box>

        <Box sx={{ mt: 'auto', zIndex: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            {title}
          </Typography>
        </Box>
      </Card>
    </motion.div>
  );
}
