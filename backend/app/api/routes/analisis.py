from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.groq_service import analizar_con_groq
from app.services.speech_metrics_service import (
    calcular_score_voz,
    calcular_velocidad_habla,
    detectar_pausas_largas,
    detectar_muletillas,
)
from app.services.transcription_service import transcribir_audio_detallado

router = APIRouter()

# Constantes de validación
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB
ALLOWED_AUDIO_TYPES = ["audio/", "video/"]

@router.post("/analizar")
async def analizar_audio(audio: UploadFile = File(...)):
    """
    Recibe un archivo de audio/video y devuelve:
    - Transcripción del audio
    - Muletillas detectadas con frecuencia
    - Puntuación de voz (0-100)
    """

    try:
        # Validar tipo de archivo
        if not audio.content_type or not any(audio.content_type.startswith(t) for t in ALLOWED_AUDIO_TYPES):
            raise HTTPException(
                status_code=400,
                detail="El archivo debe ser de tipo audio o video"
            )

        # Leer el archivo
        audio_bytes = await audio.read()

        # Validar que no esté vacío
        if not audio_bytes or len(audio_bytes) == 0:
            raise HTTPException(
                status_code=400,
                detail="El archivo de audio está vacío"
            )

        # Validar tamaño
        if len(audio_bytes) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail=f"El archivo excede el tamaño máximo permitido ({MAX_FILE_SIZE // (1024*1024)}MB)"
            )

        # Transcribir con Faster-Whisper
        resultado_transcripcion = transcribir_audio_detallado(audio_bytes)
        transcripcion = resultado_transcripcion["transcripcion"]
        duracion_segundos = resultado_transcripcion["duracion_segundos"]
        segmentos = resultado_transcripcion["segmentos"]
        palabras_transcritas = resultado_transcripcion["palabras"]

        # Detectar muletillas
        muletillas = detectar_muletillas(transcripcion)

        # Score
        total_muletillas = sum(muletillas.values())
        palabras = len(transcripcion.split())

        velocidad = calcular_velocidad_habla(transcripcion, duracion_segundos)
        pausas = detectar_pausas_largas(segmentos, palabras_transcritas)
        score = calcular_score_voz(transcripcion, muletillas, velocidad, pausas)
        metricas_voz = {
            "score_voz": score["score_voz"],
            "detalle_score_voz": score["detalle_score_voz"],
            "total_palabras": palabras,
            "muletillas": muletillas,
            "total_muletillas": total_muletillas,
            "duracion_segundos": velocidad["duracion_segundos"],
            "palabras_por_minuto": velocidad["palabras_por_minuto"],
            "ritmo_habla": velocidad["ritmo_habla"],
            "pausas_largas": pausas["pausas_largas"],
            "total_pausas_largas": pausas["total_pausas_largas"],
            "duracion_pausas_largas": pausas["duracion_pausas_largas"],
        }
        feedback_ia = analizar_con_groq(transcripcion, metricas_voz)

        return {
            "transcripcion": transcripcion,
            "muletillas": muletillas,
            "score_voz": score["score_voz"],
            "detalle_score_voz": score["detalle_score_voz"],
            "total_palabras": palabras,
            "total_muletillas": total_muletillas,
            "duracion_segundos": velocidad["duracion_segundos"],
            "palabras_por_minuto": velocidad["palabras_por_minuto"],
            "ritmo_habla": velocidad["ritmo_habla"],
            "pausas_largas": pausas["pausas_largas"],
            "total_pausas_largas": pausas["total_pausas_largas"],
            "duracion_pausas_largas": pausas["duracion_pausas_largas"],
            "fuente_pausas": pausas["fuente_pausas"],
            "umbral_pausa_segundos": pausas["umbral_pausa_segundos"],
            "feedback": feedback_ia["feedback"],
            "recomendaciones": feedback_ia["recomendaciones"],
            "fuente_feedback": feedback_ia["fuente_feedback"]
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Error al procesar el audio. Por favor, intenta nuevamente."
        )
