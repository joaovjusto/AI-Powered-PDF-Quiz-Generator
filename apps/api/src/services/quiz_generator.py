import json
from typing import List, Dict, Tuple
from openai import OpenAI

def detect_language(text: str, client: OpenAI) -> str:
    """
    Detects the language of the text using OpenAI API
    """
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a language detection expert. Respond only with the ISO language code (e.g., 'en', 'pt', 'es', 'fr', etc)."},
                {"role": "user", "content": f"What is the language of this text? Respond only with the language code:\n\n{text[:1000]}"}
            ]
        )
        return response.choices[0].message.content.strip().lower()
    except Exception as e:
        print(f"Error detecting language: {str(e)}")
        return "en"  # Default to English if detection fails

async def extract_text_from_pdf(pdf_file) -> tuple[str, dict]:
    """
    Extracts text from PDF file
    """
    try:
        import fitz  # PyMuPDF
        
        # Read PDF content
        pdf_content = await pdf_file.read()
        
        # Open PDF
        doc = fitz.open(stream=pdf_content, filetype="pdf")
        
        # Initialize variables
        text = ""
        total_pages = len(doc)
        pages_read = 0
        was_truncated = False
        
        # Read pages
        for page in doc:
            text += page.get_text()
            pages_read += 1
            
            # If text is too long, stop reading
            if len(text) > 12000:  # Increased limit to get better context
                was_truncated = True
                break
        
        return text, {
            "total_pages": total_pages,
            "pages_read": pages_read,
            "was_truncated": was_truncated
        }

    except Exception as e:
        raise Exception(f"Error extracting text from PDF: {str(e)}")

def summarize_text(text: str, client: OpenAI, language: str) -> str:
    """
    Generates a summary of the text using OpenAI API
    """
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": f"You are an expert at summarizing texts while maintaining key points and important concepts. Always respond in the same language as the input text ({language})."},
                {"role": "user", "content": f"Create a detailed summary of the following text, keeping the most important concepts and information for question generation: \n\n{text[:8000]}"}
            ]
        )
        return response.choices[0].message.content

    except Exception as e:
        raise Exception(f"Error summarizing text: {str(e)}")

def generate_quiz(text: str, num_questions: int = 10) -> List[Dict]:
    """
    Generates a quiz using the OpenAI API
    """
    client = OpenAI()
    
    # Detect language
    language = detect_language(text, client)
    
    # If text is too long, generate a summary first
    text_length = len(text)
    if text_length > 4000:
        text = summarize_text(text, client, language)
    
    # Language-specific instructions
    language_instructions = {
        "en": "Create questions in English",
        "pt": "Crie as perguntas em português",
        "es": "Crea las preguntas en español",
        "fr": "Créez les questions en français",
    }.get(language, "Create questions in English")
    
    prompt = f"""
    You are a multiple-choice question generator. Based on the provided text, create EXACTLY {num_questions} questions.
    
    IMPORTANT RULES:
    1. Each question MUST have:
       - A clear question
       - EXACTLY 4 options
       - Only ONE correct answer
    2. Use ONLY information from the provided text
    3. Vary the difficulty level of questions
    4. {language_instructions}
    5. Make sure all questions and answers are in the same language as the source text
    6. VERY IMPORTANT: For each question, randomly place the correct answer in a different position (0-3)
       - DO NOT always put the correct answer in the same position
       - Distribute correct answers randomly across all positions
       - Make sure the correct_index matches the actual position of the correct answer
    
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
                "correct_index": 2  // This should vary randomly for each question (0-3)
            }}
        ]
    }}
    
    NOTES:
    - correct_index must be a number between 0 and 3
    - Generate EXACTLY {num_questions} questions
    - DO NOT include explanations or additional text, just the JSON
    - Make sure to randomize the position of correct answers
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            response_format={ "type": "json_object" },
            messages=[
                {"role": "system", "content": f"You are an expert at creating multiple-choice questions in {language}. Always respond with valid JSON. Remember to randomize the position of correct answers."},
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

        # Verify correct_index distribution
        correct_indices = [q["correct_index"] for q in questions]
        print("Correct answer positions:", correct_indices)  # Debug - to check randomization

        return questions
        
    except Exception as e:
        raise Exception(f"Error generating quiz: {str(e)}")