// =============================================
// Hand-To-Cog AI — Student Modal Component
// =============================================

import { useEffect } from 'react';
import { useForm as useHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  MenuItem,
} from '@mui/material';
import type { Student, CreateStudentData } from '@/types';

const studentSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be in YYYY-MM-DD format'),
  gender: z.enum(['male', 'female', 'other']),
  grade: z.string().min(1, 'Grade is required'),
  section: z.string().optional(),
  parent_name: z.string().optional(),
  parent_contact: z.string().optional(),
  notes: z.string().optional(),
});

interface StudentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateStudentData) => Promise<void>;
  student?: Student | null;
  isSubmitting?: boolean;
}

const GRADES = [
  'Pre-K', 'Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 
  'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8',
  'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'
];

export default function StudentModal({ open, onClose, onSubmit, student, isSubmitting }: StudentModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useHookForm<CreateStudentData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      full_name: '',
      date_of_birth: '',
      gender: 'other',
      grade: '',
      section: '',
      parent_name: '',
      parent_contact: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (student && open) {
      reset({
        full_name: student.full_name,
        date_of_birth: student.date_of_birth,
        gender: student.gender,
        grade: student.grade,
        section: student.section || '',
        parent_name: student.parent_name || '',
        parent_contact: student.parent_contact || '',
        notes: student.notes || '',
      });
    } else if (!open) {
      reset();
    }
  }, [student, open, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{student ? 'Edit Student' : 'Add New Student'}</DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Full Name"
            {...register('full_name')}
            error={!!errors.full_name}
            helperText={errors.full_name?.message}
          />
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <TextField
              fullWidth
              label="Date of Birth"
              type="date"
              slotProps={{ inputLabel: { shrink: true } }}
              {...register('date_of_birth')}
              error={!!errors.date_of_birth}
              helperText={errors.date_of_birth?.message}
            />
            <TextField
              fullWidth
              select
              label="Gender"
              defaultValue={student?.gender || 'other'}
              {...register('gender')}
              error={!!errors.gender}
              helperText={errors.gender?.message}
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <TextField
              fullWidth
              select
              label="Grade"
              defaultValue={student?.grade || ''}
              {...register('grade')}
              error={!!errors.grade}
              helperText={errors.grade?.message}
            >
              {GRADES.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Section (Optional)"
              {...register('section')}
              error={!!errors.section}
              helperText={errors.section?.message}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <TextField
              fullWidth
              label="Parent Name"
              {...register('parent_name')}
              error={!!errors.parent_name}
              helperText={errors.parent_name?.message}
            />
            <TextField
              fullWidth
              label="Parent Contact"
              {...register('parent_contact')}
              error={!!errors.parent_contact}
              helperText={errors.parent_contact?.message}
            />
          </Box>
          <TextField
            fullWidth
            label="Additional Notes"
            multiline
            rows={3}
            {...register('notes')}
            error={!!errors.notes}
            helperText={errors.notes?.message}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Student'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
