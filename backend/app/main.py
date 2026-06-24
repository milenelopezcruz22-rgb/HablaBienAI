from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import analisis, historial, auth
from app.core.database import init_db

app = FastAPI(title="HablaBien AI API", version="1.0.0")

# CORS para el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar el dominio del frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rutas
app.include_router(auth.router, prefix="/api/v1", tags=["auth"])
app.include_router(analisis.router, prefix="/api/v1", tags=["análisis"])
app.include_router(historial.router, prefix="/api/v1", tags=["historial"])


@app.on_event("startup")
def on_startup():
    # Crea las tablas en Supabase si DATABASE_URL está configurada.
    # Best-effort: si la DB no responde, la app sigue sirviendo /analizar.
    try:
        init_db()
    except Exception as e:
        print("[DB] No se pudo inicializar la base de datos:", e)


@app.get("/health")
def health_check():
    return {"status": "healthy"}
