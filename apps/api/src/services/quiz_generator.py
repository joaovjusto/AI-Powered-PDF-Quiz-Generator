import fitz
from openai import OpenAI
import json
from typing import List, Dict

async def extract_text_from_pdf(pdf_file) -> tuple[str, dict]:
    """
    Extracts text from a PDF file using PyMuPDF, limiting to 8 pages
    Returns a tuple with extracted text and metadata about the extraction
    """
    try:
        # Read file contents
        contents = await pdf_file.read()
        
        # Open PDF from bytes
        pdf_document = fitz.open(stream=contents, filetype="pdf")
        
        # Get total number of pages
        total_pages = len(pdf_document)
        pages_to_read = min(8, total_pages)
        
        # Extract text from first 8 pages
        text = ""
        for page_num in range(pages_to_read):
            text += pdf_document[page_num].get_text()
        
        metadata = {
            "total_pages": total_pages,
            "pages_read": pages_to_read,
            "was_truncated": total_pages > 8
        }
        
        return text.strip(), metadata
    except Exception as e:
        raise Exception(f"Error extracting text from PDF: {str(e)}")

def summarize_text(text: str, client: OpenAI) -> str:
    """
    Generates a summary of the text using OpenAI API
    """
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert at summarizing texts while maintaining key points and important concepts."},
                {"role": "user", "content": f"Create a detailed summary of the following text, keeping the most important concepts and information for question generation: \n\n{text[:8000]}"}
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        raise Exception(f"Error generating summary: {str(e)}")

def generate_quiz(text: str, num_questions: int = 5) -> List[Dict]:
    """
    Generates a quiz using the OpenAI API
    """
    client = OpenAI()
    
    # If text is too long, generate a summary first
    text_length = len(text)
    if text_length > 4000:
        text = summarize_text(text, client)
    
    prompt = f"""
    You are a multiple-choice question generator. Based on the provided text, create EXACTLY {num_questions} questions.
    
    IMPORTANT RULES:
    1. Each question MUST have:
       - A clear question
       - EXACTLY 4 options
       - Only ONE correct answer
    2. Use ONLY information from the provided text
    3. Vary the difficulty level of questions
    4. Use clear and objective language
    
    BASE TEXT:
    {text}
    
    RESPONSE FORMAT:
    You MUST return a JSON object with EXACTLY this structure:
    {{
        "questions": [
            {{
                "question": "Question text",
                "options": [
                    "Option A",
                    "Option B",
                    "Option C",
                    "Option D"
                ],
                "correct_index": 0
            }}
        ]
    }}
    
    NOTES:
    - correct_index must be a number between 0 and 3
    - Return EXACTLY {num_questions} questions
    - DO NOT include explanations or additional text, just the JSON
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            response_format={ "type": "json_object" },
            messages=[
                {"role": "system", "content": "You are an expert at creating multiple-choice questions. Always respond with valid JSON."},
                {"role": "user", "content": prompt}
            ]
        )
        
        # Get model response
        response_content = response.choices[0].message.content
        print("OpenAI Response:", response_content)  # Debug

        # Parse JSON response
        quiz_data = json.loads(response_content)
        print("Quiz data:", quiz_data)  # Debug

        # Verify if we have questions in expected format
        if "questions" not in quiz_data:
            raise Exception("API response does not contain questions in expected format")

        questions = quiz_data["questions"]
        print("Questions:", questions)  # Debug

        return questions
        
    except Exception as e:
        raise Exception(f"Error generating quiz: {str(e)}")