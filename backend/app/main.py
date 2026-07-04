from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import analisis
from app.services.transcription_service import _get_whisper_model

app = FastAPI(title="HablaBien AI API", version="1.0.0")

# CORS para el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar el dominio del frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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