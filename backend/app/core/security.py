"""Hash de contraseñas (pbkdf2 stdlib) y tokens JWT."""
import hashlib
import hmac
import os
from datetime import datetime, timedelta, timezone

import jwt
from fastapi import Depends, Header, HTTPException
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db

ALGORITHM = "HS256"
TOKEN_EXP_HORAS = 24 * 7  # una semana
PBKDF2_ITERACIONES = 100_000


# --- Contraseñas ---
def hash_password(password: str) -> str:
    salt = os.urandom(16)
    dk = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, PBKDF2_ITERACIONES)
    return f"{salt.hex()}${dk.hex()}"


def verify_password(password: str, almacenado: str) -> bool:
    try:
        salt_hex, dk_hex = almacenado.split("$")
    except (ValueError, AttributeError):
        return False
    salt = bytes.fromhex(salt_hex)
    dk = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, PBKDF2_ITERACIONES)
    return hmac.compare_digest(dk.hex(), dk_hex)


# --- Tokens ---
def crear_token(usuario_id: int) -> str:
    payload = {
        "sub": str(usuario_id),
        "exp": datetime.now(timezone.utc) + timedelta(hours=TOKEN_EXP_HORAS),
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=ALGORITHM)


def _decodificar_token(token: str):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        return int(payload["sub"])
    except Exception:
        return None


def _extraer_bearer(authorization: str | None) -> str | None:
    if not authorization:
        return None
    partes = authorization.split()
    if len(partes) == 2 and partes[0].lower() == "bearer":
        return partes[1]
    return None


# --- Dependencias FastAPI ---
def get_current_user_optional(
    authorization: str | None = Header(None),
    db: Session = Depends(get_db),
):
    """Devuelve el usuario si hay token válido, o None. No lanza error."""
    if db is None:
        return None
    token = _extraer_bearer(authorization)
    if not token:
        return None
    usuario_id = _decodificar_token(token)
    if not usuario_id:
        return None

    from app.models.usuario import Usuario

    return db.get(Usuario, usuario_id)


def get_current_user(
    authorization: str | None = Header(None),
    db: Session = Depends(get_db),
):
    """Igual que el anterior pero obliga a estar autenticado (401 si no)."""
    usuario = get_current_user_optional(authorization, db)
    if not usuario:
        raise HTTPException(status_code=401, detail="No autenticado")
    return usuario
