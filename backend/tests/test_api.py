# =============================================
# Hand-To-Cog AI — API Tests
# =============================================

import json
import pytest

def test_health_check(client):
    """Test the health check endpoint."""
    response = client.get('/api/v1/health')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data["status"] == "success"
    assert data["data"]["status"] == "healthy"

def test_protected_route_without_token(client):
    """Ensure protected routes reject requests without a token."""
    response = client.get('/api/v1/students')
    assert response.status_code == 401

def test_students_route_with_token(client, auth_headers, mocker):
    """Test fetching students with mock DB."""
    # Mock the repository call
    mocker.patch('app.repositories.student_repository.StudentRepository.get_all_for_teacher', return_value=[
        {"id": "s1", "full_name": "John Doe", "grade": "Grade 1"}
    ])
    
    response = client.get('/api/v1/students', headers=auth_headers)
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data["data"]) == 1
    assert data["data"][0]["full_name"] == "John Doe"

def test_prediction_orchestrator_mock(client, auth_headers, mocker):
    """Test prediction endpoint with mock inference."""
    mocker.patch('app.repositories.upload_repository.UploadRepository.get_by_id', return_value={
        "id": "u1", "student_id": "s1", "file_url": "http://mock-url.com/image.png"
    })
    mocker.patch('app.repositories.screening_repository.ScreeningRepository.get_by_upload_id', return_value=None)
    
    # Mock requests.get for image
    mock_response = mocker.Mock()
    mock_response.content = b"mock-image-data"
    mock_response.raise_for_status = mocker.Mock()
    mocker.patch('requests.get', return_value=mock_response)
    
    # Mock inference
    mocker.patch('app.services.inference_service.InferenceService.run_pipeline', return_value={
        "risk_level": "low",
        "confidence_score": 0.95,
        "probability": 0.95,
        "prediction_label": "low",
        "features": {},
        "shap_values": {},
        "recommendation": "Mock recommendation",
        "model_version": "v1.0.0-mock",
        "processing_time_ms": 100
    })
    
    # Mock save
    mocker.patch('app.repositories.screening_repository.ScreeningRepository.create', return_value={
        "id": "screen1", "risk_level": "low"
    })
    mocker.patch('app.repositories.upload_repository.UploadRepository.update_status')
    
    response = client.post('/api/v1/predict', json={"upload_id": "u1"}, headers=auth_headers)
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data["data"]["risk_level"] == "low"
    assert data["data"]["id"] == "screen1"

def test_analytics_dashboard(client, auth_headers, mocker):
    """Test analytics endpoint."""
    mock_query = mocker.Mock()
    mock_query.eq.return_value = mock_query
    mock_query.gte.return_value = mock_query
    mock_query.execute.return_value = mocker.Mock(count=10, data=[
        {"risk_level": "high", "created_at": "2026-08-01T12:00:00Z"},
        {"risk_level": "low", "created_at": "2026-08-02T12:00:00Z"}
    ])
    
    # Mock get_supabase_admin
    mocker.patch('app.controllers.analytics_controller.get_supabase_admin', return_value=mocker.Mock(
        table=mocker.Mock(return_value=mocker.Mock(
            select=mocker.Mock(return_value=mock_query)
        ))
    ))
    
    response = client.get('/api/v1/analytics/dashboard', headers=auth_headers)
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data["data"]["total_students"] == 10
    assert data["data"]["risk_distribution"]["high"] == 1
