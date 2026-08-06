# =============================================
# Hand-To-Cog AI — Security Utilities
# =============================================

import re
import hashlib
import secrets
from typing import Any


def sanitize_filename(filename: str) -> str:
    """Sanitize a filename to prevent path traversal and injection attacks."""
    # Remove path separators
    filename = filename.replace("/", "").replace("\\", "")
    # Remove null bytes
    filename = filename.replace("\x00", "")
    # Only allow alphanumeric, dashes, underscores, dots
    filename = re.sub(r"[^\w\-.]", "_", filename)
    # Prevent hidden files
    filename = filename.lstrip(".")
    # Limit length
    if len(filename) > 255:
        name, ext = filename.rsplit(".", 1) if "." in filename else (filename, "")
        filename = f"{name[:200]}.{ext}" if ext else name[:255]
    return filename or "unnamed_file"


def generate_storage_path(teacher_id: str, student_id: str, filename: str) -> str:
    """Generate a unique storage path for an uploaded file."""
    safe_filename = sanitize_filename(filename)
    unique_suffix = secrets.token_hex(8)
    return f"uploads/{teacher_id}/{student_id}/{unique_suffix}_{safe_filename}"


def validate_file_type(content_type: str, allowed_types: list[str]) -> bool:
    """Validate that a file's content type is in the allowed list."""
    return content_type.lower() in [t.lower() for t in allowed_types]


def compute_file_hash(file_bytes: bytes) -> str:
    """Compute SHA-256 hash of file bytes for integrity checking."""
    return hashlib.sha256(file_bytes).hexdigest()


def sanitize_input(value: Any) -> str:
    """Sanitize user input to prevent XSS."""
    if not isinstance(value, str):
        return str(value)
    # Remove HTML tags
    value = re.sub(r"<[^>]+>", "", value)
    # Escape special characters
    value = (
        value.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
        .replace("'", "&#x27;")
    )
    return value.strip()


def validate_uuid(value: str) -> bool:
    """Validate that a string is a valid UUID v4."""
    uuid_pattern = re.compile(
        r"^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$",
        re.IGNORECASE,
    )
    return bool(uuid_pattern.match(value))
