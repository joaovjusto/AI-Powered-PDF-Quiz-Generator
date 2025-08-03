# Quiz Explanation API

This API provides streaming explanations for quiz answers using OpenAI's GPT-3.5 model.

## Setup

1. Create a `.env` file in the `apps/api` directory:
```bash
OPENAI_API_KEY=your_api_key_here
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Server

Start the server using one of these methods:

1. Using the start script:
```bash
./start.sh
```

2. Or manually with uvicorn:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## API Endpoints

- `GET /health`: Health check endpoint
- `POST /api/explain`: Get streaming explanation for quiz answers

## Troubleshooting

1. If you see a 404 error, make sure the API server is running
2. Check the API logs for detailed error messages
3. Ensure your OpenAI API key is correctly set in the `.env` file
4. The server must be running on port 8000