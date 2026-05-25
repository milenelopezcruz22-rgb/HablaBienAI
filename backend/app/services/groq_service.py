import json
import os

try:
    from dotenv import load_dotenv
except ImportError:
    def load_dotenv():
        return None

try:
    from groq import Groq
except ImportError:
    Groq = None


load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY and Groq else None


def _feedback_local(metricas: dict | None = None) -> dict:
    metricas = metricas or {}
    recomendaciones = []

    if metricas.get("total_muletillas", 0) > 0:
        recomendaciones.append("Reduce muletillas preparando frases de transicion antes de hablar.")

    if metricas.get("ritmo_habla") == "lento":
        recomendaciones.append("Aumenta ligeramente el ritmo para mantener la atencion.")
    elif metricas.get("ritmo_habla") == "rapido":
        recomendaciones.append("Baja el ritmo y marca pausas breves en ideas importantes.")

    if metricas.get("total_pausas_largas", 0) > 0:
        recomendaciones.append("Evita pausas largas practicando bloques cortos de tu presentacion.")

    if not recomendaciones:
        recomendaciones.append("Manten claridad, ritmo estable y pausas breves entre ideas.")

    return {
        "feedback": "Analisis local generado porque Groq API no esta disponible.",
        "recomendaciones": recomendaciones[:3],
        "fuente_feedback": "local"
    }


def _extraer_json_respuesta(content: str) -> dict:
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        inicio = content.find("{")
        fin = content.rfind("}")

        if inicio != -1 and fin != -1 and fin > inicio:
            return json.loads(content[inicio:fin + 1])

        raise


def _normalizar_feedback(data: dict, fallback_content: str = "") -> dict:
    feedback = data.get("feedback") or fallback_content
    recomendaciones = data.get("recomendaciones") or []

    if not isinstance(recomendaciones, list):
        recomendaciones = [str(recomendaciones)]

    return {
        "feedback": str(feedback).strip(),
        "recomendaciones": [str(item).strip() for item in recomendaciones if str(item).strip()][:3],
        "fuente_feedback": "groq"
    }


def analizar_con_groq(transcripcion: str, metricas: dict | None = None) -> dict:
    """
    Usa Groq API para generar feedback de voz basado en transcripcion y metricas.
    """
    if not client:
        return _feedback_local(metricas)

    metricas = metricas or {}
    prompt = f"""
Eres un entrenador de oratoria en espanol. Analiza la presentacion con base en
la transcripcion y las metricas del sistema.

Transcripcion:
{transcripcion}

Metricas:
{json.dumps(metricas, ensure_ascii=False)}

Responde SOLO en JSON valido con esta forma:
{{
  "feedback": "un parrafo breve, directo y util",
  "recomendaciones": [
    "recomendacion accionable 1",
    "recomendacion accionable 2",
    "recomendacion accionable 3"
  ]
}}
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "Responde siempre en JSON valido y en espanol."
                },
                {"role": "user", "content": prompt}
            ],
            temperature=0.4,
            max_tokens=600,
            response_format={"type": "json_object"},
        )

        content = response.choices[0].message.content.strip()
        data = _extraer_json_respuesta(content)
        return _normalizar_feedback(data, content)

    except Exception as e:
        fallback = _feedback_local(metricas)
        fallback["feedback"] = f"{fallback['feedback']} Detalle tecnico: {str(e)}"
        return fallback
