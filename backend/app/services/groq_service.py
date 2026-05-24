import json
import os

from dotenv import load_dotenv
from groq import Groq


load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None


def analizar_con_groq(transcripcion: str) -> dict:
    """
    Usa Groq API para analizar la transcripcion y dar feedback.
    """
    if not client:
        return {
            "feedback": "No se pudo conectar con Groq API",
            "recomendaciones": ["Revisa tu configuracion de API key"]
        }

    prompt = f"""
    Analiza la siguiente transcripcion de una presentacion oral y proporciona:
    1. Un feedback general sobre la claridad del discurso
    2. Tres recomendaciones especificas para mejorar la oratoria

    Transcripcion:
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

        content = response.choices[0].message.content.strip()

        try:
            return json.loads(content)
        except json.JSONDecodeError:
            return {
                "feedback": content,
                "recomendaciones": []
            }

    except Exception as e:
        return {
            "feedback": f"Error al analizar con Groq: {str(e)}",
            "recomendaciones": []
        }
