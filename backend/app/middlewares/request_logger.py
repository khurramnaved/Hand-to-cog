# =============================================
# Hand-To-Cog AI — Request Logger Middleware
# =============================================

import logging
import time
from flask import Flask, request, g
from flask import Response

logger = logging.getLogger(__name__)


def register_request_logger(app: Flask) -> None:
    """Register request/response logging middleware."""

    @app.before_request
    def log_request_start() -> None:
        """Log incoming request and start timing."""
        g.request_start_time = time.time()
        logger.info(
            "→ %s %s from %s",
            request.method,
            request.path,
            request.remote_addr,
        )

    @app.after_request
    def log_request_end(response: Response) -> Response:
        """Log response status and duration."""
        duration_ms = 0.0
        start_time = getattr(g, "request_start_time", None)
        if start_time is not None:
            duration_ms = (time.time() - start_time) * 1000

        logger.info(
            "← %s %s → %d (%.1fms)",
            request.method,
            request.path,
            response.status_code,
            duration_ms,
        )

        # Add security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"

        return response
