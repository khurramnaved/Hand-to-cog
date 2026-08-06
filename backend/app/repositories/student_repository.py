# =============================================
# Hand-To-Cog AI — Student Repository
# =============================================

from typing import Any
from app.extensions import get_supabase_admin


class StudentRepository:
    """Data access layer for the students table."""

    @staticmethod
    def get_by_id(student_id: str, teacher_id: str | None = None) -> dict[str, Any] | None:
        """Fetch a student by ID. If teacher_id is provided, checks ownership."""
        supabase = get_supabase_admin()
        query = supabase.table("students").select("*").eq("id", student_id)
        if teacher_id:
            query = query.eq("teacher_id", teacher_id)
            
        response = query.execute()
        data = response.data
        return data[0] if data else None

    @staticmethod
    def get_all_for_teacher(teacher_id: str) -> list[dict[str, Any]]:
        """Fetch all students for a specific teacher."""
        supabase = get_supabase_admin()
        response = supabase.table("students").select("*").eq("teacher_id", teacher_id).order("created_at", desc=True).execute()
        return response.data

    @staticmethod
    def get_all_for_admin() -> list[dict[str, Any]]:
        """Fetch all students (for admin/principal)."""
        supabase = get_supabase_admin()
        response = supabase.table("students").select("*").order("created_at", desc=True).execute()
        return response.data

    @staticmethod
    def create(student_data: dict[str, Any]) -> dict[str, Any] | None:
        """Create a new student record."""
        supabase = get_supabase_admin()
        response = supabase.table("students").insert(student_data).execute()
        data = response.data
        return data[0] if data else None

    @staticmethod
    def update(student_id: str, updates: dict[str, Any]) -> dict[str, Any] | None:
        """Update an existing student record."""
        supabase = get_supabase_admin()
        response = supabase.table("students").update(updates).eq("id", student_id).execute()
        data = response.data
        return data[0] if data else None

    @staticmethod
    def delete(student_id: str) -> bool:
        """Delete a student record."""
        supabase = get_supabase_admin()
        response = supabase.table("students").delete().eq("id", student_id).execute()
        return len(response.data) > 0
