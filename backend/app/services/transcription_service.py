import os
import tempfile


def transcribir_audio(audio_bytes: bytes) -> str:
    """
    Transcribe audio usando Faster-Whisper local.
    """
    try:
        from faster_whisper import WhisperModel
    except ImportError:
        raise ImportError(
            "faster-whisper no esta instalado. Ejecuta: pip install faster-whisper==1.1.0"
        )

    with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as f:
        f.write(audio_bytes)
        temp_path = f.name

    try:
        model = WhisperModel("tiny", device="cpu", compute_type="int8")
        segments, _ = model.transcribe(temp_path, language="es")
        transcripcion = " ".join([segment.text for segment in segments])
        return transcripcion.strip()
    except Exception as e:
        raise Exception(f"Error en transcripcion: {str(e)}")
    finally:
        os.unlink(temp_path)
