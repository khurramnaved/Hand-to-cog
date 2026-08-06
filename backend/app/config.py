# =============================================
# Hand-To-Cog AI — Flask Configuration
# =============================================

import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()


class BaseConfig:
    """Base configuration shared across all environments."""

    # Flask
    SECRET_KEY: str = os.environ.get("FLASK_SECRET_KEY", "dev-secret-key-change-in-production")
    DEBUG: bool = False
    TESTING: bool = False

    # JWT
    JWT_SECRET_KEY: str = os.environ.get("JWT_SECRET_KEY", "dev-jwt-secret-change-in-production")
    JWT_ACCESS_TOKEN_EXPIRES: timedelta = timedelta(
        seconds=int(os.environ.get("JWT_ACCESS_TOKEN_EXPIRES", "3600"))
    )
    JWT_TOKEN_LOCATION: list[str] = ["headers"]
    JWT_HEADER_NAME: str = "Authorization"
    JWT_HEADER_TYPE: str = "Bearer"

    # Supabase
    SUPABASE_URL: str = os.environ.get("SUPABASE_URL", "")
    SUPABASE_ANON_KEY: str = os.environ.get("SUPABASE_ANON_KEY", "")
    SUPABASE_SERVICE_ROLE_KEY: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
    SUPABASE_JWT_SECRET: str = os.environ.get("SUPABASE_JWT_SECRET", "")

    # CORS
    CORS_ORIGINS: list[str] = [
        origin.strip()
        for origin in os.environ.get("CORS_ORIGINS", "http://localhost:5173").split(",")
    ]

    # Rate Limiting
    RATELIMIT_DEFAULT: str = os.environ.get("RATE_LIMIT_DEFAULT", "100/hour")
    RATELIMIT_AUTH: str = os.environ.get("RATE_LIMIT_AUTH", "20/hour")
    RATELIMIT_PREDICT: str = os.environ.get("RATE_LIMIT_PREDICT", "30/hour")
    RATELIMIT_STORAGE_URI: str = "memory://"

    # ML Model paths
    MODEL_PATH: str = os.environ.get("MODEL_PATH", "ml_models/model.pkl")
    SCALER_PATH: str = os.environ.get("SCALER_PATH", "ml_models/scaler.pkl")
    ENCODER_PATH: str = os.environ.get("ENCODER_PATH", "ml_models/encoder.pkl")
    MODEL_VERSION: str = os.environ.get("MODEL_VERSION", "1.0.0")

    # Storage
    STORAGE_BUCKET: str = os.environ.get("STORAGE_BUCKET", "handwriting-uploads")
    SHAP_PLOTS_BUCKET: str = os.environ.get("SHAP_PLOTS_BUCKET", "shap-plots")
    MAX_FILE_SIZE_MB: int = int(os.environ.get("MAX_FILE_SIZE_MB", "10"))
    MAX_FILE_SIZE_BYTES: int = MAX_FILE_SIZE_MB * 1024 * 1024

    # Logging
    LOG_LEVEL: str = os.environ.get("LOG_LEVEL", "INFO")

    @classmethod
    def validate(cls) -> list[str]:
        """Validate that all required environment variables are set."""
        errors: list[str] = []
        if not cls.SUPABASE_URL:
            errors.append("SUPABASE_URL is required")
        if not cls.SUPABASE_ANON_KEY:
            errors.append("SUPABASE_ANON_KEY is required")
        if not cls.SUPABASE_SERVICE_ROLE_KEY:
            errors.append("SUPABASE_SERVICE_ROLE_KEY is required")
        if cls.SECRET_KEY == "dev-secret-key-change-in-production":
            errors.append("FLASK_SECRET_KEY should be changed from default")
        return errors


class DevelopmentConfig(BaseConfig):
    """Development-specific configuration."""

    DEBUG = True
    LOG_LEVEL = "DEBUG"


class ProductionConfig(BaseConfig):
    """Production-specific configuration."""

    DEBUG = False
    TESTING = False
    LOG_LEVEL = "WARNING"
    RATELIMIT_STORAGE_URI = "memory://"

    @classmethod
    def validate(cls) -> list[str]:
        errors = super().validate()
        if cls.JWT_SECRET_KEY == "dev-jwt-secret-change-in-production":
            errors.append("JWT_SECRET_KEY must be set in production")
        return errors


class TestingConfig(BaseConfig):
    """Testing-specific configuration."""

    TESTING = True
    DEBUG = True
    SUPABASE_URL = "http://localhost:54321"
    SUPABASE_ANON_KEY = "test-anon-key"
    SUPABASE_SERVICE_ROLE_KEY = "test-service-key"
    RATELIMIT_ENABLED = False


def get_config() -> type[BaseConfig]:
    """Return the appropriate configuration class based on FLASK_ENV."""
    env = os.environ.get("FLASK_ENV", "development")
    configs: dict[str, type[BaseConfig]] = {
        "development": DevelopmentConfig,
        "production": ProductionConfig,
        "testing": TestingConfig,
    }
    return configs.get(env, DevelopmentConfig)
