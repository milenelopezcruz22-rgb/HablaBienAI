import json

from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from app.services.groq_service import analizar_con_groq
from app.services.speech_metrics_service import (
    calcular_score_voz,
    calcular_velocidad_habla,
    detectar_pausas_largas,
    detectar_muletillas,
)
from app.services.transcription_service import transcribir_audio_detallado
from app.core.database import SessionLocal, db_enabled
from app.core.security import get_current_user_optional
from app.models.sesion import Sesion

router = APIRouter()

TIPOS_PERMITIDOS = ("audio/", "video/", "application/octet-stream")
MAX_BYTES = 25 * 1024 * 1024  # 25 MB (límite de Groq/Whisper)


def _guardar_sesion(respuesta: dict, corporal: dict, titulo: str, usuario_id=None):
    """Persiste la sesión en Supabase. Best-effort: nunca rompe el análisis."""
    if not db_enabled:
        return None

    db = SessionLocal()
    try:
        sesion = Sesion(
            usuario_id=usuario_id,
            titulo=titulo or "Sesión de práctica",
            duracion_segundos=respuesta.get("duracion_segundos", 0),
            transcripcion=respuesta.get("transcripcion", ""),
            score_voz=respuesta.get("score_voz", 0),
            total_palabras=respuesta.get("total_palabras", 0),
            total_muletillas=respuesta.get("total_muletillas", 0),
            palabras_por_minuto=respuesta.get("palabras_por_minuto", 0),
            ritmo_habla=respuesta.get("ritmo_habla", "sin_datos"),
            total_pausas_largas=respuesta.get("total_pausas_largas", 0),
            muletillas_json=respuesta.get("muletillas", {}),
            metricas_corporales_json=corporal or {},
            feedback=respuesta.get("feedback", ""),
            recomendaciones_json=respuesta.get("recomendaciones", []),
        )
        db.add(sesion)
        db.commit()
        db.refresh(sesion)
        return sesion.id
    except Exception as e:
        db.rollback()
        print("[DB] No se pudo guardar la sesión:", e)
        return None
    finally:
        db.close()


@router.post("/analizar")
async def analizar_audio(
    audio: UploadFile = File(...),
    metricas_corporales: str = Form("{}"),
    titulo: str = Form("Sesión de práctica"),
    usuario=Depends(get_current_user_optional),
):
    """
    Recibe un archivo de audio/video y devuelve:
    - Transcripción del audio
    - Muletillas detectadas con frecuencia
    - Puntuación de voz (0-100)
    - Feedback IA (Groq)
    Si hay base de datos configurada, guarda la sesión y devuelve sesion_id.
    """

    # Validación de tipo de archivo
    if audio.content_type and not audio.content_type.startswith(TIPOS_PERMITIDOS):
        raise HTTPException(
            status_code=400,
            detail=f"Tipo de archivo no soportado: {audio.content_type}",
        )

    try:
        # Leer el archivo
        audio_bytes = await audio.read()

        if len(audio_bytes) > MAX_BYTES:
            raise HTTPException(
                status_code=413,
                detail="El archivo supera el límite de 25 MB.",
            )

        # Métricas corporales enviadas por el frontend (MediaPipe)
        try:
            corporal = json.loads(metricas_corporales or "{}")
        except json.JSONDecodeError:
            corporal = {}

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

        respuesta = {
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
            "fuente_feedback": feedback_ia["fuente_feedback"],
        }

        # Persistir en Supabase (best-effort) y devolver el id
        usuario_id = usuario.id if usuario else None
        respuesta["sesion_id"] = _guardar_sesion(respuesta, corporal, titulo, usuario_id)

        return respuesta

    except HTTPException:
        raise
    except Exception as e:
        print("ERROR COMPLETO:", e)

        import traceback
        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=f"Error al analizar el audio: {str(e)}"
        )
