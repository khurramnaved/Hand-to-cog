# =============================================
# Hand-To-Cog AI — Auth Service
# =============================================

import logging
from datetime import datetime, timezone
from typing import Any
from gotrue.errors import AuthApiError
from app.extensions import get_supabase
from app.repositories.user_repository import UserRepository

logger = logging.getLogger(__name__)


class AuthService:
    """Business logic for authentication."""

    @staticmethod
    def register(email: str, password: str, full_name: str, role: str) -> dict[str, Any]:
        """
        Register a new user via Supabase Auth.
        The handle_new_user DB trigger will create the public.users record.
        """
        supabase = get_supabase()
        try:
            response = supabase.auth.sign_up(
                {
                    "email": email,
                    "password": password,
                    "options": {
                        "data": {
                            "full_name": full_name,
                            "role": role,
                        }
                    },
                }
            )

            if response.user is None:
                raise ValueError("Registration failed: no user returned")

            # Ensure the profile is created (sometimes triggers take a moment)
            user_id = response.user.id
            profile = UserRepository.get_by_id(user_id)

            if not profile:
                # If trigger failed or lagged, create manually
                profile = {
                    "id": user_id,
                    "email": email,
                    "full_name": full_name,
                    "role": role,
                }
                logger.warning(
                    f"Auth trigger may have failed for {user_id}. Relying on fallback profile."
                )

            return profile

        except AuthApiError as e:
            raise ValueError(e.message)

    @staticmethod
    def login(email: str, password: str) -> dict[str, Any]:
        """Login a user and return the profile and session."""
        supabase = get_supabase()
        try:
            response = supabase.auth.sign_in_with_password(
                {"email": email, "password": password}
            )
            
            if not response.session or not response.user:
                raise ValueError("Invalid login response")

            user_id = response.user.id
            profile = UserRepository.get_by_id(user_id)

            if not profile:
                raise ValueError("User profile not found")

            if not profile.get("is_active", True):
                raise ValueError("Account is deactivated")

            # Update last login time
            UserRepository.update(
                user_id, {"last_login_at": datetime.now(timezone.utc).isoformat()}
            )

            return {
                "user": profile,
                "access_token": response.session.access_token,
            }

        except AuthApiError as e:
            raise ValueError("Invalid email or password")

    @staticmethod
    def logout(access_token: str) -> None:
        """Logout the user (invalidate session in Supabase)."""
        supabase = get_supabase()
        try:
            # We must set the session before signing out
            supabase.auth.set_session(access_token, "dummy_refresh")
            supabase.auth.sign_out()
        except Exception as e:
            logger.error(f"Logout error: {e}")

    @staticmethod
    def get_profile(user_id: str) -> dict[str, Any]:
        """Get the current user's profile."""
        profile = UserRepository.get_by_id(user_id)
        if not profile:
            raise ValueError("User profile not found")
        return profile

    @staticmethod
    def update_profile(user_id: str, data: dict[str, Any]) -> dict[str, Any]:
        """Update the user's profile."""
        # Filter out None values
        updates = {k: v for k, v in data.items() if v is not None}
        if not updates:
            return AuthService.get_profile(user_id)
            
        profile = UserRepository.update(user_id, updates)
        if not profile:
            raise ValueError("Failed to update profile")
        return profile
