from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import analisis
from app.services.transcription_service import _get_whisper_model

app = FastAPI(title="HablaBien AI API", version="1.0.0")

# CORS para el frontend
ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite dev frontend
    "http://localhost:5174",  # Vite dev frontend alternativo
    "http://localhost:3000",  # React dev
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

@app.on_event("startup")
def cargar_modelo_whisper():
    print("Precargando modelo Whisper, esto puede tardar unos segundos...")
    _get_whisper_model()
    print("Modelo Whisper listo.")

# Rutas
app.include_router(analisis.router, prefix="/api/v1", tags=["análisis"])

@app.get("/health")
def health_check():
    return {"status": "healthy"}