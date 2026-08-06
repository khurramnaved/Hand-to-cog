// =============================================
// Hand-To-Cog AI — Upload Types
// =============================================

export type UploadStatus = 'uploaded' | 'processing' | 'analyzed' | 'failed';
export type AllowedFileType = 'image/png' | 'image/jpeg';

export interface Upload {
  id: string;
  student_id: string;
  teacher_id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  file_type: AllowedFileType;
  storage_path: string;
  status: UploadStatus;
  created_at: string;
  updated_at: string;
  student_name?: string;
}

export interface CreateUploadData {
  student_id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  file_type: AllowedFileType;
  storage_path: string;
}

export const ALLOWED_FILE_TYPES: AllowedFileType[] = ['image/png', 'image/jpeg'];
export const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg'];
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
