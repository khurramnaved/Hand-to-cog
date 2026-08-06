# =============================================
# Hand-To-Cog AI — Pytest Fixtures
# =============================================

import pytest
from app import create_app
from app.config import Config

class TestConfig(Config):
    TESTING = True
    SUPABASE_URL = "http://localhost:8000"
    SUPABASE_KEY = "test-key"
    JWT_SECRET_KEY = "super-secret-test-key"

@pytest.fixture
def app():
    app = create_app(TestConfig)
    yield app

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def auth_headers(app):
    from flask_jwt_extended import create_access_token
    with app.app_context():
        # Mock user identity
        user_identity = {
            "id": "123e4567-e89b-12d3-a456-426614174000",
            "email": "teacher@test.com",
            "role": "teacher"
        }
        token = create_access_token(identity=user_identity)
        return {"Authorization": f"Bearer {token}"}
