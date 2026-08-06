# =============================================
# Hand-To-Cog AI — Auth Models
# =============================================

# pyrefly: ignore [missing-import]
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime


class UserProfile(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    avatar_url: str | None = None
    is_active: bool
    last_login_at: datetime | None = None
    created_at: datetime
    updated_at: datetime


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str = Field(..., min_length=2)
    role: str = Field(default="teacher")


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1)


class LoginResponse(BaseModel):
    user: UserProfile
    access_token: str


class UpdateProfileRequest(BaseModel):
    full_name: str | None = Field(None, min_length=2)
    avatar_url: str | None = None
