-- =============================================
-- Hand-To-Cog AI — Database Indexes
-- =============================================
-- Run this after schema.sql in the Supabase SQL Editor.

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users (role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON public.users (is_active);

-- Students indexes
CREATE INDEX IF NOT EXISTS idx_students_teacher_id ON public.students (teacher_id);
CREATE INDEX IF NOT EXISTS idx_students_grade ON public.students (grade);
CREATE INDEX IF NOT EXISTS idx_students_gender ON public.students (gender);
CREATE INDEX IF NOT EXISTS idx_students_is_active ON public.students (is_active);
CREATE INDEX IF NOT EXISTS idx_students_full_name ON public.students (full_name);
CREATE INDEX IF NOT EXISTS idx_students_created_at ON public.students (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_students_teacher_grade ON public.students (teacher_id, grade);

-- Uploads indexes
CREATE INDEX IF NOT EXISTS idx_uploads_student_id ON public.uploads (student_id);
CREATE INDEX IF NOT EXISTS idx_uploads_teacher_id ON public.uploads (teacher_id);
CREATE INDEX IF NOT EXISTS idx_uploads_status ON public.uploads (status);
CREATE INDEX IF NOT EXISTS idx_uploads_created_at ON public.uploads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_uploads_teacher_student ON public.uploads (teacher_id, student_id);

-- Screenings indexes
CREATE INDEX IF NOT EXISTS idx_screenings_upload_id ON public.screenings (upload_id);
CREATE INDEX IF NOT EXISTS idx_screenings_student_id ON public.screenings (student_id);
CREATE INDEX IF NOT EXISTS idx_screenings_teacher_id ON public.screenings (teacher_id);
CREATE INDEX IF NOT EXISTS idx_screenings_risk_level ON public.screenings (risk_level);
CREATE INDEX IF NOT EXISTS idx_screenings_created_at ON public.screenings (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_screenings_teacher_risk ON public.screenings (teacher_id, risk_level);
CREATE INDEX IF NOT EXISTS idx_screenings_student_created ON public.screenings (student_id, created_at DESC);

-- Reports indexes
CREATE INDEX IF NOT EXISTS idx_reports_screening_id ON public.reports (screening_id);
CREATE INDEX IF NOT EXISTS idx_reports_student_id ON public.reports (student_id);
CREATE INDEX IF NOT EXISTS idx_reports_teacher_id ON public.reports (teacher_id);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON public.reports (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports (status);

-- Teacher Notes indexes
CREATE INDEX IF NOT EXISTS idx_teacher_notes_screening_id ON public.teacher_notes (screening_id);
CREATE INDEX IF NOT EXISTS idx_teacher_notes_teacher_id ON public.teacher_notes (teacher_id);

-- Activity Logs indexes
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON public.activity_logs (action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity_type ON public.activity_logs (entity_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_created ON public.activity_logs (user_id, created_at DESC);
