# =============================================
# Hand-To-Cog AI — Screening Repository
# =============================================

from typing import Any
from app.extensions import get_supabase_admin

class ScreeningRepository:
    """Data access layer for the screenings table."""

    @staticmethod
    def create(data: dict[str, Any]) -> dict[str, Any] | None:
        """Create a new screening result."""
        supabase = get_supabase_admin()
        response = supabase.table("screenings").insert(data).execute()
        return response.data[0] if response.data else None

    @staticmethod
    def get_by_id(screening_id: str, teacher_id: str | None = None) -> dict[str, Any] | None:
        """Get screening by ID, optionally verifying teacher access."""
        supabase = get_supabase_admin()
        query = supabase.table("screenings").select("*, uploads(*)").eq("id", screening_id)
        if teacher_id:
            query = query.eq("teacher_id", teacher_id)
            
        response = query.execute()
        return response.data[0] if response.data else None

    @staticmethod
    def get_by_upload_id(upload_id: str) -> dict[str, Any] | None:
        """Get screening result for a specific upload."""
        supabase = get_supabase_admin()
        response = supabase.table("screenings").select("*").eq("upload_id", upload_id).execute()
        return response.data[0] if response.data else None

    @staticmethod
    def get_all_for_student(student_id: str) -> list[dict[str, Any]]:
        """Get all screenings for a specific student."""
        supabase = get_supabase_admin()
        response = supabase.table("screenings").select("*").eq("student_id", student_id).order("created_at", desc=True).execute()
        return response.data
