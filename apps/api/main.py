from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import openai
import os
from dotenv import load_dotenv

import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Check for OpenAI API key
if not os.getenv("OPENAI_API_KEY"):
    logger.error("OPENAI_API_KEY not found in environment variables!")
    raise ValueError("OPENAI_API_KEY not found in environment variables!")

app = FastAPI(title="Quiz Explanation API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

class QuestionExplanationRequest(BaseModel):
    question: str
    correct_answer: str
    user_answer: str
    options: List[str]

async def generate_explanation(question: str, correct_answer: str, user_answer: str, options: List[str]):
    try:
        logger.info(f"Generating explanation for question: {question}")
        prompt = f"""
        Question: {question}
        Available options: {', '.join(options)}
        User's answer: {user_answer}
        Correct answer: {correct_answer}

        Please explain why the correct answer is "{correct_answer}" and why "{user_answer}" is incorrect. 
        Be educational and encouraging in your explanation.
        """

        response = await openai.ChatCompletion.acreate(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=200
        )

        explanation = response.choices[0].message.content.strip()
        return {
            "explanation": explanation,
            "correct_answer": correct_answer,
            "user_answer": user_answer
        }

    except Exception as e:
        logger.error(f"Error generating explanation: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint to verify the API is running."""
    try:
        # Check if OpenAI API key is configured
        if not openai.api_key:
            raise HTTPException(status_code=500, detail="OpenAI API key not configured")
        return {"status": "healthy", "openai_configured": True}
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/explain")
async def get_explanation(request: QuestionExplanationRequest):
    try:
        logger.info("Received explanation request")
        return await generate_explanation(
            request.question,
            request.correct_answer,
            request.user_answer,
            request.options
        )
    except Exception as e:
        logger.error(f"Error in explanation endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")