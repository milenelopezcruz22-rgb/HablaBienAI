"""Rutas de historial de sesiones (lectura y borrado), por usuario."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db, db_enabled
from app.core.security import get_current_user
from app.models.sesion import Sesion
from app.models.usuario import Usuario

router = APIRouter()


def _requiere_db(db) -> None:
    if not db_enabled or db is None:
        raise HTTPException(
            status_code=503,
            detail="Base de datos no configurada. Define DATABASE_URL en el .env.",
        )


@router.get("/historial")
def listar_historial(
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(get_current_user),
):
    """Lista las sesiones del usuario autenticado, de la más reciente a la más antigua."""
    _requiere_db(db)
    sesiones = (
        db.query(Sesion)
        .filter(Sesion.usuario_id == usuario.id)
        .order_by(Sesion.fecha.desc())
        .all()
    )
    return [s.serializar() for s in sesiones]


@router.get("/sesion/{sesion_id}")
def obtener_sesion(
    sesion_id: int,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(get_current_user),
):
    """Detalle de una sesión propia."""
    _requiere_db(db)
    sesion = db.get(Sesion, sesion_id)
    if not sesion or sesion.usuario_id != usuario.id:
        raise HTTPException(status_code=404, detail="Sesión no encontrada")
    return sesion.serializar()


@router.delete("/sesion/{sesion_id}")
def eliminar_sesion(
    sesion_id: int,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(get_current_user),
):
    """Elimina una sesión propia del historial."""
    _requiere_db(db)
    sesion = db.get(Sesion, sesion_id)
    if not sesion or sesion.usuario_id != usuario.id:
        raise HTTPException(status_code=404, detail="Sesión no encontrada")
    db.delete(sesion)
    db.commit()
    return {"ok": True, "id": sesion_id}
