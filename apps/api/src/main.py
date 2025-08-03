from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
import os
from dotenv import load_dotenv
from services.quiz_generator import extract_text_from_pdf, generate_quiz
from pydantic import BaseModel
from typing import List, Dict, Optional

# Cache data structures
class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    correct_index: int

class QuizMetadata(BaseModel):
    totalPages: int
    original_text_length: int
    was_summarized: bool
    num_questions: int
    topic: Optional[str] = None

class CachePayload(BaseModel):
    session_id: str
    questions: List[QuizQuestion]
    metadata: QuizMetadata

# In-memory cache
quiz_cache: Dict[str, CachePayload] = {}

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Quiz Generator API",
    description="API for generating quizzes from PDF files",
    version="1.0.0"
)

# Get allowed origins from environment variable or use default in development
allowed_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
if allowed_origins == ["*"]:
    allowed_origins = ["*"]
else:
    # Clean up the origins
    allowed_origins = [origin.strip() for origin in allowed_origins if origin.strip()]
    # Add localhost for development
    if os.getenv("ENVIRONMENT") != "production":
        allowed_origins.append("http://localhost:3000")

# Add CORS middleware with more specific configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Test route
@app.get("/")
async def root():
    return {"message": "Quiz Generator API"}

@app.get("/test-openai")
async def test_openai():
    """
    Tests if OpenAI API key is configured correctly
    """
    try:
        client = OpenAI()
        is_configured = bool(client.api_key)
    except Exception:
        is_configured = False
    
    return {
        "status": "OpenAI API key encontrada e configurada" if
        is_configured else "OpenAI API key não encontrada"
    }

@app.post("/generate-quiz")
async def create_quiz(
    file: UploadFile = File(...),
    num_questions: int = 10
):
    """
    Receives a PDF file and generates a quiz based on its content
    """
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    try:
        # Extract text from PDF
        text, pdf_metadata = await extract_text_from_pdf(file)
        
        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from PDF")
        
        # Calculate text length
        text_length = len(text)
        was_summarized = text_length > 4000
        
        # Generate quiz
        questions, topic = generate_quiz(text, num_questions)
        
        return {
            "status": "success",
            "questions": questions,
            "metadata": {
                "original_text_length": text_length,
                "was_summarized": was_summarized,
                "num_questions": len(questions),
                "pdf_info": {
                    "total_pages": pdf_metadata["total_pages"],
                    "pages_read": pdf_metadata["pages_read"],
                    "was_truncated": pdf_metadata["was_truncated"]
                },
                "topic": topic
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/cache")
async def get_quiz_cache(session_id: str = Query(...)):
    """Get cached quiz data for a session"""
    if session_id not in quiz_cache:
        raise HTTPException(status_code=404, detail="Cache not found")
    return quiz_cache[session_id]

@app.post("/api/cache")
async def save_quiz_cache(payload: CachePayload):
    """Save quiz data to cache"""
    quiz_cache[payload.session_id] = payload
    return {"status": "success"}

@app.delete("/api/cache")
async def delete_quiz_cache(session_id: str = Query(...)):
    """Delete cached quiz data for a session"""
    if session_id not in quiz_cache:
        raise HTTPException(status_code=404, detail="Cache not found")
    del quiz_cache[session_id]
    return {"status": "success"}