// =============================================
// Hand-To-Cog AI — Recent Activity Component
// =============================================

import { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Box,
  alpha,
  useTheme,
  CircularProgress,
} from '@mui/material';
import {
  UploadFile,
  CheckCircle,
  PersonAdd,
  WarningAmber,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { studentApi } from '@/services/studentApi';
import { reportApi } from '@/services/reportApi';

interface ActivityItem {
  id: string;
  type: 'upload' | 'screening' | 'student';
  title: string;
  description: string;
  time: string;
  status: 'info' | 'warning' | 'success';
  timestamp: Date;
}

export default function RecentActivity() {
  const theme = useTheme();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivity() {
      try {
        const [students, reports] = await Promise.all([
          studentApi.getAll(),
          reportApi.getAllReports()
        ]);

        const studentActivities: ActivityItem[] = students.map(s => ({
          id: `student-${s.id}`,
          type: 'student',
          title: 'New student added',
          description: s.full_name,
          time: new Date(s.created_at).toLocaleDateString(),
          status: 'success',
          timestamp: new Date(s.created_at)
        }));

        const reportActivities: ActivityItem[] = reports.map(r => ({
          id: `report-${r.id}`,
          type: 'screening',
          title: 'Screening completed',
          description: `Score: ${(r.overall_score * 100).toFixed(1)}%`,
          time: new Date(r.created_at).toLocaleDateString(),
          status: 'info',
          timestamp: new Date(r.created_at)
        }));

        const combined = [...studentActivities, ...reportActivities]
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
          .slice(0, 5); // top 5 most recent

        setActivities(combined);
      } catch (error) {
        console.error('Failed to load activity:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchActivity();
  }, []);

  const getIcon = (type: string, status: string) => {
    switch (type) {
      case 'upload': return <UploadFile sx={{ color: theme.palette.info.main }} />;
      case 'screening': return status === 'warning' ? <WarningAmber sx={{ color: theme.palette.warning.main }} /> : <CheckCircle sx={{ color: theme.palette.info.main }} />;
      case 'student': return <PersonAdd sx={{ color: theme.palette.success.main }} />;
      default: return <CheckCircle />;
    }
  };

  const getBgColor = (status: string) => {
    switch (status) {
      case 'info': return alpha(theme.palette.info.main, 0.1);
      case 'warning': return alpha(theme.palette.warning.main, 0.1);
      case 'success': return alpha(theme.palette.success.main, 0.1);
      default: return alpha(theme.palette.primary.main, 0.1);
    }
  };

  return (
    <Card className="glass-card" sx={{ borderRadius: 4, height: '100%' }}>
      <CardHeader 
        title="Recent Activity" 
        titleTypographyProps={{ variant: 'h6', fontWeight: 700 }}
        sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)', pb: 2 }}
      />
      <CardContent sx={{ p: 0 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : activities.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">No recent activity found.</Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ListItem
                  sx={{
                    borderBottom: index < activities.length - 1 ? '1px solid rgba(255,255,255,0.02)' : 'none',
                    py: 2.5,
                    px: 3,
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.02)',
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: getBgColor(activity.status) }}>
                      {getIcon(activity.type, activity.status)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {activity.title}
                      </Typography>
                    }
                    secondary={
                      <Box component="span" sx={{ display: 'flex', flexDirection: 'column', mt: 0.5 }}>
                        <Typography component="span" variant="body2" color="text.secondary">
                          {activity.description}
                        </Typography>
                        <Typography component="span" variant="caption" color="text.disabled" sx={{ mt: 0.5 }}>
                          {activity.time}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              </motion.div>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}
