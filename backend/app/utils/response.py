# =============================================
# Hand-To-Cog AI — Standardized API Responses
# =============================================

from datetime import datetime, timezone
from typing import Any
from flask import jsonify
from flask import Response


def success_response(
    data: Any = None,
    message: str = "Success",
    status_code: int = 200,
) -> tuple[Response, int]:
    """Return a standardized success response."""
    body = {
        "success": True,
        "data": data,
        "message": message,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    return jsonify(body), status_code


def error_response(
    message: str = "An error occurred",
    code: str = "INTERNAL_ERROR",
    status_code: int = 500,
    details: dict[str, list[str]] | None = None,
) -> tuple[Response, int]:
    """Return a standardized error response."""
    body: dict[str, Any] = {
        "success": False,
        "error": {
            "code": code,
            "message": message,
        },
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    if details:
        body["error"]["details"] = details
    return jsonify(body), status_code


def paginated_response(
    data: list[Any],
    page: int,
    page_size: int,
    total_count: int,
    message: str = "Success",
) -> tuple[Response, int]:
    """Return a standardized paginated response."""
    total_pages = max(1, (total_count + page_size - 1) // page_size)
    body = {
        "success": True,
        "data": data,
        "pagination": {
            "page": page,
            "page_size": page_size,
            "total_count": total_count,
            "total_pages": total_pages,
            "has_next": page < total_pages,
            "has_previous": page > 1,
        },
        "message": message,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    return jsonify(body), 200


def validation_error_response(
    errors: dict[str, list[str]],
) -> tuple[Response, int]:
    """Return a standardized validation error response."""
    return error_response(
        message="Validation failed",
        code="VALIDATION_ERROR",
        status_code=422,
        details=errors,
    )
