// =============================================
// Hand-To-Cog AI — Students List Page
// =============================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CircularProgress,
  Chip,
  Alert,
} from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Visibility,
  Edit,
  Delete,
  WarningAmber,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { studentApi } from '@/services/studentApi';
import type { Student, CreateStudentData } from '@/types';
import StudentModal from '@/components/students/StudentModal';

export default function StudentsList() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await studentApi.getAll();
      setStudents(data);
      setError('');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setModalOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setModalOpen(true);
  };

  const handleDeleteStudent = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentApi.delete(id);
        setStudents((prev) => prev.filter((s) => s.id !== id));
      } catch (err) {
        alert('Failed to delete student');
      }
    }
  };

  const handleModalSubmit = async (data: CreateStudentData) => {
    setIsSubmitting(true);
    try {
      if (selectedStudent) {
        const updated = await studentApi.update(selectedStudent.id, data);
        setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      } else {
        const created = await studentApi.create(data);
        setStudents((prev) => [created, ...prev]);
      }
      setModalOpen(false);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'full_name',
      headerName: 'Student Name',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'grade',
      headerName: 'Grade',
      width: 150,
      renderCell: (params) => (
        <Chip label={params.value} size="small" sx={{ borderRadius: 1 }} />
      ),
    },
    {
      field: 'date_of_birth',
      headerName: 'Date of Birth',
      width: 150,
    },
    {
      field: 'recent_screening',
      headerName: 'Latest Screening',
      width: 180,
      renderCell: () => (
        <Chip 
          icon={<WarningAmber fontSize="small" />} 
          label="Pending" 
          size="small" 
          color="warning" 
          variant="outlined"
        />
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Visibility color="info" />}
          label="View"
          onClick={() => navigate(`/students/${params.row.id}`)}
          key="view"
        />,
        <GridActionsCellItem
          icon={<Edit color="primary" />}
          label="Edit"
          onClick={() => handleEditStudent(params.row as Student)}
          key="edit"
        />,
        <GridActionsCellItem
          icon={<Delete color="error" />}
          label="Delete"
          onClick={() => handleDeleteStudent(params.row.id)}
          key="delete"
        />,
      ],
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            Students Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your student roster and view their screening history.
          </Typography>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            size="large"
            onClick={handleAddStudent}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Add Student
          </Button>
        </motion.div>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="glass-card" sx={{ height: 600, width: '100%', borderRadius: 4 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : (
            <DataGrid
              rows={students}
              columns={columns}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              pageSizeOptions={[10, 25, 50]}
              disableRowSelectionOnClick
              sx={{
                border: 'none',
                '& .MuiDataGrid-cell:focus': { outline: 'none' },
                '& .MuiDataGrid-row:hover': { bgcolor: 'action.hover' },
                '& .MuiDataGrid-columnHeaders': {
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                },
              }}
            />
          )}
        </Card>
      </motion.div>

      <StudentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        student={selectedStudent}
        isSubmitting={isSubmitting}
      />
    </Box>
  );
}
