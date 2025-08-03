from fastapi import APIRouter, HTTPException
from typing import Dict, List, Optional
from pydantic import BaseModel, Field
import time

router = APIRouter(prefix="/api")

# In-memory cache to store results data
results_cache: Dict[str, dict] = {}
results_cache_expiration: Dict[str, float] = {}  # Store expiration timestamps
CACHE_DURATION = 7200  # 2 hours in seconds

class QuizOption(BaseModel):
    question: str
    options: List[str]
    correct_index: int

class PdfInfo(BaseModel):
    total_pages: int
    pages_read: int
    was_truncated: bool

class QuizMetadata(BaseModel):
    topic: Optional[str] = None
    pdf_info: PdfInfo
    original_text_length: int
    was_summarized: bool
    num_questions: int
    processingTimeSeconds: int

class ResultsData(BaseModel):
    questions: List[QuizOption]
    metadata: QuizMetadata
    userName: str
    userAnswers: List[int]

@router.post("/cache/results/{session_id}")
async def save_results_cache(session_id: str, data: ResultsData):
    """Save results data to cache with 2-hour expiration"""
    print(f"Received results cache request for session {session_id}")
    
    results_cache[session_id] = data.dict()
    results_cache_expiration[session_id] = time.time() + CACHE_DURATION
    
    print(f"Results cache saved successfully for session {session_id}")
    return {"message": "Results cache saved successfully"}

@router.get("/cache/results/{session_id}")
async def get_results_cache(session_id: str):
    """Retrieve results data from cache if not expired"""
    print(f"Getting results cache for session {session_id}")
    
    # Clean expired caches
    current_time = time.time()
    expired_sessions = [
        sid for sid, exp_time in results_cache_expiration.items()
        if current_time > exp_time
    ]
    for sid in expired_sessions:
        results_cache.pop(sid, None)
        results_cache_expiration.pop(sid, None)

    # Check if session exists and is not expired
    if session_id not in results_cache or current_time > results_cache_expiration.get(session_id, 0):
        raise HTTPException(status_code=404, detail="Results cache not found or expired")

    cached_data = results_cache[session_id]
    print(f"Found results cache for session {session_id}")
    return cached_data

@router.delete("/cache/results/{session_id}")
async def delete_results_cache(session_id: str):
    """Delete results data from cache"""
    print(f"Deleting results cache for session {session_id}")
    if session_id in results_cache:
        results_cache.pop(session_id)
        results_cache_expiration.pop(session_id, None)
        print(f"Results cache deleted successfully for session {session_id}")
        return {"message": "Results cache deleted successfully"}
    raise HTTPException(status_code=404, detail="Results cache not found")