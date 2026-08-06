// =============================================
// Hand-To-Cog AI — Snackbar Context
// =============================================

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Alert, Snackbar, Slide, type SlideProps } from '@mui/material';
import { SNACKBAR_DURATION_MS } from '@/constants';

type SnackbarSeverity = 'success' | 'error' | 'warning' | 'info';

interface SnackbarMessage {
  id: number;
  message: string;
  severity: SnackbarSeverity;
}

interface SnackbarContextValue {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
}

const SnackbarContext = createContext<SnackbarContextValue | undefined>(undefined);

let snackbarIdCounter = 0;

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

interface SnackbarProviderProps {
  children: ReactNode;
}

export function SnackbarProvider({ children }: SnackbarProviderProps) {
  const [snackbar, setSnackbar] = useState<SnackbarMessage | null>(null);
  const [open, setOpen] = useState(false);

  const showSnackbar = useCallback((message: string, severity: SnackbarSeverity) => {
    snackbarIdCounter += 1;
    setSnackbar({ id: snackbarIdCounter, message, severity });
    setOpen(true);
  }, []);

  const showSuccess = useCallback((message: string) => showSnackbar(message, 'success'), [showSnackbar]);
  const showError = useCallback((message: string) => showSnackbar(message, 'error'), [showSnackbar]);
  const showWarning = useCallback((message: string) => showSnackbar(message, 'warning'), [showSnackbar]);
  const showInfo = useCallback((message: string) => showSnackbar(message, 'info'), [showSnackbar]);

  const handleClose = useCallback((_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  }, []);

  const value = useMemo<SnackbarContextValue>(() => ({
    showSuccess,
    showError,
    showWarning,
    showInfo,
  }), [showSuccess, showError, showWarning, showInfo]);

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        key={snackbar?.id}
        open={open}
        autoHideDuration={SNACKBAR_DURATION_MS}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        slots={{ transition: SlideTransition }}
        sx={{ zIndex: 'var(--z-snackbar)' }}
      >
        <Alert
          onClose={handleClose}
          severity={snackbar?.severity ?? 'info'}
          variant="filled"
          elevation={6}
          sx={{
            borderRadius: 2,
            fontWeight: 500,
            minWidth: 280,
          }}
        >
          {snackbar?.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

export function useSnackbar(): SnackbarContextValue {
  const context = useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
}

export default SnackbarContext;
