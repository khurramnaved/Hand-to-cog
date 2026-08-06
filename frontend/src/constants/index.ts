// =============================================
// Hand-To-Cog AI — Application Constants
// =============================================

export const APP_NAME = 'Hand-To-Cog AI';
export const APP_DESCRIPTION = 'AI-powered handwriting screening platform for teachers';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

// API
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
export const API_TIMEOUT_MS = 30000;
export const API_PREDICTION_TIMEOUT_MS = 120000; // ML inference can be slow

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 25, 50] as const;

// File upload
export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg'] as const;
export const ACCEPTED_EXTENSIONS = '.png,.jpg,.jpeg';

// Risk level configuration
export const RISK_LEVEL_CONFIG = {
  high: {
    label: 'High Risk',
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.12)',
    icon: '🔴',
    description: 'Indicators suggest a high probability of learning disability. Professional evaluation is strongly recommended.',
  },
  medium: {
    label: 'Medium Risk',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.12)',
    icon: '🟡',
    description: 'Some indicators present. Monitoring and further screening recommended.',
  },
  low: {
    label: 'Low Risk',
    color: '#22c55e',
    bgColor: 'rgba(34, 197, 94, 0.12)',
    icon: '🟢',
    description: 'Few or no indicators detected. Continue regular monitoring.',
  },
} as const;

// Grade options
export const GRADE_OPTIONS = [
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6',
  'Grade 7',
  'Grade 8',
] as const;

// Section options
export const SECTION_OPTIONS = ['A', 'B', 'C', 'D'] as const;

// Gender options
export const GENDER_OPTIONS = [
  { value: 'male' as const, label: 'Male' },
  { value: 'female' as const, label: 'Female' },
  { value: 'other' as const, label: 'Other' },
] as const;

// Navigation items
export const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: 'Dashboard' },
  { path: '/students', label: 'Students', icon: 'People' },
  { path: '/upload', label: 'Upload', icon: 'CloudUpload' },
  { path: '/reports', label: 'Reports', icon: 'Description' },
  { path: '/analytics', label: 'Analytics', icon: 'BarChart' },
  { path: '/settings', label: 'Settings', icon: 'Settings' },
] as const;

// Snackbar
export const SNACKBAR_DURATION_MS = 5000;

// Date format
export const DATE_FORMAT = 'MMM dd, yyyy';
export const DATETIME_FORMAT = 'MMM dd, yyyy HH:mm';

// Local storage keys
export const STORAGE_KEYS = {
  THEME: 'hand-to-cog-theme',
  SIDEBAR_COLLAPSED: 'hand-to-cog-sidebar-collapsed',
} as const;
