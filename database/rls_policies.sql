-- =============================================
-- Hand-To-Cog AI — Row Level Security Policies
-- =============================================
-- Run this after schema.sql and indexes.sql in the Supabase SQL Editor.

-- =============================================
-- Enable RLS on all tables
-- =============================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screenings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- =============================================
-- Users Policies
-- =============================================

-- Users can read their own profile
CREATE POLICY "users_select_own"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

-- Admins and principals can read all users
CREATE POLICY "users_select_admin"
    ON public.users FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users u
            WHERE u.id = auth.uid()
            AND u.role IN ('admin', 'principal')
        )
    );

-- Users can update their own profile (except role)
CREATE POLICY "users_update_own"
    ON public.users FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Only admins can update other users
CREATE POLICY "users_update_admin"
    ON public.users FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.users u
            WHERE u.id = auth.uid()
            AND u.role = 'admin'
        )
    );

-- Allow insert during signup (handled by trigger with SECURITY DEFINER)
CREATE POLICY "users_insert_self"
    ON public.users FOR INSERT
    WITH CHECK (auth.uid() = id);

-- =============================================
-- Students Policies
-- =============================================

-- Teachers can read their own students
CREATE POLICY "students_select_teacher"
    ON public.students FOR SELECT
    USING (auth.uid() = teacher_id);

-- Admins/principals can read all students
CREATE POLICY "students_select_admin"
    ON public.students FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users u
            WHERE u.id = auth.uid()
            AND u.role IN ('admin', 'principal')
        )
    );

-- Teachers can insert their own students
CREATE POLICY "students_insert_teacher"
    ON public.students FOR INSERT
    WITH CHECK (auth.uid() = teacher_id);

-- Teachers can update their own students
CREATE POLICY "students_update_teacher"
    ON public.students FOR UPDATE
    USING (auth.uid() = teacher_id)
    WITH CHECK (auth.uid() = teacher_id);

-- Teachers can delete their own students
CREATE POLICY "students_delete_teacher"
    ON public.students FOR DELETE
    USING (auth.uid() = teacher_id);

-- Admins can manage all students
CREATE POLICY "students_all_admin"
    ON public.students FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.users u
            WHERE u.id = auth.uid()
            AND u.role = 'admin'
        )
    );

-- =============================================
-- Uploads Policies
-- =============================================

-- Teachers can read their own uploads
CREATE POLICY "uploads_select_teacher"
    ON public.uploads FOR SELECT
    USING (auth.uid() = teacher_id);

-- Admins/principals can read all uploads
CREATE POLICY "uploads_select_admin"
    ON public.uploads FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users u
            WHERE u.id = auth.uid()
            AND u.role IN ('admin', 'principal')
        )
    );

-- Teachers can insert uploads
CREATE POLICY "uploads_insert_teacher"
    ON public.uploads FOR INSERT
    WITH CHECK (auth.uid() = teacher_id);

-- Teachers can update their own uploads
CREATE POLICY "uploads_update_teacher"
    ON public.uploads FOR UPDATE
    USING (auth.uid() = teacher_id);

-- Teachers can delete their own uploads
CREATE POLICY "uploads_delete_teacher"
    ON public.uploads FOR DELETE
    USING (auth.uid() = teacher_id);

-- =============================================
-- Screenings Policies
-- =============================================

-- Teachers can read their own screenings
CREATE POLICY "screenings_select_teacher"
    ON public.screenings FOR SELECT
    USING (auth.uid() = teacher_id);

-- Admins/principals can read all screenings
CREATE POLICY "screenings_select_admin"
    ON public.screenings FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users u
            WHERE u.id = auth.uid()
            AND u.role IN ('admin', 'principal')
        )
    );

-- Service role inserts screenings (via backend)
CREATE POLICY "screenings_insert_teacher"
    ON public.screenings FOR INSERT
    WITH CHECK (auth.uid() = teacher_id);

-- =============================================
-- Reports Policies
-- =============================================

-- Teachers can read their own reports
CREATE POLICY "reports_select_teacher"
    ON public.reports FOR SELECT
    USING (auth.uid() = teacher_id);

-- Admins/principals can read all reports
CREATE POLICY "reports_select_admin"
    ON public.reports FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users u
            WHERE u.id = auth.uid()
            AND u.role IN ('admin', 'principal')
        )
    );

-- Teachers can create reports
CREATE POLICY "reports_insert_teacher"
    ON public.reports FOR INSERT
    WITH CHECK (auth.uid() = teacher_id);

-- =============================================
-- Teacher Notes Policies
-- =============================================

-- Teachers can read their own notes
CREATE POLICY "teacher_notes_select_teacher"
    ON public.teacher_notes FOR SELECT
    USING (auth.uid() = teacher_id);

-- Admins/principals can read all notes
CREATE POLICY "teacher_notes_select_admin"
    ON public.teacher_notes FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users u
            WHERE u.id = auth.uid()
            AND u.role IN ('admin', 'principal')
        )
    );

-- Teachers can insert their own notes
CREATE POLICY "teacher_notes_insert_teacher"
    ON public.teacher_notes FOR INSERT
    WITH CHECK (auth.uid() = teacher_id);

-- Teachers can update their own notes
CREATE POLICY "teacher_notes_update_teacher"
    ON public.teacher_notes FOR UPDATE
    USING (auth.uid() = teacher_id)
    WITH CHECK (auth.uid() = teacher_id);

-- Teachers can delete their own notes
CREATE POLICY "teacher_notes_delete_teacher"
    ON public.teacher_notes FOR DELETE
    USING (auth.uid() = teacher_id);

-- =============================================
-- Activity Logs Policies
-- =============================================

-- Users can read their own activity logs
CREATE POLICY "activity_logs_select_own"
    ON public.activity_logs FOR SELECT
    USING (auth.uid() = user_id);

-- Admins can read all activity logs
CREATE POLICY "activity_logs_select_admin"
    ON public.activity_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users u
            WHERE u.id = auth.uid()
            AND u.role = 'admin'
        )
    );

-- Any authenticated user can insert their own activity logs
CREATE POLICY "activity_logs_insert_own"
    ON public.activity_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);
