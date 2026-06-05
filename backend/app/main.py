from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, projects
from app.database.connection import db_manager
from contextlib import asynccontextmanager
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("uvicorn")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to Supabase Postgres
    logger.info("Starting IdeaForge AI Backend Service...")
    db_manager.connect()
    yield
    # Shutdown: Close connection
    logger.info("Shutting down IdeaForge AI Backend Service...")
    db_manager.disconnect()

app = FastAPI(
    title="IdeaForge AI API",
    description="Intelligent platform endpoint for student project generation, originality assessments, architectures, and viva prep.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration to support local Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to actual frontend domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(projects.router)

@app.get("/api/health", tags=["Health"])
def health_check():
    """Confirms backend service health and database availability."""
    db_status = "unconnected"
    if db_manager.client is not None and not db_manager.client.closed:
        try:
            db_manager.client.execute("SELECT 1")
            db_status = "connected"
        except Exception:
            db_status = "error"
            
    return {
        "status": "healthy",
        "database": db_status,
        "message": "IdeaForge AI API is running flawlessly!"
    }
