from pydantic import BaseModel
from typing import Dict, List

class AnalisisResponse(BaseModel):
    transcripcion: str
    muletillas: Dict[str, int]
    score_voz: float
    total_palabras: int
    total_muletillas: int

class AnalisisCompletoResponse(BaseModel):
    transcripcion: str
    muletillas: Dict[str, int]
    score_voz: float
    total_palabras: int
    total_muletillas: int
    feedback: str
    recomendaciones: List[str]
