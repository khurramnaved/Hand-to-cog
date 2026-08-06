# =============================================
# Hand-To-Cog AI — Middlewares Package
# =============================================

from app.middlewares.error_handler import register_error_handlers
from app.middlewares.request_logger import register_request_logger
from app.middlewares.auth_middleware import require_auth, require_role

__all__ = [
    "register_error_handlers",
    "register_request_logger",
    "require_auth",
    "require_role",
]
