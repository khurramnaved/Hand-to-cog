# =============================================
# Hand-To-Cog AI — Health Check Controller
# =============================================

from flask import Blueprint
from app.utils.response import success_response

health_bp = Blueprint("health", __name__)


@health_bp.route("/health", methods=["GET"])
def api_health():
    """API health check endpoint."""
    return success_response(
        data={
            "service": "hand-to-cog-api",
            "status": "healthy",
        },
        message="API is running",
    )
