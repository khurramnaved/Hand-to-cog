# =============================================
# Hand-To-Cog AI — Analytics Controller
# =============================================

from flask import Blueprint, request, g
from app.utils.response import success_response, error_response
from app.middlewares.auth_middleware import require_auth
from app.extensions import get_supabase_admin
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)
analytics_bp = Blueprint("analytics", __name__)


@analytics_bp.route("/dashboard", methods=["GET"])
@require_auth
def get_dashboard_stats():
    """Get high-level stats for the analytics dashboard."""
    try:
        user = g.current_user
        supabase = get_supabase_admin()
        teacher_id = user["id"] if user["role"] == "teacher" else None

        # Base queries
        student_query = supabase.table("students").select("id", count="exact")
        screening_query = supabase.table("screenings").select("risk_level", count="exact")
        
        if teacher_id:
            student_query = student_query.eq("teacher_id", teacher_id)
            screening_query = screening_query.eq("teacher_id", teacher_id)
            
        students_count = student_query.execute().count or 0
        
        # Risk distribution
        screenings = screening_query.execute()
        risk_dist = {"low": 0, "medium": 0, "high": 0}
        
        if screenings.data:
            for s in screenings.data:
                risk = s.get("risk_level")
                if risk in risk_dist:
                    risk_dist[risk] += 1
                    
        total_screenings = sum(risk_dist.values())
        
        # 30-day trend mock (querying group by is complex via REST API directly without RPC,
        # so we fetch last 30 days and group in memory for MVP)
        thirty_days_ago = (datetime.now() - timedelta(days=30)).isoformat()
        trend_query = supabase.table("screenings").select("created_at").gte("created_at", thirty_days_ago)
        if teacher_id:
            trend_query = trend_query.eq("teacher_id", teacher_id)
            
        recent_screenings = trend_query.execute()
        
        # Group by day
        trend_data = {}
        if recent_screenings.data:
            for s in recent_screenings.data:
                date = s["created_at"][:10]
                trend_data[date] = trend_data.get(date, 0) + 1
                
        trend = [{"date": k, "count": v} for k, v in sorted(trend_data.items())]
        
        return success_response(data={
            "total_students": students_count,
            "total_screenings": total_screenings,
            "risk_distribution": risk_dist,
            "monthly_trend": trend
        })
        
    except Exception as e:
        logger.error(f"Failed to fetch analytics: {e}")
        return error_response(f"Analytics error: {str(e)}", status_code=500)
