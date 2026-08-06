// =============================================
// Hand-To-Cog AI — Reports List
// =============================================

import { useState, useEffect } from 'react';
import { Box, Typography, Card, CircularProgress, Chip, Alert } from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { Download } from '@mui/icons-material';
import { reportApi } from '@/services/reportApi';
import type { Report } from '@/types';
import { formatDate } from '@/utils';
import { motion } from 'framer-motion';

export default function ReportsList() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    reportApi.getAllReports()
      .then(setReports)
      .catch((err) => setError(err?.response?.data?.message || 'Failed to load reports'))
      .finally(() => setLoading(false));
  }, []);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Report ID', width: 300 },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 150,
      renderCell: (params) => {
        const status = params.value as string;
        return (
          <Chip 
            label={status} 
            color={status === 'generated' ? 'success' : 'warning'} 
            size="small" 
            sx={{ borderRadius: 1 }}
          />
        );
      }
    },
    { 
      field: 'created_at', 
      headerName: 'Generated On', 
      width: 200,
      renderCell: (params: any) => formatDate(params.row.created_at)
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Download',
      width: 150,
      getActions: (params: any) => [
        <GridActionsCellItem
          icon={<Download color="primary" />}
          label="Download PDF"
          onClick={() => window.open(params.row.pdf_url, '_blank')}
          key="download"
          disabled={!params.row.pdf_url}
        />
      ],
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Generated Reports
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Access and download professional PDF evaluation reports.
        </Typography>
      </motion.div>

      {error && <Alert severity="error">{error}</Alert>}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="glass-card" sx={{ height: 600, width: '100%', borderRadius: 4 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : (
            <DataGrid
              rows={reports}
              columns={columns}
              initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
              pageSizeOptions={[10, 25]}
              disableRowSelectionOnClick
              sx={{ border: 'none' }}
            />
          )}
        </Card>
      </motion.div>
    </Box>
  );
}
