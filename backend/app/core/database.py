"""Conexión a la base de datos (Supabase PostgreSQL vía SQLAlchemy)."""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.core.config import settings

Base = declarative_base()

# Si la URL aún tiene un placeholder, tratamos la DB como deshabilitada
# para que la app siga sirviendo /analizar sin caerse.
_PLACEHOLDER_TOKENS = ("TU_PASSWORD", "user:pass", "cambia", "xxxx", "[")


def _url_es_valida(url: str) -> bool:
    if not url:
        return False
    return not any(token in url for token in _PLACEHOLDER_TOKENS)


db_enabled = _url_es_valida(settings.DATABASE_URL)
engine = None
SessionLocal = None

if db_enabled:
    engine = create_engine(
        settings.DATABASE_URL,
        pool_pre_ping=True,   # reconecta si el pooler cerró la conexión
        pool_recycle=300,
    )
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def init_db() -> bool:
    """Crea las tablas si la base de datos está configurada."""
    if not db_enabled:
        print("[DB] DATABASE_URL no configurada — historial deshabilitado.")
        return False

    # importa los modelos para registrarlos en Base.metadata
    from app.models import sesion, usuario  # noqa: F401

    Base.metadata.create_all(bind=engine)

    # Migración ligera: añade usuario_id a 'sesiones' si la tabla ya existía
    # sin esa columna (create_all no altera tablas existentes).
    from sqlalchemy import text

    with engine.begin() as conn:
        conn.execute(text(
            "ALTER TABLE sesiones ADD COLUMN IF NOT EXISTS usuario_id INTEGER"
        ))

    print("[DB] Tablas verificadas/creadas en Supabase.")
    return True


def get_db():
    """Dependencia FastAPI: entrega una sesión de DB y la cierra al final."""
    if not db_enabled:
        yield None
        return
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
