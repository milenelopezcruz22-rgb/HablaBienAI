"""Modelo ORM de una sesión de práctica de oratoria."""
from datetime import datetime

from sqlalchemy import Column, Integer, Float, String, Text, DateTime, JSON, ForeignKey

from app.core.database import Base


class Sesion(Base):
    __tablename__ = "sesiones"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=True, index=True)
    titulo = Column(String(255), default="Sesión de práctica")
    fecha = Column(DateTime, default=datetime.utcnow)

    # --- Métricas de voz ---
    duracion_segundos = Column(Float, default=0)
    transcripcion = Column(Text, default="")
    score_voz = Column(Float, default=0)
    total_palabras = Column(Integer, default=0)
    total_muletillas = Column(Integer, default=0)
    palabras_por_minuto = Column(Float, default=0)
    ritmo_habla = Column(String(50), default="sin_datos")
    total_pausas_largas = Column(Integer, default=0)
    muletillas_json = Column(JSON, default=dict)

    # --- Métricas corporales (vienen del frontend) ---
    metricas_corporales_json = Column(JSON, default=dict)

    # --- Feedback IA ---
    feedback = Column(Text, default="")
    recomendaciones_json = Column(JSON, default=list)

    def serializar(self) -> dict:
        return {
            "id": self.id,
            "titulo": self.titulo,
            "fecha": self.fecha.isoformat() if self.fecha else None,
            "duracion_segundos": self.duracion_segundos,
            "transcripcion": self.transcripcion,
            "score_voz": self.score_voz,
            "total_palabras": self.total_palabras,
            "total_muletillas": self.total_muletillas,
            "palabras_por_minuto": self.palabras_por_minuto,
            "ritmo_habla": self.ritmo_habla,
            "total_pausas_largas": self.total_pausas_largas,
            "muletillas": self.muletillas_json or {},
            "metricas_corporales": self.metricas_corporales_json or {},
            "feedback": self.feedback,
            "recomendaciones": self.recomendaciones_json or [],
        }
