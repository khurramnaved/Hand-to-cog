// =============================================
// Hand-To-Cog AI — Dropzone Component
// =============================================

import { useState, useRef } from 'react';
import { Box, Typography, alpha, useTheme } from '@mui/material';
import { CloudUpload, InsertDriveFile } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface DropzoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // in bytes
}

export default function Dropzone({ 
  onFileSelect, 
  accept = 'image/png, image/jpeg, image/jpg', 
  maxSize = 10 * 1024 * 1024 
}: DropzoneProps) {
  const theme = useTheme();
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const validateAndProcessFile = (file: File) => {
    setError(null);
    
    // Check file type
    const acceptedTypes = accept.split(',').map(type => type.trim());
    const isAccepted = acceptedTypes.some(type => {
      // Very basic mime type checking
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.replace('/*', ''));
      }
      return file.type === type;
    });

    if (!isAccepted) {
      setError('Invalid file type. Please upload a PNG or JPEG image.');
      return;
    }

    if (file.size > maxSize) {
      setError(`File is too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB.`);
      return;
    }

    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file) validateAndProcessFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file) validateAndProcessFile(file);
    }
  };

  return (
    <Box>
      <Box
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        sx={{
          border: `2px dashed ${isDragActive ? theme.palette.primary.main : alpha(theme.palette.text.primary, 0.2)}`,
          borderRadius: 4,
          p: 6,
          bgcolor: isDragActive ? alpha(theme.palette.primary.main, 0.05) : 'background.paper',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          minHeight: 250,
          '&:hover': {
            borderColor: theme.palette.primary.main,
            bgcolor: alpha(theme.palette.primary.main, 0.02),
          }
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          accept={accept}
          style={{ display: 'none' }}
        />
        
        <motion.div
          animate={{ scale: isDragActive ? 1.1 : 1, y: isDragActive ? -10 : 0 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
            }}
          >
            <CloudUpload sx={{ fontSize: 40, color: theme.palette.primary.main }} />
          </Box>
        </motion.div>
        
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, textAlign: 'center' }}>
          {isDragActive ? 'Drop the file here...' : 'Drag & drop a handwriting sample'}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          or click to browse from your computer
        </Typography>
        
        <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
          <InsertDriveFile fontSize="small" />
          <Typography variant="caption">
            Supports PNG, JPG up to {Math.round(maxSize / 1024 / 1024)}MB
          </Typography>
        </Box>
      </Box>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Typography color="error" variant="body2" sx={{ mt: 2, textAlign: 'center', fontWeight: 500 }}>
              {error}
            </Typography>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
