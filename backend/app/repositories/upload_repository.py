# =============================================
# Hand-To-Cog AI — Upload Repository
# =============================================

from typing import Any
from app.extensions import get_supabase_admin


class UploadRepository:
    """Data access layer for the uploads table."""

    @staticmethod
    def create(upload_data: dict[str, Any]) -> dict[str, Any] | None:
        """Create a new upload record."""
        supabase = get_supabase_admin()
        response = supabase.table("uploads").insert(upload_data).execute()
        data = response.data
        return data[0] if data else None

    @staticmethod
    def get_by_id(upload_id: str, teacher_id: str | None = None) -> dict[str, Any] | None:
        """Fetch an upload by ID."""
        supabase = get_supabase_admin()
        query = supabase.table("uploads").select("*").eq("id", upload_id)
        if teacher_id:
            query = query.eq("teacher_id", teacher_id)
            
        response = query.execute()
        data = response.data
        return data[0] if data else None

    @staticmethod
    def get_all_for_student(student_id: str) -> list[dict[str, Any]]:
        """Fetch all uploads for a specific student."""
        supabase = get_supabase_admin()
        response = supabase.table("uploads").select("*").eq("student_id", student_id).order("created_at", desc=True).execute()
        return response.data

    @staticmethod
    def update_status(upload_id: str, status: str) -> dict[str, Any] | None:
        """Update the status of an upload."""
        supabase = get_supabase_admin()
        response = supabase.table("uploads").update({"status": status}).eq("id", upload_id).execute()
        data = response.data
        return data[0] if data else None

    @staticmethod
    def delete(upload_id: str) -> bool:
        """Delete an upload record."""
        supabase = get_supabase_admin()
        response = supabase.table("uploads").delete().eq("id", upload_id).execute()
        return len(response.data) > 0
