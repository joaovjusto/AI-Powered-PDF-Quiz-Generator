import os
from dotenv import load_dotenv

load_dotenv()

# Environment configuration
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
IS_PRODUCTION = ENVIRONMENT == "production"

# CORS configuration
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")
if CORS_ORIGINS == ["*"]:
    CORS_ORIGINS = ["*"]
else:
    # Ensure URLs are properly formatted
    CORS_ORIGINS = [origin.strip() for origin in CORS_ORIGINS if origin.strip()]

# API configuration
API_PREFIX = os.getenv("API_PREFIX", "")