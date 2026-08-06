# =============================================
# Hand-To-Cog AI — Upload Controller
# =============================================

from flask import Blueprint, request, g
from app.services.upload_service import UploadService
from app.utils.response import success_response, error_response
from app.middlewares.auth_middleware import require_auth

upload_bp = Blueprint("uploads", __name__)


@upload_bp.route("/student/<student_id>", methods=["POST"])
@require_auth
def upload_file(student_id: str):
    """Upload a handwriting sample for a student."""
    try:
        user = g.current_user
        
        # Files are in request.files
        if "file" not in request.files:
            return error_response("No file provided in the request", status_code=400)
            
        file_obj = request.files["file"]
        
        upload_record = UploadService.upload_file(
            teacher_id=user["id"],
            student_id=student_id,
            file_obj=file_obj
        )
        
        return success_response(data=upload_record, message="File uploaded successfully", status_code=201)
        
    except ValueError as e:
        return error_response(str(e), status_code=400)
    except Exception as e:
        return error_response(f"Upload failed: {str(e)}", status_code=500)


@upload_bp.route("/student/<student_id>", methods=["GET"])
@require_auth
def get_student_uploads(student_id: str):
    """Get all uploads for a specific student."""
    try:
        user = g.current_user
        uploads = UploadService.get_uploads_for_student(student_id, user["id"], user["role"])
        return success_response(data=uploads)
    except ValueError as e:
        return error_response(str(e), status_code=404)
    except Exception as e:
        return error_response(f"Failed to fetch uploads: {str(e)}", status_code=500)
