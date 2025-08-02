from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from services.quiz_generator import extract_text_from_pdf, generate_quiz

app = FastAPI(
    title="PDF Quiz Generator API",
    description="API for generating quizzes from PDF documents using AI",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js development server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/test-openai")
async def test_openai():
    """
    Testa a configuração da API da OpenAI
    """
    is_configured = bool(settings.OPENAI_API_KEY)
    key_preview = f"{settings.OPENAI_API_KEY[:10]}..." if is_configured else None
    
    return {
        "status": "success" if is_configured else "error",
        "api_key_configured": is_configured,
        "key_preview": key_preview,
        "message": "OpenAI API key está configurada corretamente!" if is_configured else "OpenAI API key não encontrada"
    }

@app.post("/generate-quiz")
async def create_quiz(
    file: UploadFile = File(...),
    num_questions: int = 5
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