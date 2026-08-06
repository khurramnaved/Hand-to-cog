# =============================================
# Hand-To-Cog AI — Flask Extensions
# =============================================

from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from supabase import create_client, Client as SupabaseClient

# JWT Manager
jwt = JWTManager()

# CORS
cors = CORS()

# Rate Limiter
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["100/hour"],
    storage_uri="memory://",
)

# Supabase clients (initialized in app factory)
supabase_client: SupabaseClient | None = None
supabase_admin: SupabaseClient | None = None


def init_supabase(url: str, anon_key: str, service_role_key: str) -> None:
    """Initialize Supabase clients.

    Creates two clients:
    - supabase_client: Uses the anon key, respects RLS policies
    - supabase_admin: Uses the service role key, bypasses RLS (for server-side operations)
    """
    global supabase_client, supabase_admin
    supabase_client = create_client(url, anon_key)
    supabase_admin = create_client(url, service_role_key)


def get_supabase() -> SupabaseClient:
    """Get the Supabase client (anon key, respects RLS)."""
    if supabase_client is None:
        raise RuntimeError("Supabase client not initialized. Call init_supabase() first.")
    return supabase_client


def get_supabase_admin() -> SupabaseClient:
    """Get the Supabase admin client (service role key, bypasses RLS)."""
    if supabase_admin is None:
        raise RuntimeError("Supabase admin client not initialized. Call init_supabase() first.")
    return supabase_admin
