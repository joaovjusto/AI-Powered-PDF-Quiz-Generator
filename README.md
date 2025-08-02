# AI-Powered PDF Quiz Generator

This project is a web application that generates quizzes from PDF documents using AI. It consists of a Next.js frontend and a FastAPI backend.

## Project Structure

```
.
├── apps/
│   ├── web/          # Next.js frontend application
│   └── api/          # FastAPI backend application
└── README.md
```

## Prerequisites

- Node.js 18+
- Python 3.8+
- pnpm (for package management)

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd take-home-project-ai-powered-pdf-quiz-generatorreact
```

2. Install dependencies:
```bash
# Install frontend dependencies
cd apps/web
pnpm install

# Install backend dependencies
cd ../api
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
```

3. Set up environment variables:

Frontend (apps/web/.env.local):
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

Backend (apps/api/.env):
```env
OPENAI_API_KEY=your_openai_api_key
```

4. Start the development servers:

Frontend:
```bash
cd apps/web
pnpm dev
```

Backend:
```bash
cd apps/api
uvicorn main:app --reload --host 0.0.0.0
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## Features

- Upload PDF documents (max 10MB)
- Extract text using PyMuPDF
- Generate quizzes using OpenAI's GPT model
- Interactive quiz interface
- Loading animations with gradient effects
- Mobile-responsive design

## Tech Stack

### Frontend
- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Framer Motion (for animations)
- React Query
- Zustand (state management)

### Backend
- FastAPI
- PyMuPDF (for PDF processing)
- OpenAI API
- Python-dotenv
- CORS middleware

## Development

### Frontend Scripts

```bash
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm start      # Start production server
pnpm lint       # Run ESLint
```

### Backend Scripts

```bash
uvicorn main:app --reload --host 0.0.0.0  # Start development server
```

## API Endpoints

- `POST /generate-quiz`
  - Accepts PDF file upload
  - Returns generated quiz questions and metadata

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request