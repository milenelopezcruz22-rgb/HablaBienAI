MULETILLAS = [
    "ehhh", "eee", "mmmm", "mmm", "este", "esta", "esto",
    "bueno", "o sea", "en plan", "tipo", "como", "verdad",
    "vale", "entonces", "así que", "por ejemplo", "digo yo",
    "sabes", "entiendes", "más o menos", "al final", "literalmente",
    "básicamente", "obviamente", "claramente", "de hecho", "en realidad"
]


def detectar_muletillas(transcripcion: str) -> dict:
    """
    Detecta muletillas en la transcripcion y cuenta su frecuencia.
    """
    transcripcion_lower = transcripcion.lower()
    muletillas_count = {}

    for muletilla in MULETILLAS:
        count = transcripcion_lower.count(muletilla)
        if count > 0:
            muletillas_count[muletilla] = count

    return muletillas_count


def calcular_score_voz(transcripcion: str, muletillas: dict) -> float:
    total_muletillas = sum(muletillas.values())
    total_palabras = len(transcripcion.split())

    score = 100 - (total_muletillas / max(total_palabras, 1)) * 100
    return round(max(0, min(100, score)), 1)
