# =============================================
# Hand-To-Cog AI — Upload Models
# =============================================

from pydantic import BaseModel
from datetime import datetime


class UploadResponse(BaseModel):
    id: str
    student_id: str
    teacher_id: str
    file_name: str
    file_url: str
    file_size: int
    file_type: str
    status: str
    created_at: datetime
    updated_at: datetime
