# =============================================
# Hand-To-Cog AI — Predict Controller
# =============================================

import requests
from flask import Blueprint, request, g
from app.services.inference_service import InferenceService
from app.repositories.upload_repository import UploadRepository
from app.repositories.screening_repository import ScreeningRepository
from app.utils.response import success_response, error_response
from app.middlewares.auth_middleware import require_auth
import logging

logger = logging.getLogger(__name__)
predict_bp = Blueprint("predict", __name__)


@predict_bp.route("", methods=["POST"])
@require_auth
def create_prediction():
    """Execute prediction pipeline on an existing upload."""
    try:
        user = g.current_user
        data = request.get_json()
        
        upload_id = data.get("upload_id")
        if not upload_id:
            return error_response("upload_id is required", status_code=400)
            
        # 1. Verify upload belongs to user
        upload = UploadRepository.get_by_id(upload_id, user["id"])
        if not upload:
            return error_response("Upload not found or access denied", status_code=404)
            
        # 2. Check if already screened
        existing = ScreeningRepository.get_by_upload_id(upload_id)
        if existing:
            return success_response(data=existing, message="Prediction already exists for this upload")

        # 3. Fetch image from Supabase Storage URL
        logger.info(f"Fetching image from URL: {upload['file_url']}")
        try:
            image_response = requests.get(upload['file_url'], timeout=10)
            image_response.raise_for_status()
            file_bytes = image_response.content
        except requests.RequestException as e:
            return error_response(f"Failed to fetch image from storage: {str(e)}", status_code=502)

        # 4. Run ML Pipeline
        logger.info(f"Running inference pipeline for upload {upload_id}")
        prediction_result = InferenceService.run_pipeline(file_bytes)
        
        # 5. Save to Database
        screening_data = {
            "upload_id": upload_id,
            "student_id": upload["student_id"],
            "teacher_id": user["id"],
            **prediction_result
        }
        
        screening = ScreeningRepository.create(screening_data)
        if not screening:
            return error_response("Failed to save screening result", status_code=500)
            
        # 6. Update Upload Status
        UploadRepository.update_status(upload_id, "analyzed")
        
        return success_response(data=screening, message="Analysis complete", status_code=201)
        
    except ValueError as e:
        logger.warning(f"Validation error in prediction: {e}")
        return error_response(str(e), status_code=400)
    except Exception as e:
        logger.error(f"Prediction failed: {e}", exc_info=True)
        return error_response(f"Prediction failed: {str(e)}", status_code=500)


@predict_bp.route("/<screening_id>", methods=["GET"])
@require_auth
def get_prediction(screening_id: str):
    """Retrieve a specific screening result."""
    try:
        user = g.current_user
        screening = ScreeningRepository.get_by_id(screening_id, user["id"])
        
        if not screening:
            return error_response("Screening not found or access denied", status_code=404)
            
        return success_response(data=screening)
        
    except Exception as e:
        logger.error(f"Failed to fetch screening: {e}", exc_info=True)
        return error_response(str(e), status_code=500)
