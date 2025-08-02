# AI-Powered PDF Quiz Generator

This project is a web application that allows users to upload PDF documents and generate quizzes using AI. The application is built with Next.js for the frontend and FastAPI for the backend.

## Project Structure

```
.
├── apps
│   ├── api                 # FastAPI backend
│   │   ├── src
│   │   │   ├── api        # API routes
│   │   │   ├── core       # Core configuration
│   │   │   ├── models     # Data models
│   │   │   ├── services   # Business logic
│   │   │   └── utils      # Utility functions
│   │   └── venv           # Python virtual environment
│   └── web                # Next.js frontend
│       ├── src
│       │   ├── app        # Next.js App Router
│       │   ├── components # React components
│       │   ├── hooks      # Custom React hooks
│       │   ├── services   # API services
│       │   ├── store      # Zustand store
│       │   ├── types      # TypeScript types
│       │   └── utils      # Utility functions
│       └── public         # Static files
└── packages              # Shared packages
    └── shared            # Shared utilities and types
```

## Prerequisites

- Node.js 18+
- Python 3.8+
- OpenAI API key

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd pdf-quiz-generator
   ```

2. Set up the backend:
   ```bash
   cd apps/api
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   pip install -r requirements.txt
   cp .env.example .env  # Add your OpenAI API key
   ```

3. Set up the frontend:
   ```bash
   cd apps/web
   npm install
   cp .env.example .env.local  # Configure environment variables
   ```

4. Start the development servers:

   Backend:
   ```bash
   cd apps/api
   uvicorn src.main:app --reload
   ```

   Frontend:
   ```bash
   cd apps/web
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- PDF upload and text extraction
- AI-powered question generation using OpenAI
- Question editing capabilities
- Interactive quiz taking
- Immediate feedback and scoring
- Responsive design

## Tech Stack

- **Frontend**:
  - Next.js (App Router)
  - React Query for data fetching
  - Zustand for state management
  - Tailwind CSS for styling
  - TypeScript

- **Backend**:
  - FastAPI
  - OpenAI API
  - Python PDF processing

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.