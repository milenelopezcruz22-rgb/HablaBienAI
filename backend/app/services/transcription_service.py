import os
import tempfile
from threading import Lock


_whisper_model = None
_whisper_model_lock = Lock()
TRANSCRIPCION_LITERAL_PROMPT = (
    "Transcribe literalmente en espanol. Incluye muletillas, repeticiones "
    "y sonidos de duda como mmm, ehh, eee, este, bueno, o sea."
)


def _get_whisper_model():
    global _whisper_model

    if _whisper_model is not None:
        return _whisper_model

    with _whisper_model_lock:
        if _whisper_model is not None:
            return _whisper_model

        try:
            from faster_whisper import WhisperModel
        except ImportError:
            raise ImportError(
                "faster-whisper no esta instalado. Ejecuta: pip install faster-whisper==1.1.0"
            )

        _whisper_model = WhisperModel("tiny", device="cpu", compute_type="int8")
        return _whisper_model


def _transcribir_archivo(temp_path: str) -> dict:
    model = _get_whisper_model()
    segments, info = model.transcribe(
        temp_path,
        language="es",
        word_timestamps=True,
        initial_prompt=TRANSCRIPCION_LITERAL_PROMPT,
        condition_on_previous_text=False,
    )

    segmentos = []
    palabras = []
    textos = []

    for segment in segments:
        texto = segment.text.strip()
        if not texto:
            continue

        segmentos.append({
            "inicio": round(float(segment.start), 2),
            "fin": round(float(segment.end), 2),
            "texto": texto
        })
        textos.append(texto)

        for word in getattr(segment, "words", None) or []:
            palabra = word.word.strip()
            if not palabra:
                continue

            palabras.append({
                "inicio": round(float(word.start), 2),
                "fin": round(float(word.end), 2),
                "texto": palabra
            })

    transcripcion = " ".join(textos).strip()
    duracion = max([segmento["fin"] for segmento in segmentos], default=0)

    if not duracion and getattr(info, "duration", None):
        duracion = float(info.duration)

    return {
        "transcripcion": transcripcion,
        "segmentos": segmentos,
        "palabras": palabras,
        "duracion_segundos": round(duracion, 2)
    }


def transcribir_audio_detallado(audio_bytes: bytes) -> dict:
    """
    Transcribe audio y devuelve texto, segmentos y duracion estimada.
    """
    with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as f:
        f.write(audio_bytes)
        temp_path = f.name

    try:
        return _transcribir_archivo(temp_path)
    except Exception as e:
        raise Exception(f"Error en transcripcion: {str(e)}")
    finally:
        os.unlink(temp_path)


def transcribir_audio(audio_bytes: bytes) -> str:
    """
    Transcribe audio usando Faster-Whisper local.
    """
    return transcribir_audio_detallado(audio_bytes)["transcripcion"]
