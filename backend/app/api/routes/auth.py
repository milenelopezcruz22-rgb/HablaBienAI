"""Rutas de autenticación: registro, login y perfil."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db, db_enabled
from app.core.security import (
    hash_password,
    verify_password,
    crear_token,
    get_current_user,
)
from app.models.usuario import Usuario
from app.schemas.auth import RegistroRequest, LoginRequest

router = APIRouter()


def _requiere_db(db) -> None:
    if not db_enabled or db is None:
        raise HTTPException(
            status_code=503,
            detail="Base de datos no configurada. Define DATABASE_URL en el .env.",
        )


@router.post("/auth/register")
def registrar(datos: RegistroRequest, db: Session = Depends(get_db)):
    _requiere_db(db)
    email = datos.email.lower().strip()

    if db.query(Usuario).filter(Usuario.email == email).first():
        raise HTTPException(status_code=400, detail="Ya existe una cuenta con ese correo")

    usuario = Usuario(
        nombre=datos.nombre.strip(),
        apellido=datos.apellido.strip(),
        email=email,
        password_hash=hash_password(datos.password),
    )
    db.add(usuario)
    db.commit()
    db.refresh(usuario)

    return {"token": crear_token(usuario.id), "usuario": usuario.serializar()}


@router.post("/auth/login")
def login(datos: LoginRequest, db: Session = Depends(get_db)):
    _requiere_db(db)
    email = datos.email.lower().strip()
    usuario = db.query(Usuario).filter(Usuario.email == email).first()

    if not usuario or not verify_password(datos.password, usuario.password_hash):
        raise HTTPException(status_code=401, detail="Correo o contraseña incorrectos")

    return {"token": crear_token(usuario.id), "usuario": usuario.serializar()}


@router.get("/auth/me")
def perfil(usuario: Usuario = Depends(get_current_user)):
    return usuario.serializar()
