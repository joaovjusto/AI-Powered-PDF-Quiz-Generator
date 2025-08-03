from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.quiz import router as quiz_router
from app.routes.cache import router as cache_router
from app.routes.results import router as results_router

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include routers
app.include_router(quiz_router)  # This will use the prefix defined in the router
app.include_router(cache_router)  # This will use the prefix defined in the router
app.include_router(results_router)  # This will use the prefix defined in the router