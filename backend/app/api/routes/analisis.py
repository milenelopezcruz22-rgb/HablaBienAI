from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.speech_metrics_service import (
    calcular_score_voz,
    calcular_velocidad_habla,
    detectar_pausas_largas,
    detectar_muletillas,
)
from app.services.transcription_service import transcribir_audio_detallado

router = APIRouter()

@router.post("/analizar")
async def analizar_audio(audio: UploadFile = File(...)):
    """
    Recibe un archivo de audio/video y devuelve:
    - Transcripción del audio
    - Muletillas detectadas con frecuencia
    - Puntuación de voz (0-100)
    """

    try:
        # Leer el archivo
        audio_bytes = await audio.read()

        # Transcribir con Faster-Whisper
        resultado_transcripcion = transcribir_audio_detallado(audio_bytes)
        transcripcion = resultado_transcripcion["transcripcion"]
        duracion_segundos = resultado_transcripcion["duracion_segundos"]
        segmentos = resultado_transcripcion["segmentos"]

        # Detectar muletillas
        muletillas = detectar_muletillas(transcripcion)

        # Score
        total_muletillas = sum(muletillas.values())
        palabras = len(transcripcion.split())

        velocidad = calcular_velocidad_habla(transcripcion, duracion_segundos)
        pausas = detectar_pausas_largas(segmentos)
        score = calcular_score_voz(transcripcion, muletillas, velocidad, pausas)

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
            "duracion_pausas_largas": pausas["duracion_pausas_largas"]
        }

    except Exception as e:
        print("ERROR COMPLETO:", e)

        import traceback
        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=f"Error al analizar el audio: {str(e)}"
        )
