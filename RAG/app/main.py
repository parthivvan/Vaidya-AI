import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router

app = FastAPI(title="Modular Medical RAG API")

# Allow your frontend (React/Next.js) to communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure our temp storage directories exist
os.makedirs("uploads", exist_ok=True)
os.makedirs("db", exist_ok=True)

# Plug in all of our routes!
app.include_router(router)