// =============================================
// Hand-To-Cog AI — Analytics Dashboard
// =============================================

import { useState, useEffect } from 'react';
import { Box, Typography, Card, CircularProgress, Alert } from '@mui/material';
import { analyticsApi } from '@/services/analyticsApi';
import type { DashboardStats } from '@/services/analyticsApi';
import { motion } from 'framer-motion';
// In a real MVP, we'd use recharts or chart.js. Using simple MUI boxes for MVP visual representation.

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    analyticsApi.getDashboardStats()
      .then(setStats)
      .catch((err) => setError(err?.response?.data?.message || 'Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 10 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!stats) return null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Platform Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Insights across all student screenings.
        </Typography>
      </motion.div>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ flex: '1 1 200px' }}>
          <Card className="glass-card" sx={{ p: 3, borderRadius: 4, textAlign: 'center' }}>
            <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main' }}>
              {stats.total_students}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">Total Students</Typography>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 200px' }}>
          <Card className="glass-card" sx={{ p: 3, borderRadius: 4, textAlign: 'center' }}>
            <Typography variant="h3" sx={{ fontWeight: 800, color: 'secondary.main' }}>
              {stats.total_screenings}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">Total Screenings</Typography>
          </Card>
        </Box>
        <Box sx={{ flex: '2 1 400px' }}>
          <Card className="glass-card" sx={{ p: 3, borderRadius: 4, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Risk Distribution</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '70%' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main">{stats.risk_distribution.low}</Typography>
                <Typography variant="caption">Low Risk</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main">{stats.risk_distribution.medium}</Typography>
                <Typography variant="caption">Medium Risk</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="error.main">{stats.risk_distribution.high}</Typography>
                <Typography variant="caption">High Risk</Typography>
              </Box>
            </Box>
          </Card>
        </Box>
      </Box>
      
      <Card className="glass-card" sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Monthly Screening Trend</Typography>
        <Box sx={{ height: 300, display: 'flex', alignItems: 'flex-end', gap: 2, pb: 4, pt: 2 }}>
           {stats.monthly_trend.map((point, index) => (
             <Box key={index} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
               <Box 
                 sx={{ 
                   width: '100%', 
                   bgcolor: 'primary.main', 
                   borderRadius: 1, 
                   height: `${(point.count / Math.max(1, ...stats.monthly_trend.map(d => d.count))) * 250}px`,
                   minHeight: '4px',
                   transition: 'height 1s ease'
                 }} 
               />
               <Typography variant="caption" color="text.secondary" sx={{ transform: 'rotate(-45deg)', whiteSpace: 'nowrap', mt: 2 }}>
                 {point.date.substring(5)}
               </Typography>
             </Box>
           ))}
           {stats.monthly_trend.length === 0 && (
             <Typography variant="body2" color="text.secondary" sx={{ m: 'auto' }}>No recent screening data available.</Typography>
           )}
        </Box>
      </Card>
    </Box>
  );
}
