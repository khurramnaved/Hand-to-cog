# =============================================
# Hand-To-Cog AI — Global Error Handlers
# =============================================

import logging
import traceback
from flask import Flask, request
from werkzeug.exceptions import HTTPException
from app.utils.response import error_response

logger = logging.getLogger(__name__)


def register_error_handlers(app: Flask) -> None:
    """Register global error handlers on the Flask app."""

    @app.errorhandler(400)
    def bad_request(error: HTTPException):  # type: ignore[type-arg]
        logger.warning(
            "Bad request: %s %s - %s",
            request.method,
            request.path,
            error.description,
        )
        return error_response(
            message=str(error.description) if error.description else "Bad request",
            code="BAD_REQUEST",
            status_code=400,
        )

    @app.errorhandler(401)
    def unauthorized(error: HTTPException):  # type: ignore[type-arg]
        logger.warning(
            "Unauthorized: %s %s",
            request.method,
            request.path,
        )
        return error_response(
            message="Authentication required",
            code="UNAUTHORIZED",
            status_code=401,
        )

    @app.errorhandler(403)
    def forbidden(error: HTTPException):  # type: ignore[type-arg]
        logger.warning(
            "Forbidden: %s %s",
            request.method,
            request.path,
        )
        return error_response(
            message="You do not have permission to access this resource",
            code="FORBIDDEN",
            status_code=403,
        )

    @app.errorhandler(404)
    def not_found(error: HTTPException):  # type: ignore[type-arg]
        logger.info(
            "Not found: %s %s",
            request.method,
            request.path,
        )
        return error_response(
            message="The requested resource was not found",
            code="NOT_FOUND",
            status_code=404,
        )

    @app.errorhandler(405)
    def method_not_allowed(error: HTTPException):  # type: ignore[type-arg]
        return error_response(
            message="Method not allowed",
            code="METHOD_NOT_ALLOWED",
            status_code=405,
        )

    @app.errorhandler(413)
    def payload_too_large(error: HTTPException):  # type: ignore[type-arg]
        return error_response(
            message="The uploaded file is too large",
            code="PAYLOAD_TOO_LARGE",
            status_code=413,
        )

    @app.errorhandler(422)
    def unprocessable_entity(error: HTTPException):  # type: ignore[type-arg]
        return error_response(
            message=str(error.description) if error.description else "Unprocessable entity",
            code="VALIDATION_ERROR",
            status_code=422,
        )

    @app.errorhandler(429)
    def rate_limit_exceeded(error: HTTPException):  # type: ignore[type-arg]
        logger.warning(
            "Rate limit exceeded: %s %s from %s",
            request.method,
            request.path,
            request.remote_addr,
        )
        return error_response(
            message="Too many requests. Please try again later.",
            code="RATE_LIMIT_EXCEEDED",
            status_code=429,
        )

    @app.errorhandler(500)
    def internal_server_error(error: HTTPException):  # type: ignore[type-arg]
        logger.error(
            "Internal server error: %s %s\n%s",
            request.method,
            request.path,
            traceback.format_exc(),
        )
        return error_response(
            message="An internal server error occurred",
            code="INTERNAL_ERROR",
            status_code=500,
        )

    @app.errorhandler(Exception)
    def handle_unexpected_error(error: Exception):
        logger.error(
            "Unexpected error: %s %s - %s\n%s",
            request.method,
            request.path,
            str(error),
            traceback.format_exc(),
        )
        return error_response(
            message="An unexpected error occurred",
            code="INTERNAL_ERROR",
            status_code=500,
        )
