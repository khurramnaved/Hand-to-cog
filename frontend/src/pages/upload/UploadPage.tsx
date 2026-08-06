// =============================================
// Hand-To-Cog AI — Upload Page
// =============================================

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  MenuItem,
  TextField,
  LinearProgress,
  Alert,
  alpha,
  useTheme,
} from '@mui/material';
import { CheckCircle, ArrowBack, Image as ImageIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Dropzone from '@/components/upload/Dropzone';
import { studentApi } from '@/services/studentApi';
import { uploadApi } from '@/services/uploadApi';
import type { Student } from '@/types';

export default function UploadPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>(location.state?.studentId || '');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load students for the dropdown
    studentApi.getAll()
      .then(setStudents)
      .catch(() => setError('Failed to load students. Please refresh.'));
  }, []);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setSuccess(false);
    setProgress(0);
    setUploadId(null);
    
    // Create preview
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
  };

  const handleUpload = async () => {
    if (!file || !selectedStudent) return;

    setIsUploading(true);
    setError(null);
    
    try {
      const result = await uploadApi.uploadFile(selectedStudent, file, (p) => setProgress(p));
      setUploadId(result.id);
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setSuccess(false);
    setProgress(0);
    setError(null);
    setUploadId(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: 900, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/students')}>
          Back
        </Button>
      </Box>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Upload Handwriting Sample
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Upload a high-quality scan or photo of the student's handwriting.
        </Typography>
      </motion.div>

      <Card className="glass-card" sx={{ p: { xs: 3, md: 5 }, borderRadius: 4 }}>
        {!success ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Select Student
              </Typography>
              <TextField
                select
                fullWidth
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                placeholder="Choose a student"
                disabled={isUploading}
                sx={{ maxWidth: 400 }}
              >
                <MenuItem value="" disabled>Select a student</MenuItem>
                {students.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.full_name} ({s.grade})
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Sample Image
              </Typography>
              
              {!file ? (
                <Dropzone onFileSelect={handleFileSelect} />
              ) : (
                <Box 
                  sx={{ 
                    p: 3, 
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 3,
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 3,
                    alignItems: 'center',
                    bgcolor: alpha(theme.palette.background.default, 0.5)
                  }}
                >
                  <Box 
                    sx={{ 
                      width: 150, 
                      height: 150, 
                      borderRadius: 2, 
                      overflow: 'hidden',
                      bgcolor: 'background.default',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <ImageIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
                    )}
                  </Box>
                  
                  <Box sx={{ flexGrow: 1, width: '100%' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {file.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}
                    </Typography>
                    
                    {isUploading ? (
                      <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="primary">Uploading...</Typography>
                          <Typography variant="body2" color="primary">{progress}%</Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button variant="outlined" color="error" size="small" onClick={handleReset}>
                          Remove
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Box>
              )}
            </Box>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                  <Alert severity="error">{error}</Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                disabled={!file || !selectedStudent || isUploading}
                onClick={handleUpload}
                sx={{ px: 4, borderRadius: 2 }}
              >
                {isUploading ? 'Uploading...' : 'Upload & Process'}
              </Button>
            </Box>
          </Box>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '2rem', paddingBottom: '2rem' }}
          >
            <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 3 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              Upload Successful!
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4, maxWidth: 400 }}>
              The handwriting sample has been successfully uploaded and is ready for ML screening.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outlined" onClick={handleReset}>
                Upload Another
              </Button>
              <Button variant="contained" color="primary" onClick={() => uploadId && navigate(`/prediction/${uploadId}`)}>
                View ML Results
              </Button>
            </Box>
          </motion.div>
        )}
      </Card>
    </Box>
  );
}
