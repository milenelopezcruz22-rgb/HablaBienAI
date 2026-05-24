from pydantic import BaseModel
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

class AnalisisCompletoResponse(BaseModel):
    transcripcion: str
    muletillas: Dict[str, int]
    score_voz: float
    total_palabras: int
    total_muletillas: int
    duracion_segundos: float = 0
    palabras_por_minuto: float = 0
    ritmo_habla: str = "sin_datos"
    feedback: str
    recomendaciones: List[str]
