# =============================================
# Hand-To-Cog AI — Student Controller
# =============================================

from flask import Blueprint, request, g
from pydantic import ValidationError
from app.models.student_models import StudentCreate, StudentUpdate
from app.services.student_service import StudentService
from app.utils.response import success_response, error_response, validation_error_response
from app.middlewares.auth_middleware import require_auth, require_role

student_bp = Blueprint("students", __name__)


@student_bp.route("", methods=["GET"])
@require_auth
def get_students():
    """Get all students (filtered by role)."""
    try:
        user = g.current_user
        students = StudentService.get_students(user["id"], user["role"])
        return success_response(data=students)
    except Exception as e:
        return error_response(f"Failed to fetch students: {str(e)}", status_code=500)


@student_bp.route("/<student_id>", methods=["GET"])
@require_auth
def get_student(student_id: str):
    """Get a specific student."""
    try:
        user = g.current_user
        student = StudentService.get_student_by_id(student_id, user["id"], user["role"])
        return success_response(data=student)
    except ValueError as e:
        return error_response(str(e), status_code=404)
    except Exception as e:
        return error_response(f"Failed to fetch student: {str(e)}", status_code=500)


@student_bp.route("", methods=["POST"])
@require_auth
def create_student():
    """Create a new student."""
    try:
        data = StudentCreate(**request.get_json() or {})
        user = g.current_user
        
        student = StudentService.create_student(
            teacher_id=user["id"],
            data=data.model_dump()
        )
        return success_response(data=student, message="Student created successfully", status_code=201)
        
    except ValidationError as e:
        return validation_error_response(e.errors())
    except ValueError as e:
        return error_response(str(e), status_code=400)
    except Exception as e:
        return error_response(f"Failed to create student: {str(e)}", status_code=500)


@student_bp.route("/<student_id>", methods=["PUT"])
@require_auth
def update_student(student_id: str):
    """Update a student."""
    try:
        data = StudentUpdate(**request.get_json() or {})
        user = g.current_user
        
        student = StudentService.update_student(
            student_id=student_id,
            teacher_id=user["id"],
            role=user["role"],
            data=data.model_dump(exclude_unset=True)
        )
        return success_response(data=student, message="Student updated successfully")
        
    except ValidationError as e:
        return validation_error_response(e.errors())
    except ValueError as e:
        return error_response(str(e), status_code=404)
    except Exception as e:
        return error_response(f"Failed to update student: {str(e)}", status_code=500)


@student_bp.route("/<student_id>", methods=["DELETE"])
@require_auth
def delete_student(student_id: str):
    """Delete a student."""
    try:
        user = g.current_user
        success = StudentService.delete_student(student_id, user["id"], user["role"])
        if success:
            return success_response(message="Student deleted successfully")
        return error_response("Failed to delete student", status_code=400)
    except ValueError as e:
        return error_response(str(e), status_code=404)
    except Exception as e:
        return error_response(f"Failed to delete student: {str(e)}", status_code=500)
