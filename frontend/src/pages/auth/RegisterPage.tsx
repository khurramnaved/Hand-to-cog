// =============================================
// Hand-To-Cog AI — Register Page
// =============================================

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
  MenuItem,
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, Person, Badge } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { supabase } from '@/services/supabase';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { getErrorMessage } from '@/utils';


const registerSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm_password: z.string(),
  role: z.enum(['teacher', 'admin', 'principal'] as const),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { showError, showSuccess } = useSnackbar();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'teacher',
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
            role: data.role,
          },
        },
      });

      if (error) throw error;
      
      setIsSuccess(true);
      showSuccess('Registration successful. Please check your email to verify.');
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
        <Card className="glass-card" sx={{ maxWidth: 420, p: 4, textAlign: 'center' }}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(34, 197, 94, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Email sx={{ color: '#22c55e', fontSize: 32 }} />
            </Box>
          </Box>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>Check your email</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            We've sent a verification link to your email address. Please click the link to activate your account.
          </Typography>
          <Button fullWidth variant="outlined" onClick={() => navigate('/login')}>
            Return to Login
          </Button>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ width: '100%', maxWidth: 480 }}>
        <Card className="glass-card" sx={{ borderRadius: 4, overflow: 'hidden' }}>
          <Box sx={{ p: 3, textAlign: 'center', borderBottom: '1px solid', borderColor: 'divider', background: 'rgba(255, 255, 255, 0.02)' }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }} className="gradient-text">Create Account</Typography>
            <Typography variant="body2" color="text.secondary">Join Hand-To-Cog AI</Typography>
          </Box>
          <CardContent sx={{ p: 4 }}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              
              <TextField
                fullWidth label="Full Name" autoFocus {...register('full_name')}
                error={!!errors.full_name} helperText={errors.full_name?.message}
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><Person color="action" /></InputAdornment> } }}
              />

              <TextField
                fullWidth label="Email Address" type="email" {...register('email')}
                error={!!errors.email} helperText={errors.email?.message}
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><Email color="action" /></InputAdornment> } }}
              />

              <TextField
                select fullWidth label="Role" defaultValue="teacher" {...register('role')}
                error={!!errors.role} helperText={errors.role?.message}
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><Badge color="action" /></InputAdornment> } }}
              >
                <MenuItem value="teacher">Teacher</MenuItem>
                <MenuItem value="principal">Principal</MenuItem>
                <MenuItem value="admin">Administrator</MenuItem>
              </TextField>

              <TextField
                fullWidth label="Password" type={showPassword ? 'text' : 'password'} {...register('password')}
                error={!!errors.password} helperText={errors.password?.message}
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start"><Lock color="action" /></InputAdornment>,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }
                }}
              />

              <TextField
                fullWidth label="Confirm Password" type={showPassword ? 'text' : 'password'} {...register('confirm_password')}
                error={!!errors.confirm_password} helperText={errors.confirm_password?.message}
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><Lock color="action" /></InputAdornment> } }}
              />

              <Button type="submit" fullWidth variant="contained" size="large" disabled={isLoading} sx={{ mt: 1, py: 1.5 }}>
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </Box>
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <Typography component="span" variant="body2" color="primary" sx={{ fontWeight: 600 }}>Sign in</Typography>
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}
