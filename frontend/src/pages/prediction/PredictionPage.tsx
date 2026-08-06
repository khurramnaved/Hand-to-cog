// =============================================
// Hand-To-Cog AI — Prediction Results Page
// =============================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  LinearProgress,
} from '@mui/material';
import { ArrowBack, PictureAsPdf, Lightbulb } from '@mui/icons-material';
import { predictionApi } from '@/services/predictionApi';
import { reportApi } from '@/services/reportApi';
import type { Screening } from '@/types';
import { motion } from 'framer-motion';

export default function PredictionPage() {
  const { id } = useParams<{ id: string }>(); // uploadId or screeningId depending on flow
  const location = useLocation();
  const navigate = useNavigate();
  const uploadId = (location.state as any)?.studentId || id; // Note: previously passed studentId instead of uploadId, let's just fallback safely
  
  const [prediction, setPrediction] = useState<Screening | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);

  useEffect(() => {
    if (!uploadId) return;
    
    const fetchOrPredict = async () => {
      try {
        setLoading(true);
        // Attempt to create prediction (backend returns existing if already screened)
        const data = await predictionApi.createPrediction(uploadId);
        setPrediction(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to process prediction.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrPredict();
  }, [uploadId]);

  const handleGenerateReport = async () => {
    if (!prediction) return;
    try {
      setGeneratingReport(true);
      const report = await reportApi.generateReport(prediction.id);
      if (report.pdf_url) {
        window.open(report.pdf_url, '_blank');
      } else {
        alert('Report generated but PDF URL is missing.');
      }
    } catch (err: any) {
      alert('Failed to generate report: ' + (err?.response?.data?.message || 'Error'));
    } finally {
      setGeneratingReport(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 3 }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary">Running AI Pipeline...</Typography>
        <Typography variant="body2" color="text.secondary">Extracting features, computing SHAP values, predicting risk...</Typography>
      </Box>
    );
  }

  if (error || !prediction) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error || 'Prediction not found'}</Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/upload')}>
          Back to Upload
        </Button>
      </Box>
    );
  }

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)}>
          Back
        </Button>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            Screening Results
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Analysis completed in {prediction.processing_time_ms}ms using {prediction.model_version}
          </Typography>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<PictureAsPdf />}
            size="large"
            onClick={handleGenerateReport}
            disabled={generatingReport}
            sx={{ borderRadius: 2, px: 3 }}
          >
            {generatingReport ? 'Generating...' : 'Export PDF Report'}
          </Button>
        </motion.div>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {/* Risk Badge and Confidence */}
        <Box sx={{ flex: '1 1 300px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="glass-card" sx={{ p: 4, borderRadius: 4, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              <Typography variant="subtitle1" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>
                Detected Risk Level
              </Typography>
              <Chip 
                label={prediction.risk_level.toUpperCase()} 
                color={getRiskColor(prediction.risk_level) as any}
                sx={{ fontSize: '2rem', height: 60, borderRadius: 3, px: 3, fontWeight: 800 }}
              />
              <Box sx={{ width: '100%', mt: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Confidence Score</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>{(prediction.confidence_score * 100).toFixed(1)}%</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={prediction.confidence_score * 100} 
                  color={getRiskColor(prediction.risk_level) as any}
                  sx={{ height: 12, borderRadius: 6 }}
                />
              </Box>
            </Card>
          </motion.div>
        </Box>

        {/* Recommendation */}
        <Box sx={{ flex: '2 1 600px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="glass-card" sx={{ p: 4, borderRadius: 4, height: '100%', bgcolor: 'rgba(25, 118, 210, 0.05)', border: '1px solid rgba(25, 118, 210, 0.1)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Lightbulb color="primary" sx={{ fontSize: 32 }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  AI Recommendation
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ fontSize: '1.2rem', lineHeight: 1.6, color: 'text.primary' }}>
                {prediction.recommendation}
              </Typography>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                SHAP Feature Explanations (Key Indicators)
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {Object.entries(prediction.shap_values || {}).slice(0, 5).map(([key, value]: [string, any]) => (
                  <Chip 
                    key={key} 
                    label={`${key.replace('_', ' ')}: ${Number(value).toFixed(3)}`} 
                    variant="outlined" 
                    color={Number(value) > 0 ? 'error' : 'success'}
                    sx={{ borderRadius: 2 }}
                  />
                ))}
              </Box>
            </Card>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
}
