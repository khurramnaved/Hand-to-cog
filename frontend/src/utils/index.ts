// =============================================
// Hand-To-Cog AI — Utility Functions
// =============================================

import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { DATE_FORMAT, DATETIME_FORMAT } from '@/constants';
import type { RiskLevel } from '@/types';

/**
 * Format a date string to a display format.
 */
export function formatDate(dateString: string): string {
  try {
    return format(parseISO(dateString), DATE_FORMAT);
  } catch {
    return dateString;
  }
}

/**
 * Format a date string to date + time format.
 */
export function formatDateTime(dateString: string): string {
  try {
    return format(parseISO(dateString), DATETIME_FORMAT);
  } catch {
    return dateString;
  }
}

/**
 * Format a date string to relative time (e.g., "2 hours ago").
 */
export function formatRelativeTime(dateString: string): string {
  try {
    return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
  } catch {
    return dateString;
  }
}

/**
 * Format a number as a percentage string (e.g., 0.85 → "85%").
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format file size in human-readable form.
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const unitIndex = Math.min(i, units.length - 1);
  const unit = units[unitIndex];
  if (unit === undefined) return `${bytes} B`;
  return `${(bytes / Math.pow(k, unitIndex)).toFixed(1)} ${unit}`;
}

/**
 * Capitalize the first letter of a string.
 */
export function capitalize(str: string): string {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Get the display label for a risk level.
 */
export function getRiskLabel(risk: RiskLevel): string {
  const labels: Record<RiskLevel, string> = {
    high: 'High Risk',
    medium: 'Medium Risk',
    low: 'Low Risk',
  };
  return labels[risk];
}

/**
 * Get the color for a risk level.
 */
export function getRiskColor(risk: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#22c55e',
  };
  return colors[risk];
}

/**
 * Debounce a function call.
 */
export function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delayMs: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delayMs);
  };
}

/**
 * Generate a unique client-side ID (not for database use).
 */
export function generateClientId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Safely parse a JSON string, returning null on failure.
 */
export function safeJsonParse<T>(json: string): T | null {
  try {
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

/**
 * Extract error message from various error formats.
 */
export function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object') {
    if ('error' in error) {
      const errObj = error as { error: { message?: string } };
      if (typeof errObj.error?.message === 'string') return errObj.error.message;
    }
    if ('message' in error) {
      const msgObj = error as { message: string };
      if (typeof msgObj.message === 'string') return msgObj.message;
    }
  }
  return 'An unexpected error occurred';
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Build query string from params object, omitting undefined/null values.
 */
export function buildQueryString(params: Record<string, string | number | boolean | undefined | null>): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  }
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

/**
 * Generate a color from a string.
 */
function stringToColor(string: string) {
  let hash = 0;
  let i;
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

/**
 * Generate Avatar props from a string name.
 */
export function stringAvatar(name: string) {
  const parts = name.split(' ');
  const initials = parts.length > 1 
    ? `${parts[0]?.[0] || ''}${parts[1]?.[0] || ''}` 
    : `${name[0] || ''}`;
    
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: initials.toUpperCase(),
  };
}
