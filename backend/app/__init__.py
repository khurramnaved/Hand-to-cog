# =============================================
# Hand-To-Cog AI — Flask Application Factory
# =============================================

import logging
import sys
from flask import Flask
from app.config import get_config
from app.extensions import jwt, cors, limiter, init_supabase
from app.middlewares import register_error_handlers, register_request_logger


def create_app(config_class: type | None = None) -> Flask:
    """Create and configure the Flask application.

    Uses the application factory pattern for clean initialization,
    testability, and multiple instance support.

    Args:
        config_class: Optional configuration class override.
                      Defaults to environment-based selection.

    Returns:
        Configured Flask application instance.
    """
    app = Flask(__name__)

    # Load configuration
    if config_class is None:
        config_class = get_config()
    app.config.from_object(config_class)

    # Configure logging
    _configure_logging(app)
    logger = logging.getLogger(__name__)
    logger.info("Starting Hand-To-Cog AI API [env=%s]", app.config.get("ENV", "development"))

    # Validate configuration
    if hasattr(config_class, "validate"):
        errors = config_class.validate()
        if errors and not app.config.get("TESTING"):
            for error in errors:
                logger.warning("Configuration warning: %s", error)

    # Initialize extensions
    _init_extensions(app)

    # Register middlewares
    register_error_handlers(app)
    register_request_logger(app)

    # Register blueprints
    _register_blueprints(app)

    # Health check endpoint
    @app.route("/health", methods=["GET"])
    def health_check():
        return {"status": "healthy", "service": "hand-to-cog-api", "version": app.config.get("MODEL_VERSION", "1.0.0")}

    logger.info("Hand-To-Cog AI API initialized successfully")
    return app


def _configure_logging(app: Flask) -> None:
    """Configure structured logging."""
    log_level = getattr(logging, app.config.get("LOG_LEVEL", "INFO"))
    logging.basicConfig(
        level=log_level,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
        stream=sys.stdout,
    )
    # Reduce noisy loggers
    logging.getLogger("urllib3").setLevel(logging.WARNING)
    logging.getLogger("httpcore").setLevel(logging.WARNING)
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("hpack").setLevel(logging.WARNING)


def _init_extensions(app: Flask) -> None:
    """Initialize Flask extensions."""
    # JWT
    jwt.init_app(app)

    # CORS
    cors.init_app(
        app,
        resources={r"/api/*": {"origins": app.config.get("CORS_ORIGINS", ["*"])}},
        supports_credentials=True,
    )

    # Rate Limiter
    limiter.init_app(app)

    # Supabase
    supabase_url = app.config.get("SUPABASE_URL", "")
    supabase_anon = app.config.get("SUPABASE_ANON_KEY", "")
    supabase_service = app.config.get("SUPABASE_SERVICE_ROLE_KEY", "")

    if supabase_url and supabase_anon and supabase_service:
        init_supabase(supabase_url, supabase_anon, supabase_service)
    elif not app.config.get("TESTING"):
        logging.getLogger(__name__).warning(
            "Supabase credentials not configured. Database features will not work."
        )


def _register_blueprints(app: Flask) -> None:
    """Register all API blueprints."""
    from app.controllers.health_controller import health_bp
    from app.controllers.auth_controller import auth_bp
    from app.controllers.student_controller import student_bp
    from app.controllers.upload_controller import upload_bp

    app.register_blueprint(health_bp, url_prefix="/api/v1")
    app.register_blueprint(auth_bp, url_prefix="/api/v1/auth")
    app.register_blueprint(student_bp, url_prefix="/api/v1/students")
    app.register_blueprint(upload_bp, url_prefix="/api/v1/uploads")

    # Additional blueprints will be registered in subsequent phases:
    # - auth_bp (Phase 2)
    # - student_bp (Phase 4)
    # - upload_bp (Phase 5)
    # - predict_bp (Phase 7)
    # - report_bp (Phase 9)
    # - dashboard_bp (Phase 3)
    # - analytics_bp (Phase 10)
    # - settings_bp (Phase 11)
