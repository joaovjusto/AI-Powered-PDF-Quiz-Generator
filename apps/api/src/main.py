from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
import os
from dotenv import load_dotenv
from services.quiz_generator import extract_text_from_pdf, generate_quiz

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
    num_questions: int = 10  # Default changed to 10
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
        questions = generate_quiz(text, num_questions)
        
        # Debug
        print("Returning response:", {
            "status": "success",
            "questions": questions,
            "metadata": {
                "original_text_length": text_length,
                "was_summarized": was_summarized,
                "num_questions": len(questions) if questions else 0,
                "pdf_info": pdf_metadata
            }
        })
        
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
                }
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))