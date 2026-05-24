from pydantic import BaseModel, Field
from typing import Dict, List

class AnalisisResponse(BaseModel):
    transcripcion: str
    muletillas: Dict[str, int]
    score_voz: float
    total_palabras: int
    total_muletillas: int
    duracion_segundos: float = 0
    palabras_por_minuto: float = 0
    ritmo_habla: str = "sin_datos"
    pausas_largas: List[Dict[str, float]] = Field(default_factory=list)
    total_pausas_largas: int = 0
    duracion_pausas_largas: float = 0

class AnalisisCompletoResponse(BaseModel):
    transcripcion: str
    muletillas: Dict[str, int]
    score_voz: float
    total_palabras: int
    total_muletillas: int
    duracion_segundos: float = 0
    palabras_por_minuto: float = 0
    ritmo_habla: str = "sin_datos"
    pausas_largas: List[Dict[str, float]] = Field(default_factory=list)
    total_pausas_largas: int = 0
    duracion_pausas_largas: float = 0
    feedback: str
    recomendaciones: List[str]
