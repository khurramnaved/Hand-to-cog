# =============================================
# Hand-To-Cog AI — Student Models
# =============================================

from pydantic import BaseModel, Field
from datetime import date, datetime


class StudentCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    date_of_birth: date
    gender: str = Field(..., max_length=20)
    grade: str = Field(..., max_length=20)
    section: str | None = None
    parent_name: str | None = None
    parent_contact: str | None = None
    notes: str | None = None


class StudentUpdate(BaseModel):
    full_name: str | None = Field(None, min_length=2, max_length=100)
    date_of_birth: date | None = None
    gender: str | None = Field(None, max_length=20)
    grade: str | None = Field(None, max_length=20)
    section: str | None = None
    parent_name: str | None = None
    parent_contact: str | None = None
    notes: str | None = None
