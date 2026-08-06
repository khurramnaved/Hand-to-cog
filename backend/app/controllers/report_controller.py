# =============================================
# Hand-To-Cog AI — Report Controller
# =============================================

from flask import Blueprint, request, g
from app.repositories.screening_repository import ScreeningRepository
from app.utils.response import success_response, error_response
from app.middlewares.auth_middleware import require_auth
from app.extensions import get_supabase_admin
import logging
import uuid
from datetime import datetime

logger = logging.getLogger(__name__)
report_bp = Blueprint("reports", __name__)


def generate_mock_pdf(screening_id: str) -> bytes:
    """Generate a dummy PDF byte stream for MVP."""
    from reportlab.pdfgen import canvas
    from io import BytesIO
    
    buffer = BytesIO()
    p = canvas.Canvas(buffer)
    p.drawString(100, 800, f"Hand-To-Cog AI - Screening Report")
    p.drawString(100, 780, f"Screening ID: {screening_id}")
    p.drawString(100, 760, f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    p.drawString(100, 740, "This is an auto-generated PDF report.")
    p.showPage()
    p.save()
    
    return buffer.getvalue()


@report_bp.route("/generate", methods=["POST"])
@require_auth
def generate_report():
    """Generate and store a PDF report for a screening."""
    try:
        user = g.current_user
        data = request.get_json()
        
        screening_id = data.get("screening_id")
        if not screening_id:
            return error_response("screening_id is required", status_code=400)
            
        screening = ScreeningRepository.get_by_id(screening_id, user["id"])
        if not screening:
            return error_response("Screening not found or access denied", status_code=404)
            
        # Generate PDF bytes
        pdf_bytes = generate_mock_pdf(screening_id)
        
        supabase = get_supabase_admin()
        bucket_name = "handwriting-samples" # Reusing same bucket or create a 'reports' bucket
        file_name = f"reports/{screening_id}_{uuid.uuid4().hex[:8]}.pdf"
        
        # Upload to Supabase
        supabase.storage.from_(bucket_name).upload(
            path=file_name,
            file=pdf_bytes,
            file_options={"content-type": "application/pdf"}
        )
        
        pdf_url = supabase.storage.from_(bucket_name).get_public_url(file_name)
        
        # Create DB record
        report_data = {
            "screening_id": screening_id,
            "student_id": screening["student_id"],
            "teacher_id": user["id"],
            "report_data": screening,
            "pdf_url": pdf_url,
            "status": "generated"
        }
        
        res = supabase.table("reports").insert(report_data).execute()
        
        return success_response(data=res.data[0], message="Report generated successfully")
        
    except Exception as e:
        logger.error(f"Failed to generate report: {e}")
        return error_response(f"Report generation failed: {str(e)}", status_code=500)


@report_bp.route("", methods=["GET"])
@require_auth
def list_reports():
    """List all generated reports."""
    try:
        user = g.current_user
        supabase = get_supabase_admin()
        
        query = supabase.table("reports").select("*").order("created_at", desc=True)
        if user["role"] == "teacher":
            query = query.eq("teacher_id", user["id"])
            
        res = query.execute()
        return success_response(data=res.data)
        
    except Exception as e:
        return error_response(f"Failed to fetch reports: {str(e)}", status_code=500)
