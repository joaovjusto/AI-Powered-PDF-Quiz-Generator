from fastapi import APIRouter, HTTPException
from typing import Dict, List, Optional
from pydantic import BaseModel, Field
import time

router = APIRouter(prefix="/api")

# In-memory cache to store quiz data
quiz_cache: Dict[str, dict] = {}
cache_expiration: Dict[str, float] = {}  # Store expiration timestamps
CACHE_DURATION = 7200  # 2 hours in seconds

class QuizOption(BaseModel):
    question: str
    options: List[str]
    correct_index: int

class QuizMetadata(BaseModel):
    totalPages: Optional[int] = Field(None, alias="totalPages")
    original_text_length: Optional[int] = None
    was_summarized: Optional[bool] = None
    num_questions: Optional[int] = None
    topic: Optional[str] = None

    class Config:
        allow_population_by_field_name = True

class CacheRequest(BaseModel):
    session_id: str
    questions: List[QuizOption]
    metadata: QuizMetadata

    class Config:
        schema_extra = {
            "example": {
                "session_id": "123e4567-e89b-12d3-a456-426614174000",
                "questions": [
                    {
                        "question": "Sample question?",
                        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
                        "correct_index": 0
                    }
                ],
                "metadata": {
                    "totalPages": 1,
                    "original_text_length": 1000,
                    "was_summarized": False,
                    "num_questions": 1,
                    "topic": "Sample Topic"
                }
            }
        }

@router.post("/cache")
async def save_quiz_cache(data: CacheRequest):
    """Save quiz data to cache with 2-hour expiration"""
    print(f"Received cache request for session {data.session_id}")
    print(f"Request data: {data.dict()}")
    
    quiz_cache[data.session_id] = {
        "questions": [q.dict() for q in data.questions],
        "metadata": data.metadata.dict(by_alias=True)
    }
    cache_expiration[data.session_id] = time.time() + CACHE_DURATION
    
    print(f"Cache saved successfully for session {data.session_id}")
    return {"message": "Cache saved successfully"}

@router.get("/cache")
async def get_quiz_cache(session_id: str):
    """Retrieve quiz data from cache if not expired"""
    print(f"Getting cache for session {session_id}")
    
    # Clean expired caches
    current_time = time.time()
    expired_sessions = [
        sid for sid, exp_time in cache_expiration.items()
        if current_time > exp_time
    ]
    for sid in expired_sessions:
        quiz_cache.pop(sid, None)
        cache_expiration.pop(sid, None)

    # Check if session exists and is not expired
    if session_id not in quiz_cache or current_time > cache_expiration.get(session_id, 0):
        raise HTTPException(status_code=404, detail="Cache not found or expired")

    cached_data = quiz_cache[session_id]
    print(f"Found cache for session {session_id}: {cached_data}")
    return cached_data

@router.delete("/cache")
async def delete_quiz_cache(session_id: str):
    """Delete quiz data from cache"""
    print(f"Deleting cache for session {session_id}")
    if session_id in quiz_cache:
        quiz_cache.pop(session_id)
        cache_expiration.pop(session_id, None)
        print(f"Cache deleted successfully for session {session_id}")
        return {"message": "Cache deleted successfully"}
    raise HTTPException(status_code=404, detail="Cache not found")