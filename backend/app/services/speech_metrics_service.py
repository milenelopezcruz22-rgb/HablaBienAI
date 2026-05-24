import re
import unicodedata


MULETILLAS = [
    "ehhh", "eee", "mmmm", "mmm", "este", "esta", "esto",
    "bueno", "o sea", "en plan", "tipo", "como", "verdad",
    "vale", "entonces", "asi que", "por ejemplo", "digo yo",
    "sabes", "entiendes", "mas o menos", "al final", "literalmente",
    "basicamente", "obviamente", "claramente", "de hecho", "en realidad"
]

UMBRAL_MULETILLAS = {
    "ehhh": 1,
    "eee": 1,
    "mmmm": 1,
    "mmm": 1,
    "este": 2,
    "esta": 2,
    "esto": 2,
    "bueno": 2,
    "o sea": 2,
    "en plan": 2,
    "tipo": 2,
    "como": 3,
    "verdad": 2,
    "vale": 2,
    "entonces": 2,
    "asi que": 2,
    "por ejemplo": 2,
    "digo yo": 2,
    "sabes": 2,
    "entiendes": 2,
    "mas o menos": 2,
    "al final": 2,
    "literalmente": 2,
    "basicamente": 2,
    "obviamente": 2,
    "claramente": 2,
    "de hecho": 2,
    "en realidad": 2,
}


def normalizar_texto(texto: str) -> str:
    """
    Normaliza texto para comparar muletillas sin depender de mayusculas,
    tildes ni signos de puntuacion.
    """
    texto = texto or ""
    texto = texto.lower()
    texto = unicodedata.normalize("NFD", texto)
    texto = "".join(char for char in texto if unicodedata.category(char) != "Mn")
    texto = re.sub(r"[^a-z0-9]+", " ", texto)
    return re.sub(r"\s+", " ", texto).strip()


def _crear_patron_muletilla(muletilla: str) -> re.Pattern:
    palabras = normalizar_texto(muletilla).split()
    patron = r"\s+".join(re.escape(palabra) for palabra in palabras)
    return re.compile(rf"(?<!\w){patron}(?!\w)")


MULETILLAS_PATRONES = [
    (muletilla, _crear_patron_muletilla(muletilla))
    for muletilla in MULETILLAS
]


def detectar_muletillas(transcripcion: str) -> dict:
    """
    Detecta muletillas en la transcripcion y cuenta su frecuencia.
    """
    transcripcion_normalizada = normalizar_texto(transcripcion)
    muletillas_count = {}

    for muletilla, patron in MULETILLAS_PATRONES:
        count = len(patron.findall(transcripcion_normalizada))
        min_repeticiones = UMBRAL_MULETILLAS.get(muletilla, 2)
        if count >= min_repeticiones:
            muletillas_count[muletilla] = count

    return muletillas_count


PESOS_SCORE_VOZ = {
    "muletillas": 0.45,
    "velocidad": 0.35,
    "pausas": 0.20,
}


def _limitar_score(score: float) -> float:
    return round(max(0, min(100, score)), 1)


def calcular_score_muletillas(transcripcion: str, muletillas: dict) -> float:
    total_muletillas = sum(muletillas.values())
    total_palabras = len(transcripcion.split())
    muletillas_por_100 = (total_muletillas / max(total_palabras, 1)) * 100

    return _limitar_score(100 - (muletillas_por_100 * 10))


def calcular_score_velocidad(velocidad: dict | None) -> float:
    palabras_por_minuto = float((velocidad or {}).get("palabras_por_minuto", 0))

    if palabras_por_minuto == 0:
        return 70.0

    if 110 <= palabras_por_minuto <= 170:
        return 100.0

    if palabras_por_minuto < 110:
        distancia = 110 - palabras_por_minuto
        return _limitar_score(100 - (distancia * 1.1))

    distancia = palabras_por_minuto - 170
    return _limitar_score(100 - (distancia * 1.2))


def calcular_score_pausas(pausas: dict | None) -> float:
    total_pausas = int((pausas or {}).get("total_pausas_largas", 0))
    duracion_pausas = float((pausas or {}).get("duracion_pausas_largas", 0))
    penalizacion = (total_pausas * 12) + (duracion_pausas * 3)

    return _limitar_score(100 - penalizacion)


def calcular_score_voz(
    transcripcion: str,
    muletillas: dict,
    velocidad: dict | None = None,
    pausas: dict | None = None,
) -> dict:
    if len(transcripcion.split()) == 0:
        return {
            "score_voz": 0.0,
            "detalle_score_voz": {
                "muletillas": 0.0,
                "velocidad": 0.0,
                "pausas": 0.0,
                "pesos": PESOS_SCORE_VOZ
            }
        }

    score_muletillas = calcular_score_muletillas(transcripcion, muletillas)
    score_velocidad = calcular_score_velocidad(velocidad)
    score_pausas = calcular_score_pausas(pausas)

    score = (
        score_muletillas * PESOS_SCORE_VOZ["muletillas"]
        + score_velocidad * PESOS_SCORE_VOZ["velocidad"]
        + score_pausas * PESOS_SCORE_VOZ["pausas"]
    )

    return {
        "score_voz": _limitar_score(score),
        "detalle_score_voz": {
            "muletillas": score_muletillas,
            "velocidad": score_velocidad,
            "pausas": score_pausas,
            "pesos": PESOS_SCORE_VOZ
        }
    }


def calcular_velocidad_habla(transcripcion: str, duracion_segundos: float) -> dict:
    total_palabras = len(transcripcion.split())
    duracion_segundos = max(float(duracion_segundos or 0), 0)

    if total_palabras == 0 or duracion_segundos == 0:
        palabras_por_minuto = 0
    else:
        palabras_por_minuto = total_palabras / (duracion_segundos / 60)

    palabras_por_minuto = round(palabras_por_minuto, 1)

    if palabras_por_minuto == 0:
        ritmo = "sin_datos"
    elif palabras_por_minuto < 110:
        ritmo = "lento"
    elif palabras_por_minuto <= 170:
        ritmo = "adecuado"
    else:
        ritmo = "rapido"

    return {
        "duracion_segundos": round(duracion_segundos, 2),
        "palabras_por_minuto": palabras_por_minuto,
        "ritmo_habla": ritmo
    }


def detectar_pausas_largas(segmentos: list, umbral_segundos: float = 2.0) -> dict:
    """
    Detecta pausas largas entre segmentos consecutivos de la transcripcion.
    """
    pausas = []
    segmentos_ordenados = sorted(
        segmentos or [],
        key=lambda segmento: float(segmento.get("inicio", 0))
    )

    for anterior, actual in zip(segmentos_ordenados, segmentos_ordenados[1:]):
        fin_anterior = float(anterior.get("fin", 0))
        inicio_actual = float(actual.get("inicio", 0))
        duracion = inicio_actual - fin_anterior

        if duracion >= umbral_segundos:
            pausas.append({
                "inicio": round(fin_anterior, 2),
                "fin": round(inicio_actual, 2),
                "duracion": round(duracion, 2)
            })

    duracion_total = sum(pausa["duracion"] for pausa in pausas)

    return {
        "pausas_largas": pausas,
        "total_pausas_largas": len(pausas),
        "duracion_pausas_largas": round(duracion_total, 2)
    }
