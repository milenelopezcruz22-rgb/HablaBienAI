import os
from groq import Groq
from dotenv import load_dotenv
import tempfile

load_dotenv()

# Inicializar cliente de Groq
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

# Muletillas comunes en español
MULETILLAS = [
    "ehhh", "eee", "mmmm", "mmm", "este", "esta", "esto",
    "bueno", "o sea", "en plan", "tipo", "como", "verdad",
    "vale", "entonces", "así que", "por ejemplo", "digo yo",
    "sabes", "entiendes", "más o menos", "al final", "literalmente",
    "básicamente", "obviamente", "claramente", "de hecho", "en realidad"
]

def transcribir_audio(audio_bytes: bytes) -> str:
    """
    Transcribe audio usando Faster-Whisper (local).
    """
    try:
        from faster_whisper import WhisperModel
    except ImportError:
        raise ImportError("faster-whisper no está instalado. Ejecuta: pip install faster-whisper==1.1.0")

    # Crear archivo temporal
    with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as f:
        f.write(audio_bytes)
        temp_path = f.name

    try:
        # Usar Faster-Whisper para transcripción (modelo pequeño para velocidad)
        model = WhisperModel("tiny", device="cpu", compute_type="int8")
        segments, _ = model.transcribe(temp_path, language="es")
        transcripcion = " ".join([segment.text for segment in segments])
        return transcripcion.strip()
    except Exception as e:
        raise Exception(f"Error en transcripción: {str(e)}")
    finally:
        os.unlink(temp_path)

def detectar_muletillas(transcripcion: str) -> dict:
    """
    Detecta muletillas en la transcripción y cuenta su frecuencia.
    """
    transcripcion_lower = transcripcion.lower()
    muletillas_count = {}

    for muletilla in MULETILLAS:
        count = transcripcion_lower.count(muletilla)
        if count > 0:
            muletillas_count[muletilla] = count

    return muletillas_count

def analizar_con_groq(transcripcion: str) -> dict:
    """
    Usa Groq API para analizar la transcripción y dar feedback.
    """
    if not client:
        return {
            "feedback": "No se pudo conectar con Groq API",
            "recomendaciones": ["Revisa tu configuración de API key"]
        }

    prompt = f"""
    Analiza la siguiente transcripción de una presentación oral y proporciona:
    1. Un feedback general sobre la claridad del discurso
    2. Tres recomendaciones específicas para mejorar la oratoria

    Transcripción:
    {transcripcion}

    Responde en formato JSON con:
    {{
        "feedback": "texto del feedback",
        "recomendaciones": ["rec1", "rec2", "rec3"]
    }}
    """

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=500
        )

        import json
        content = response.choices[0].message.content.strip()

        # Intentar parsear JSON
        try:
            return json.loads(content)
        except:
            return {
                "feedback": content,
                "recomendaciones": []
            }

    except Exception as e:
        return {
            "feedback": f"Error al analizar con Groq: {str(e)}",
            "recomendaciones": []
        }
