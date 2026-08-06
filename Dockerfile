# =============================================
# Hand-To-Cog AI — Dockerfile
# =============================================
FROM python:3.11-slim as builder

WORKDIR /app

# Install system dependencies required for OpenCV, NumPy, etc.
RUN apt-get update && apt-get install -y \
    build-essential \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY backend/ /app/

# Expose port
EXPOSE 8000

# Set environment variables
ENV FLASK_APP=app.wsgi:app
ENV FLASK_ENV=production
ENV PYTHONUNBUFFERED=1

# Command to run gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "4", "--timeout", "120", "app.wsgi:app"]
