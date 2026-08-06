// =============================================
// Hand-To-Cog AI — Student Detail Page
// =============================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton
} from '@mui/material';
import { ArrowBack, Assessment, Download } from '@mui/icons-material';
import { studentApi } from '@/services/studentApi';
import { reportApi } from '@/services/reportApi';
import type { Student, Report } from '@/types';
import { formatDate } from '@/utils';
import { motion } from 'framer-motion';

export default function StudentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const [studentData, allReports] = await Promise.all([
          studentApi.getById(id),
          reportApi.getAllReports()
        ]);
        setStudent(studentData);
        setReports(allReports.filter(r => r.student_id === id));
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to load student data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !student) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error || 'Student not found'}</Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/students')}>
          Back to Students
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/students')}>
          Back
        </Button>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            {student.full_name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Grade: {student.grade} | DOB: {formatDate(student.date_of_birth)}
          </Typography>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Assessment />}
            size="large"
            onClick={() => navigate('/upload', { state: { studentId: student.id } })}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Start Screening
          </Button>
        </motion.div>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ flex: '1 1 300px' }}>
          <Card className="glass-card" sx={{ p: 3, borderRadius: 4, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Student Profile
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Full Name</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{student.full_name}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Date of Birth</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{formatDate(student.date_of_birth)}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Gender</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, textTransform: 'capitalize' }}>{student.gender}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Grade Level</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{student.grade} {student.section && `(Sec: ${student.section})`}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Parent/Guardian</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{student.parent_name || 'N/A'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Parent Contact</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{student.parent_contact || 'N/A'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Additional Notes</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{student.notes || 'None'}</Typography>
              </Box>
            </Box>
          </Card>
        </Box>
        
        <Box sx={{ flex: '2 1 600px' }}>
          <Card className="glass-card" sx={{ p: 3, borderRadius: 4, height: '100%', minHeight: 400 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Screening History
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {reports.length === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  No screenings available yet.
                </Typography>
              </Box>
            ) : (
              <List>
                {reports.map((report) => (
                  <ListItem
                    key={report.id}
                    sx={{
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 2,
                      mb: 1,
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' }
                    }}
                    secondaryAction={
                      <IconButton edge="end" aria-label="download" color="primary" onClick={() => window.open(report.pdf_url, '_blank')}>
                        <Download />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={`Report from ${new Date(report.created_at).toLocaleDateString()}`}
                      secondary={`Score: ${(report.overall_score * 100).toFixed(1)}%`}
                    />
                    <Chip 
                      label={report.status} 
                      color={report.status === 'generated' ? 'success' : 'default'} 
                      size="small" 
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
