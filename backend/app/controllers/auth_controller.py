# =============================================
# Hand-To-Cog AI — Auth Controller
# =============================================

from flask import Blueprint, request
from pydantic import ValidationError
from app.models.auth_models import RegisterRequest, LoginRequest, UpdateProfileRequest
from app.services.auth_service import AuthService
from app.utils.response import success_response, error_response, validation_error_response
from app.middlewares.auth_middleware import require_auth
from flask import g

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    """Register a new user."""
    try:
        data = RegisterRequest(**request.get_json() or {})
        
        # In a real app, you might want to restrict who can register as 'admin'
        if data.role not in ["teacher", "admin", "principal"]:
            return error_response("Invalid role specified", status_code=400)
            
        profile = AuthService.register(
            email=data.email,
            password=data.password,
            full_name=data.full_name,
            role=data.role,
        )
        return success_response(data=profile, message="Registration successful", status_code=201)
        
    except ValidationError as e:
        return validation_error_response(e.errors())
    except ValueError as e:
        return error_response(str(e), status_code=400)
    except Exception as e:
        return error_response("Registration failed", status_code=500)


@auth_bp.route("/login", methods=["POST"])
def login():
    """Login and receive a JWT."""
    try:
        data = LoginRequest(**request.get_json() or {})
        result = AuthService.login(email=data.email, password=data.password)
        return success_response(data=result, message="Login successful")
        
    except ValidationError as e:
        return validation_error_response(e.errors())
    except ValueError as e:
        return error_response(str(e), status_code=401)
    except Exception as e:
        return error_response("Login failed", status_code=500)


@auth_bp.route("/logout", methods=["POST"])
@require_auth
def logout():
    """Logout the current user."""
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        AuthService.logout(token)
    return success_response(message="Logged out successfully")


@auth_bp.route("/profile", methods=["GET"])
@require_auth
def get_profile():
    """Get the current user's profile."""
    try:
        profile = AuthService.get_profile(g.current_user["id"])
        return success_response(data=profile)
    except ValueError as e:
        return error_response(str(e), status_code=404)


@auth_bp.route("/profile", methods=["PUT"])
@require_auth
def update_profile():
    """Update the current user's profile."""
    try:
        data = UpdateProfileRequest(**request.get_json() or {})
        profile = AuthService.update_profile(
            user_id=g.current_user["id"],
            data=data.model_dump(exclude_unset=True)
        )
        return success_response(data=profile, message="Profile updated")
    except ValidationError as e:
        return validation_error_response(e.errors())
    except ValueError as e:
        return error_response(str(e), status_code=400)
