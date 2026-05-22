from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.groq_service import transcribir_audio, detectar_muletillas

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

        # Transcribir con Groq
        transcripcion = transcribir_audio(audio_bytes)

        # Detectar muletillas
        muletillas = detectar_muletillas(transcripcion)

        # Score
        total_muletillas = sum(muletillas.values())
        palabras = len(transcripcion.split())

        score_voz = max(
            0,
            min(
                100,
                100 - (total_muletillas / max(palabras, 1)) * 100
            )
        )

        return {
            "transcripcion": transcripcion,
            "muletillas": muletillas,
            "score_voz": round(score_voz, 1),
            "total_palabras": palabras,
            "total_muletillas": total_muletillas
        }

    except Exception as e:
        print("ERROR COMPLETO:", e)

        import traceback
        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=f"Error al analizar el audio: {str(e)}"
        )