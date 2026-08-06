# =============================================
# Hand-To-Cog AI — Upload Service
# =============================================

import os
import uuid
from typing import Any
from werkzeug.utils import secure_filename
from app.extensions import get_supabase_admin
from app.repositories.upload_repository import UploadRepository
from app.repositories.student_repository import StudentRepository

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}
BUCKET_NAME = "handwriting-samples"


def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


class UploadService:
    """Business logic for handling file uploads to Supabase Storage."""

    @staticmethod
    def upload_file(teacher_id: str, student_id: str, file_obj) -> dict[str, Any]:
        """Upload a file to Supabase storage and create a DB record."""
        
        # 1. Validate the student belongs to the teacher
        student = StudentRepository.get_by_id(student_id, teacher_id)
        if not student:
            raise ValueError("Student not found or access denied")

        # 2. Validate file
        if not file_obj or file_obj.filename == "":
            raise ValueError("No file provided")
            
        if not allowed_file(file_obj.filename):
            raise ValueError("File type not allowed. Must be PNG or JPEG.")

        # 3. Generate unique storage path
        original_filename = secure_filename(file_obj.filename)
        file_ext = original_filename.rsplit(".", 1)[1].lower()
        unique_id = str(uuid.uuid4())
        
        # Path: teacher_id/student_id/uuid.ext
        storage_path = f"{teacher_id}/{student_id}/{unique_id}.{file_ext}"
        
        file_bytes = file_obj.read()
        file_size = len(file_bytes)
        
        if file_size == 0:
            raise ValueError("Empty file")
            
        file_type = "image/png" if file_ext == "png" else "image/jpeg"

        supabase = get_supabase_admin()
        
        # Ensure bucket exists (or rely on UI/admin to create it)
        # We assume 'handwriting-samples' bucket is created in Supabase with public read access
        
        # 4. Upload to Supabase Storage
        try:
            res = supabase.storage.from_(BUCKET_NAME).upload(
                path=storage_path,
                file=file_bytes,
                file_options={"content-type": file_type}
            )
        except Exception as e:
            raise ValueError(f"Storage upload failed: {str(e)}")

        # 5. Get public URL
        try:
            public_url = supabase.storage.from_(BUCKET_NAME).get_public_url(storage_path)
        except Exception:
            # Fallback if method differs in python client
            public_url = f"{supabase.supabase_url}/storage/v1/object/public/{BUCKET_NAME}/{storage_path}"

        # 6. Create database record
        upload_data = {
            "teacher_id": teacher_id,
            "student_id": student_id,
            "file_name": original_filename,
            "file_url": public_url,
            "file_size": file_size,
            "file_type": file_type,
            "storage_path": storage_path,
            "status": "uploaded"
        }
        
        upload_record = UploadRepository.create(upload_data)
        if not upload_record:
            # Rollback storage upload if DB fails
            supabase.storage.from_(BUCKET_NAME).remove([storage_path])
            raise ValueError("Failed to create upload record in database")
            
        return upload_record

    @staticmethod
    def get_uploads_for_student(student_id: str, user_id: str, role: str) -> list[dict[str, Any]]:
        """Get all uploads for a student."""
        teacher_id_check = None if role in ["admin", "principal"] else user_id
        student = StudentRepository.get_by_id(student_id, teacher_id_check)
        
        if not student:
            raise ValueError("Student not found or access denied")
            
        return UploadRepository.get_all_for_student(student_id)
