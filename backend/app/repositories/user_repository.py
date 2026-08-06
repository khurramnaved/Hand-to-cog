# =============================================
# Hand-To-Cog AI — User Repository
# =============================================

from typing import Any
from app.extensions import get_supabase_admin


class UserRepository:
    """Data access layer for the users table."""

    @staticmethod
    def get_by_id(user_id: str) -> dict[str, Any] | None:
        """Fetch a user profile by ID using the admin client."""
        supabase = get_supabase_admin()
        response = supabase.table("users").select("*").eq("id", user_id).execute()
        data = response.data
        return data[0] if data else None

    @staticmethod
    def get_by_email(email: str) -> dict[str, Any] | None:
        """Fetch a user profile by email using the admin client."""
        supabase = get_supabase_admin()
        response = supabase.table("users").select("*").eq("email", email).execute()
        data = response.data
        return data[0] if data else None

    @staticmethod
    def update(user_id: str, updates: dict[str, Any]) -> dict[str, Any] | None:
        """Update a user profile."""
        supabase = get_supabase_admin()
        response = (
            supabase.table("users").update(updates).eq("id", user_id).execute()
        )
        data = response.data
        return data[0] if data else None

    @staticmethod
    def list_users(role: str | None = None) -> list[dict[str, Any]]:
        """List all users, optionally filtered by role."""
        supabase = get_supabase_admin()
        query = supabase.table("users").select("*")
        if role:
            query = query.eq("role", role)
        response = query.order("created_at", desc=True).execute()
        return response.data
