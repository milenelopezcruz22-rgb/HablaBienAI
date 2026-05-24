import os
import tempfile
from threading import Lock


_whisper_model = None
_whisper_model_lock = Lock()


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


def transcribir_audio(audio_bytes: bytes) -> str:
    """
    Transcribe audio usando Faster-Whisper local.
    """
    with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as f:
        f.write(audio_bytes)
        temp_path = f.name

    try:
        model = _get_whisper_model()
        segments, _ = model.transcribe(temp_path, language="es")
        transcripcion = " ".join([segment.text for segment in segments])
        return transcripcion.strip()
    except Exception as e:
        raise Exception(f"Error en transcripcion: {str(e)}")
    finally:
        os.unlink(temp_path)
