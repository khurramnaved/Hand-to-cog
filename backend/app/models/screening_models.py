# =============================================
# Hand-To-Cog AI — Screening Models
# =============================================

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Dict, Any


class ScreeningResponse(BaseModel):
    id: str
    upload_id: str
    student_id: str
    teacher_id: str
    risk_level: str
    confidence_score: float
    probability: float
    prediction_label: str
    features: Dict[str, Any]
    shap_values: Dict[str, Any]
    shap_plot_url: str | None = None
    recommendation: str
    model_version: str
    processing_time_ms: int
    created_at: datetime
    updated_at: datetime
