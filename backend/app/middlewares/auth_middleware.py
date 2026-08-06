# =============================================
# Hand-To-Cog AI — Auth Middleware
# =============================================

from functools import wraps
from flask import request, g
from app.extensions import get_supabase
from app.utils.response import error_response


def require_auth(f):
    """
    Decorator to require a valid Supabase JWT token.
    Extracts the user ID from the token and stores it in g.current_user.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        
        if not auth_header or not auth_header.startswith("Bearer "):
            return error_response("Missing or invalid Authorization header", "UNAUTHORIZED", 401)
            
        token = auth_header.split(" ")[1]
        supabase = get_supabase()
        
        try:
            # We get the user to verify the token is valid
            response = supabase.auth.get_user(token)
            if not response.user:
                return error_response("Invalid or expired token", "UNAUTHORIZED", 401)
                
            # Store the user context for the request
            g.current_user = {
                "id": response.user.id,
                "email": response.user.email,
                "role": response.user.user_metadata.get("role", "teacher")
            }
            return f(*args, **kwargs)
            
        except Exception as e:
            return error_response("Token validation failed", "UNAUTHORIZED", 401)
            
    return decorated_function


def require_role(allowed_roles: list[str]):
    """
    Decorator to require specific user roles.
    Must be used after @require_auth.
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user = getattr(g, "current_user", None)
            if not user:
                return error_response("Authentication required", "UNAUTHORIZED", 401)
                
            if user.get("role") not in allowed_roles:
                return error_response(
                    "You do not have permission to perform this action", 
                    "FORBIDDEN", 
                    403
                )
                
            return f(*args, **kwargs)
        return decorated_function
    return decorator
