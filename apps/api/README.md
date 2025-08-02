# Quiz Generator Backend

FastAPI backend application for the AI-powered PDF Quiz Generator.

## Tech Stack

- FastAPI
- PyMuPDF (fitz)
- OpenAI API
- Python-dotenv
- CORS middleware

## Getting Started

1. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:

Create a `.env` file:
```env
OPENAI_API_KEY=your_openai_api_key
```

4. Start the development server:
```bash
uvicorn main:app --reload --host 0.0.0.0
```

## Project Structure

```
.
├── src/
│   ├── main.py              # FastAPI application
│   ├── routes/
│   │   └── quiz.py         # Quiz generation endpoints
│   ├── services/
│   │   ├── openai.py       # OpenAI integration
│   │   └── pdf.py          # PDF processing
│   └── utils/
│       └── text.py         # Text processing utilities
└── requirements.txt
```

## API Endpoints

### POST /generate-quiz

Generates quiz questions from a PDF file.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body:
  - file: PDF file (max 10MB)
  - num_questions: Optional[int] = 5

**Response:**
```json
{
  "status": "success",
  "questions": [
    {
      "question": "string",
      "options": ["string"],
      "correct_index": 0
    }
  ],
  "metadata": {
    "original_text_length": 0,
    "was_summarized": false,
    "num_questions": 0,
    "pdf_info": {
      "total_pages": 0,
      "pages_read": 0,
      "was_truncated": false
    }
  }
}
```

## Features

### PDF Processing
- Text extraction using PyMuPDF
- Large PDF handling (>10 pages)
- Text summarization for long documents

### Quiz Generation
- OpenAI GPT model integration
- Multiple choice question generation
- Answer validation

### Error Handling
- File size validation
- PDF format validation
- API error handling

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| OPENAI_API_KEY | OpenAI API key | Yes |

## Development Guidelines

1. **Code Organization**
   - Keep routes in routes/
   - Business logic in services/
   - Utilities in utils/

2. **Error Handling**
   - Use FastAPI HTTPException
   - Provide meaningful error messages
   - Handle edge cases

3. **API Design**
   - Follow REST principles
   - Use appropriate HTTP methods
   - Implement proper validation

4. **Performance**
   - Optimize PDF processing
   - Handle large files efficiently
   - Implement caching when needed

## Dependencies

Main dependencies from requirements.txt:
```
fastapi
python-multipart
uvicorn
PyMuPDF
openai
python-dotenv
```