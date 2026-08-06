// =============================================
// Hand-To-Cog AI — Recent Activity Component
// =============================================

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
} from '@mui/material';
import {
  UploadFile,
  CheckCircle,
  PersonAdd,
  WarningAmber,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Mock data for Phase 3 presentation
const MOCK_ACTIVITIES = [
  {
    id: 1,
    type: 'upload',
    title: 'New handwriting sample uploaded',
    description: 'Alice Johnson (Grade 2)',
    time: '10 minutes ago',
    status: 'info',
  },
  {
    id: 2,
    type: 'screening',
    title: 'Screening completed',
    description: 'Bob Smith - High risk indicator detected',
    time: '1 hour ago',
    status: 'warning',
  },
  {
    id: 3,
    type: 'student',
    title: 'New student added',
    description: 'Charlie Davis',
    time: '3 hours ago',
    status: 'success',
  },
  {
    id: 4,
    type: 'screening',
    title: 'Screening completed',
    description: 'Diana Wilson - Low risk',
    time: 'Yesterday',
    status: 'success',
  },
];

export default function RecentActivity() {
  const theme = useTheme();

  const getIcon = (type: string, status: string) => {
    switch (type) {
      case 'upload': return <UploadFile sx={{ color: theme.palette.info.main }} />;
      case 'screening': return status === 'warning' ? <WarningAmber sx={{ color: theme.palette.warning.main }} /> : <CheckCircle sx={{ color: theme.palette.success.main }} />;
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
        <List sx={{ p: 0 }}>
          {MOCK_ACTIVITIES.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ListItem
                sx={{
                  borderBottom: index < MOCK_ACTIVITIES.length - 1 ? '1px solid rgba(255,255,255,0.02)' : 'none',
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
      </CardContent>
    </Card>
  );
}
