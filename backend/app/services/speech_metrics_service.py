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


def calcular_score_voz(transcripcion: str, muletillas: dict) -> float:
    total_muletillas = sum(muletillas.values())
    total_palabras = len(transcripcion.split())

    score = 100 - (total_muletillas / max(total_palabras, 1)) * 100
    return round(max(0, min(100, score)), 1)
