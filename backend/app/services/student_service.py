# =============================================
# Hand-To-Cog AI — Student Service
# =============================================

from typing import Any
from app.repositories.student_repository import StudentRepository
from pydantic import ValidationError


class StudentService:
    """Business logic for student management."""

    @staticmethod
    def get_students(user_id: str, role: str) -> list[dict[str, Any]]:
        """Get students based on user role."""
        if role in ["admin", "principal"]:
            return StudentRepository.get_all_for_admin()
        return StudentRepository.get_all_for_teacher(user_id)

    @staticmethod
    def get_student_by_id(student_id: str, user_id: str, role: str) -> dict[str, Any]:
        """Get a single student."""
        teacher_id_check = None if role in ["admin", "principal"] else user_id
        student = StudentRepository.get_by_id(student_id, teacher_id_check)
        if not student:
            raise ValueError("Student not found or access denied")
        return student

    @staticmethod
    def create_student(teacher_id: str, data: dict[str, Any]) -> dict[str, Any]:
        """Create a new student."""
        student_data = {
            "teacher_id": teacher_id,
            "full_name": data["full_name"],
            "date_of_birth": data["date_of_birth"].isoformat() if hasattr(data["date_of_birth"], "isoformat") else data["date_of_birth"],
            "gender": data["gender"],
            "grade": data["grade"],
            "section": data.get("section"),
            "parent_name": data.get("parent_name"),
            "parent_contact": data.get("parent_contact"),
            "notes": data.get("notes")
        }
        
        student = StudentRepository.create(student_data)
        if not student:
            raise ValueError("Failed to create student")
        return student

    @staticmethod
    def update_student(student_id: str, teacher_id: str, role: str, data: dict[str, Any]) -> dict[str, Any]:
        """Update a student. Teachers can only update their own students."""
        teacher_id_check = None if role in ["admin", "principal"] else teacher_id
        student = StudentRepository.get_by_id(student_id, teacher_id_check)
        
        if not student:
            raise ValueError("Student not found or access denied")
            
        updates = {k: v for k, v in data.items() if v is not None}
        if "date_of_birth" in updates and hasattr(updates["date_of_birth"], "isoformat"):
            updates["date_of_birth"] = updates["date_of_birth"].isoformat()
            
        if not updates:
            return student
            
        updated = StudentRepository.update(student_id, updates)
        if not updated:
            raise ValueError("Failed to update student")
        return updated

    @staticmethod
    def delete_student(student_id: str, teacher_id: str, role: str) -> bool:
        """Delete a student. Teachers can only delete their own students."""
        teacher_id_check = None if role in ["admin", "principal"] else teacher_id
        student = StudentRepository.get_by_id(student_id, teacher_id_check)
        
        if not student:
            raise ValueError("Student not found or access denied")
            
        return StudentRepository.delete(student_id)
