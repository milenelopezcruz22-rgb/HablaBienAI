import re
import subprocess
import unicodedata


# ---------------------------------------------------------------------------
# Muletillas léxicas y sus umbrales mínimos de aparición
# ---------------------------------------------------------------------------

MULETILLAS = [
    # Conectores / transición
    "pues", "bueno", "entonces", "o sea", "es que", "asi que",
    # Confirmación / acuerdo
    "claro", "exacto", "vale", "verdad", "sabes", "entiendes",
    # Relleno de inicio de frase
    "este", "esta", "esto", "mira", "venga", "digamos",
    # Intensificadores / calificadores repetitivos
    "tipo", "como", "en plan", "mas o menos", "al final",
    "literalmente", "basicamente", "obviamente", "claramente",
    "de hecho", "en realidad", "la verdad", "no se",
    # Relleno de cierre
    "nada", "igual", "digo yo", "como diria", "por ejemplo",
    # Palabras de relleno neutras (alto umbral para no sobre-penalizar)
    "ya", "bien", "hombre",
    # Castellano / coloquial español
    "a ver", "oye", "tio", "macho", "vamos", "fijate",
    "anda", "hala", "claro que si", "por supuesto",
]

UMBRAL_MULETILLAS = {
    # Conectores frecuentes → umbral bajo
    "pues": 2,
    "bueno": 2,
    "entonces": 3,
    "o sea": 2,
    "es que": 3,
    "asi que": 2,
    # Confirmación
    "claro": 3,
    "exacto": 2,
    "vale": 2,
    "verdad": 2,
    "sabes": 2,
    "entiendes": 2,
    # Inicio de frase
    "este": 2,
    "esta": 3,
    "esto": 3,
    "mira": 2,
    "venga": 2,
    "digamos": 2,
    # Calificadores
    "tipo": 2,
    "como": 4,          # "como" tiene uso gramatical legítimo → umbral más alto
    "en plan": 2,
    "mas o menos": 2,
    "al final": 2,
    "literalmente": 2,
    "basicamente": 2,
    "obviamente": 2,
    "claramente": 2,
    "de hecho": 2,
    "en realidad": 2,
    "la verdad": 2,
    "no se": 2,
    # Cierre
    "nada": 3,
    "igual": 2,
    "digo yo": 1,
    "como diria": 1,
    "por ejemplo": 2,
    # Uso neutro → umbral alto para no penalizar uso normal
    "ya": 5,
    "bien": 4,
    "hombre": 3,
    # Castellano / coloquial español
    "a ver": 3,          # "a ver" como transición tiene uso legítimo
    "oye": 3,
    "tio": 2,
    "macho": 2,
    "vamos": 4,          # "vamos" tiene muchos usos legítimos
    "fijate": 2,
    "anda": 3,
    "hala": 2,
    "claro que si": 2,
    "por supuesto": 3,
}

# ---------------------------------------------------------------------------
# Patrones de vocalización (sonidos de duda)
# ---------------------------------------------------------------------------

VOCALIZACIONES_PATRONES = [
    # mmm / mmmm / emm / amm / umm  — todas las variantes nasales de duda
    ("mmm",  re.compile(r"(?<!\w)(?:m{3,}|[eau]+m{2,})(?!\w)")),
    # eee / eeeh
    ("eee",  re.compile(r"(?<!\w)e{3,}(?!\w)")),
    # ehh / ehhh (label histórico mantenido)
    ("ehhh", re.compile(r"(?<!\w)e+h+(?!\w)")),
    # ahh / ahhh
    ("ahh",  re.compile(r"(?<!\w)a+h{2,}(?!\w)")),
    # hmm / hmmm
    ("hmm",  re.compile(r"(?<!\w)h+m{2,}(?!\w)")),
    # uh / uhh (puro, sin 'm')
    ("uhh",  re.compile(r"(?<!\w)u+h+(?!\w)")),
    # la la la la — sílaba de relleno castellano (ej: "la la la la, no sé qué decir")
    # Requiere 3+ repeticiones para no confundir con usos naturales del artículo
    ("la la", re.compile(r"(?<!\w)la(?:\s+la){2,}(?!\w)")),
    # na na / bla bla — otras sílabas de relleno
    ("bla bla", re.compile(r"(?<!\w)bla(?:\s+bla){1,}(?!\w)")),
]

# ---------------------------------------------------------------------------
# Patrones contextuales (muletilla solo válida con cierto contexto sintáctico)
# ---------------------------------------------------------------------------

MULETILLAS_CONTEXTUALES_PATRONES = [
    ("este",  re.compile(r"(?<!\w)este\s*(?:[,;:]|\.{2,})(?!\w)")),
    ("bueno", re.compile(r"(?<!\w)bueno\s*(?:[,;:]|\.{2,})(?!\w)")),
    ("como diria", re.compile(r"(?<!\w)como\s+diria(?!\w)")),
    ("pues",  re.compile(r"(?<!\w)pues\s*(?:[,;:]|\.{2,}|$)")),
]

# ---------------------------------------------------------------------------
# Palabras excluidas de la detección de repetición consecutiva
# (palabras gramaticalmente funcionales que se repiten de forma natural)
# ---------------------------------------------------------------------------

_STOPWORDS = {
    "de", "la", "el", "en", "y", "a", "que", "un", "una", "es", "lo",
    "se", "los", "las", "por", "con", "del", "al", "su", "sus",
    "me", "te", "le", "mi", "tu", "si", "son", "ha", "he", "han",
    "fue", "ser", "hay", "mas", "nos", "les",
    # "muy" y "ya" se excluyen a propósito: si se repiten 3+ veces
    # consecutivamente sí son muletillas (ej: "muy muy muy muy muy")
}


# ---------------------------------------------------------------------------
# Normalización
# ---------------------------------------------------------------------------

def normalizar_texto(texto: str) -> str:
    texto = texto or ""
    texto = texto.lower()
    texto = unicodedata.normalize("NFD", texto)
    texto = "".join(ch for ch in texto if unicodedata.category(ch) != "Mn")
    texto = re.sub(r"[^a-z0-9]+", " ", texto)
    return re.sub(r"\s+", " ", texto).strip()


def normalizar_texto_mantener_pausas(texto: str) -> str:
    texto = texto or ""
    texto = texto.lower()
    texto = unicodedata.normalize("NFD", texto)
    texto = "".join(ch for ch in texto if unicodedata.category(ch) != "Mn")
    texto = re.sub(r"[^a-z0-9,;:.]+", " ", texto)
    return re.sub(r"\s+", " ", texto).strip()


# ---------------------------------------------------------------------------
# Construcción de patrones para muletillas léxicas
# ---------------------------------------------------------------------------

def _crear_patron_muletilla(muletilla: str) -> re.Pattern:
    palabras = normalizar_texto(muletilla).split()
    patron = r"\s+".join(re.escape(p) for p in palabras)
    return re.compile(rf"(?<!\w){patron}(?!\w)")


MULETILLAS_PATRONES = [
    (m, _crear_patron_muletilla(m)) for m in MULETILLAS
]


# ---------------------------------------------------------------------------
# Detección de repetición consecutiva de palabras de contenido
# (ej: "muy muy muy muy" → {"muy": 4})
# ---------------------------------------------------------------------------

def _detectar_repeticiones_consecutivas(texto_normalizado: str) -> dict:
    """
    Detecta palabras de contenido (≥4 letras, no stopword) repetidas
    3 o más veces de forma consecutiva en el texto.
    """
    palabras = texto_normalizado.split()
    resultado = {}
    i = 0
    while i < len(palabras):
        palabra = palabras[i]
        if len(palabra) < 3 or palabra in _STOPWORDS:
            i += 1
            continue
        # Contar cuántas veces seguidas aparece esta palabra
        j = i + 1
        while j < len(palabras) and palabras[j] == palabra:
            j += 1
        count = j - i
        if count >= 3:
            resultado[palabra] = max(resultado.get(palabra, 0), count)
        i = j
    return resultado


# ---------------------------------------------------------------------------
# Función principal de detección
# ---------------------------------------------------------------------------

def detectar_muletillas(transcripcion: str) -> dict:
    """
    Detecta muletillas en la transcripción y devuelve {muletilla: frecuencia}.
    Combina:
      1. Vocalizaciones (mmm, umm, ehh …)
      2. Muletillas contextuales (bueno, pues seguidos de pausa)
      3. Muletillas léxicas con umbral mínimo
      4. Palabras de contenido repetidas ≥3 veces consecutivas
    """
    t_norm = normalizar_texto(transcripcion)
    t_pausas = normalizar_texto_mantener_pausas(transcripcion)
    muletillas_count: dict[str, int] = {}

    # 1. Vocalizaciones
    for etiqueta, patron in VOCALIZACIONES_PATRONES:
        count = len(patron.findall(t_norm))
        if count > 0:
            muletillas_count[etiqueta] = count

    # 2. Muletillas contextuales
    for etiqueta, patron in MULETILLAS_CONTEXTUALES_PATRONES:
        count = len(patron.findall(t_pausas))
        if count > 0:
            muletillas_count[etiqueta] = max(muletillas_count.get(etiqueta, 0), count)

    # 3. Muletillas léxicas con umbral
    for muletilla, patron in MULETILLAS_PATRONES:
        count = len(patron.findall(t_norm))
        umbral = UMBRAL_MULETILLAS.get(muletilla, 2)
        if count >= umbral:
            muletillas_count[muletilla] = max(muletillas_count.get(muletilla, 0), count)

    # 4. Repetición consecutiva de palabras de contenido
    repetidas = _detectar_repeticiones_consecutivas(t_norm)
    for palabra, count in repetidas.items():
        # Mostrar con etiqueta clara; si ya existe sumar al mayor
        etiqueta = f"{palabra} (repetición)"
        muletillas_count[etiqueta] = max(muletillas_count.get(etiqueta, 0), count)

    return muletillas_count


# ---------------------------------------------------------------------------
# Scoring
# ---------------------------------------------------------------------------

PESOS_SCORE_VOZ = {
    "muletillas": 0.45,
    "velocidad":  0.35,
    "pausas":     0.20,
}


def _limitar_score(score: float) -> float:
    return round(max(0.0, min(100.0, score)), 1)


def calcular_score_muletillas(transcripcion: str, muletillas: dict) -> float:
    total_muletillas = sum(muletillas.values())
    total_palabras   = len(transcripcion.split())
    muletillas_por_100 = (total_muletillas / max(total_palabras, 1)) * 100
    return _limitar_score(100 - (muletillas_por_100 * 10))


def calcular_score_velocidad(velocidad: dict | None) -> float:
    ppm = float((velocidad or {}).get("palabras_por_minuto", 0))
    if ppm == 0:
        return 70.0
    if 110 <= ppm <= 170:
        return 100.0
    if ppm < 110:
        return _limitar_score(100 - (110 - ppm) * 1.1)
    return _limitar_score(100 - (ppm - 170) * 1.2)


def calcular_score_pausas(pausas: dict | None) -> float:
    total    = int((pausas or {}).get("total_pausas_largas", 0))
    duracion = float((pausas or {}).get("duracion_pausas_largas", 0))
    penalizacion = (total * 12) + (duracion * 3)
    return _limitar_score(100 - penalizacion)


def calcular_score_voz(
    transcripcion: str,
    muletillas: dict,
    velocidad: dict | None = None,
    pausas: dict | None = None,
    claridad: dict | None = None,
) -> dict:
    if not transcripcion.split():
        return {
            "score_voz": 0.0,
            "detalle_score_voz": {
                "muletillas": 0.0,
                "velocidad":  0.0,
                "pausas":     0.0,
                "pesos":      PESOS_SCORE_VOZ,
            },
        }

    sm = calcular_score_muletillas(transcripcion, muletillas)
    sv = calcular_score_velocidad(velocidad)
    sp = calcular_score_pausas(pausas)

    score = (
        sm * PESOS_SCORE_VOZ["muletillas"]
        + sv * PESOS_SCORE_VOZ["velocidad"]
        + sp * PESOS_SCORE_VOZ["pausas"]
    )

    # Si la claridad de pronunciación es baja, el score no puede ser alto:
    # con poca claridad no podemos detectar bien las muletillas reales,
    # y además indica articulación deficiente.
    pct_claridad = (claridad or {}).get("porcentaje_claridad")
    if pct_claridad is not None:
        if pct_claridad < 40:
            score = min(score, 55.0)   # pronunciación muy poco clara
        elif pct_claridad < 60:
            score = min(score, 72.0)   # pronunciación mejorable

    return {
        "score_voz": _limitar_score(score),
        "detalle_score_voz": {
            "muletillas": sm,
            "velocidad":  sv,
            "pausas":     sp,
            "pesos":      PESOS_SCORE_VOZ,
        },
    }


def calcular_velocidad_habla(transcripcion: str, duracion_segundos: float) -> dict:
    total_palabras    = len(transcripcion.split())
    duracion_segundos = max(float(duracion_segundos or 0), 0)

    if total_palabras == 0 or duracion_segundos == 0:
        ppm = 0.0
    else:
        ppm = total_palabras / (duracion_segundos / 60)

    ppm = round(ppm, 1)

    if ppm == 0:
        ritmo = "sin_datos"
    elif ppm < 110:
        ritmo = "lento"
    elif ppm <= 170:
        ritmo = "adecuado"
    else:
        ritmo = "rapido"

    return {
        "duracion_segundos":  round(duracion_segundos, 2),
        "palabras_por_minuto": ppm,
        "ritmo_habla": ritmo,
    }


def _detectar_pausas_entre_items(items: list, umbral_segundos: float) -> list:
    pausas = []
    items_ordenados = sorted(
        items or [],
        key=lambda item: float(item.get("inicio", 0))
    )
    for anterior, actual in zip(items_ordenados, items_ordenados[1:]):
        fin_anterior  = float(anterior.get("fin", 0))
        inicio_actual = float(actual.get("inicio", 0))
        duracion = inicio_actual - fin_anterior
        if duracion >= umbral_segundos:
            pausas.append({
                "inicio":   round(fin_anterior, 2),
                "fin":      round(inicio_actual, 2),
                "duracion": round(duracion, 2),
            })
    return pausas


def calcular_riqueza_vocabulario(transcripcion: str) -> dict:
    """
    Type-Token Ratio sobre palabras de contenido (excluye stopwords y monosílabos).
    TTR alto → vocabulario variado; TTR bajo → vocabulario repetitivo.
    """
    palabras_todas = normalizar_texto(transcripcion).split()
    total = len(palabras_todas)
    if total == 0:
        return {
            "ttr": 0.0,
            "total_palabras": 0,
            "palabras_unicas": 0,
            "nivel_vocabulario": "sin_datos",
        }

    contenido = [p for p in palabras_todas if p not in _STOPWORDS and len(p) > 2]
    total_contenido = len(contenido)
    unicas = len(set(contenido))

    ttr = round((unicas / max(total_contenido, 1)) * 100, 1)

    if ttr >= 65:
        nivel = "rico"
    elif ttr >= 45:
        nivel = "variado"
    elif ttr >= 30:
        nivel = "basico"
    else:
        nivel = "repetitivo"

    return {
        "ttr": ttr,
        "total_palabras": total,
        "palabras_unicas": unicas,
        "nivel_vocabulario": nivel,
    }


def calcular_habla_efectiva(segmentos: list, duracion_total: float) -> dict:
    """
    Porcentaje del tiempo total que el hablante estuvo hablando (no silencio).
    """
    duracion_total = float(duracion_total or 0)
    if not segmentos or duracion_total <= 0:
        return {
            "porcentaje_habla": 0.0,
            "segundos_habla": 0.0,
            "segundos_silencio": 0.0,
        }

    segundos_habla = sum(
        max(0.0, float(s.get("fin", 0)) - float(s.get("inicio", 0)))
        for s in segmentos
    )
    porcentaje = round(min(100.0, (segundos_habla / duracion_total) * 100), 1)

    return {
        "porcentaje_habla": porcentaje,
        "segundos_habla": round(segundos_habla, 2),
        "segundos_silencio": round(max(0.0, duracion_total - segundos_habla), 2),
    }


def calcular_claridad_palabras(palabras: list) -> dict:
    """
    Porcentaje de palabras reconocidas con alta confianza por Whisper.
    Baja claridad (< 70 %) puede indicar articulación poco nítida o ruido.
    """
    if not palabras:
        return {"porcentaje_claridad": None, "palabras_analizadas": 0}

    con_prob = [p for p in palabras if "probabilidad" in p]
    if not con_prob:
        return {"porcentaje_claridad": None, "palabras_analizadas": 0}

    claras = sum(1 for p in con_prob if float(p["probabilidad"]) >= 0.6)
    porcentaje = round((claras / len(con_prob)) * 100, 1)

    return {
        "porcentaje_claridad": porcentaje,
        "palabras_analizadas": len(con_prob),
    }


def detectar_oraciones_largas(
    segmentos: list,
    umbral_segundos: float = 12.0,
) -> dict:
    """
    Detecta segmentos de habla continua > umbral_segundos sin pausa.
    Indican que el hablante no respira bien o habla precipitadamente.
    """
    largas = []
    for s in (segmentos or []):
        inicio = float(s.get("inicio", 0))
        fin = float(s.get("fin", 0))
        duracion = fin - inicio
        if duracion >= umbral_segundos:
            largas.append({
                "inicio": round(inicio, 2),
                "fin": round(fin, 2),
                "duracion": round(duracion, 2),
                "texto_preview": (s.get("texto") or "")[:80],
            })

    return {
        "oraciones_largas": largas,
        "total_oraciones_largas": len(largas),
        "umbral_segundos": umbral_segundos,
    }


# ---------------------------------------------------------------------------
# Lenguaje de inseguridad / duda
# ---------------------------------------------------------------------------

_EXPRESIONES_INDECISAS = [
    "creo que", "no se si", "tal vez", "quizas", "puede que",
    "puede ser que", "no estoy seguro", "no estoy segura",
    "me parece que", "supongo", "supongo que", "a lo mejor",
    "posiblemente", "probablemente", "es posible que",
    "o algo asi", "mas o menos", "no exactamente",
    "algo parecido", "no se bien", "no recuerdo bien",
    "creo recordar", "no tengo claro", "en cierta manera",
    "algo por el estilo", "por decirlo asi",
]


def detectar_lenguaje_indeciso(transcripcion: str) -> dict:
    """
    Detecta expresiones de duda o inseguridad que debilitan el discurso.
    Un orador seguro evita estas muletillas cognitivas.
    """
    texto_norm = normalizar_texto(transcripcion)
    encontradas: dict[str, int] = {}

    for expresion in _EXPRESIONES_INDECISAS:
        expr_norm = normalizar_texto(expresion)
        count = 0
        start = 0
        while True:
            idx = texto_norm.find(expr_norm, start)
            if idx == -1:
                break
            count += 1
            start = idx + len(expr_norm)
        if count > 0:
            encontradas[expresion] = count

    total = sum(encontradas.values())
    palabras = len((transcripcion or "").split())

    if palabras == 0:
        nivel = "sin_datos"
    elif total == 0:
        nivel = "seguro"
    elif total <= 2:
        nivel = "levemente_inseguro"
    elif total <= 5:
        nivel = "inseguro"
    else:
        nivel = "muy_inseguro"

    return {
        "frases_inseguras": encontradas,
        "total_expresiones": total,
        "nivel_confianza": nivel,
    }


# ---------------------------------------------------------------------------
# Variación del ritmo entre segmentos
# ---------------------------------------------------------------------------

def analizar_variacion_ritmo(segmentos: list) -> dict:
    """
    Calcula PPM por segmento y detecta acelerones o frenadas bruscas.
    Alta variación indica falta de control del ritmo del discurso.
    """
    ritmos = []
    for s in (segmentos or []):
        inicio = float(s.get("inicio", 0))
        fin = float(s.get("fin", 0))
        duracion = fin - inicio
        texto = (s.get("texto") or "").strip()
        palabras = len(texto.split())
        if duracion > 0.5 and palabras >= 2:
            ppm = round((palabras / duracion) * 60)
            ritmos.append({
                "inicio": round(inicio, 2),
                "fin": round(fin, 2),
                "texto_preview": texto[:60],
                "ppm": ppm,
                "palabras": palabras,
            })

    if not ritmos:
        return {
            "ritmo_por_segmento": [],
            "ppm_promedio": 0,
            "variacion_ppm": 0,
            "segmento_mas_rapido": None,
            "segmento_mas_lento": None,
            "variacion_score": 100,
        }

    ppms = [r["ppm"] for r in ritmos]
    ppm_media = sum(ppms) / len(ppms)
    variacion = round(max(ppms) - min(ppms)) if len(ppms) > 1 else 0

    if variacion < 30:
        variacion_score = 100
    elif variacion < 60:
        variacion_score = round(100 - ((variacion - 30) / 30) * 30)
    elif variacion < 100:
        variacion_score = round(70 - ((variacion - 60) / 40) * 20)
    else:
        variacion_score = max(50, round(50 - (variacion - 100) * 0.2))

    for r in ritmos:
        desviacion_pct = abs(r["ppm"] - ppm_media) / max(ppm_media, 1) * 100
        r["alerta"] = desviacion_pct > 30

    return {
        "ritmo_por_segmento": ritmos,
        "ppm_promedio": round(ppm_media),
        "variacion_ppm": variacion,
        "segmento_mas_rapido": max(ritmos, key=lambda r: r["ppm"]),
        "segmento_mas_lento": min(ritmos, key=lambda r: r["ppm"]),
        "variacion_score": variacion_score,
    }


# ---------------------------------------------------------------------------
# Densidad temporal de muletillas (¿en qué parte del discurso se concentran?)
# ---------------------------------------------------------------------------

def calcular_densidad_temporal_muletillas(
    segmentos: list,
    muletillas: dict,
) -> dict:
    """
    Divide el discurso en tres tercios y cuenta muletillas en cada uno.
    Útil para detectar si el hablante empieza nervioso, se cansa en el medio, etc.
    """
    if not segmentos or not muletillas:
        return {
            "inicio": 0, "medio": 0, "final": 0,
            "tercio_critico": None,
            "por_segmento": [],
        }

    duracion_total = max(
        (float(s.get("fin", 0)) for s in segmentos),
        default=0.0,
    )
    if duracion_total <= 0:
        return {"inicio": 0, "medio": 0, "final": 0, "tercio_critico": None, "por_segmento": []}

    claves = {
        normalizar_texto(k.replace(" (repetición)", "").strip())
        for k in muletillas
    }

    tercio = duracion_total / 3
    cuenta = {"inicio": 0, "medio": 0, "final": 0}
    por_segmento = []

    for s in segmentos:
        t_inicio = float(s.get("inicio", 0))
        t_fin = float(s.get("fin", 0))
        mitad = (t_inicio + t_fin) / 2
        texto_norm = normalizar_texto(s.get("texto", ""))

        hits = sum(texto_norm.count(m) for m in claves)
        if hits > 0:
            if mitad < tercio:
                cuenta["inicio"] += hits
            elif mitad < tercio * 2:
                cuenta["medio"] += hits
            else:
                cuenta["final"] += hits
            por_segmento.append({
                "inicio": round(t_inicio, 2),
                "fin": round(t_fin, 2),
                "hits": hits,
            })

    tercio_critico = max(cuenta, key=cuenta.get) if any(cuenta.values()) else None

    return {
        "inicio": cuenta["inicio"],
        "medio": cuenta["medio"],
        "final": cuenta["final"],
        "tercio_critico": tercio_critico,
        "por_segmento": por_segmento,
    }


def detectar_pausas_largas(
    segmentos: list,
    palabras: list | None = None,
    umbral_segundos: float = 1.5,
) -> dict:
    fuente = "palabras" if palabras else "segmentos"
    pausas = _detectar_pausas_entre_items(
        palabras if palabras else segmentos,
        umbral_segundos
    )
    duracion_total = sum(p["duracion"] for p in pausas)

    return {
        "pausas_largas":        pausas,
        "total_pausas_largas":  len(pausas),
        "duracion_pausas_largas": round(duracion_total, 2),
        "fuente_pausas":        fuente,
        "umbral_pausa_segundos": umbral_segundos,
    }


# ---------------------------------------------------------------------------
# Análisis de prosodia — tono e inflexión con librosa (pyin) + energía RMS
# ---------------------------------------------------------------------------

_MONOTONIA_LABEL = {
    "muy_monotono":   "Muy monótono",
    "poco_variado":   "Poco variado",
    "adecuado":       "Adecuado",
    "muy_expresivo":  "Muy expresivo",
    "sin_datos":      "Sin datos",
}

_TENDENCIA_LABEL = {
    "ascendente":  "Ascendente (energía final)",
    "descendente": "Descendente (se apaga)",
    "estable":     "Estable",
    "sin_datos":   "Sin datos",
}


def analizar_prosodia(audio_bytes: bytes) -> dict:
    """
    Analiza la prosodia del habla usando librosa:
    - F0/pitch con pyin (probabilistic YIN) — detecta frames con voz real
    - Variación en semitonos — detecta habla monótona vs. expresiva
    - Energía RMS — detecta si el orador varía el volumen/énfasis
    - Tendencia tonal — si el pitch sube o baja a lo largo del discurso
    - Score de prosodia 0-100

    Requiere ffmpeg en el PATH para decodificar audio webm/opus a PCM.
    """
    try:
        import numpy as np
        import librosa
    except ImportError:
        return {"disponible": False, "error": "librosa no instalado. Ejecuta: pip install librosa"}

    SR = 16000

    # 1. Decodificar audio a PCM float32 mono 16 kHz con ffmpeg
    cmd = [
        "ffmpeg", "-hide_banner", "-loglevel", "error",
        "-i", "pipe:0",
        "-f", "f32le", "-ar", str(SR), "-ac", "1", "-vn",
        "pipe:1",
    ]
    try:
        proc = subprocess.run(
            cmd, input=audio_bytes,
            stdout=subprocess.PIPE, stderr=subprocess.PIPE,
            timeout=30,
        )
    except Exception as e:
        return {"disponible": False, "error": f"ffmpeg timeout: {e}"}

    if proc.returncode != 0:
        err = proc.stderr.decode("utf-8", errors="replace")[:300]
        return {"disponible": False, "error": err}

    audio = np.frombuffer(proc.stdout, dtype=np.float32)
    if len(audio) < SR * 0.5:
        return {"disponible": False, "error": "grabacion demasiado corta"}

    # Normalizar amplitud
    max_amp = np.max(np.abs(audio))
    if max_amp > 0:
        audio = audio / max_amp * 0.9

    # 2. Estimación de F0 con pyin (probabilistic YIN)
    try:
        f0, voiced_flag, _ = librosa.pyin(
            audio,
            fmin=70.0,
            fmax=400.0,
            sr=SR,
            frame_length=2048,
            fill_na=None,
        )
    except Exception as e:
        return {"disponible": False, "error": f"librosa pyin error: {e}"}

    # 3. Energía RMS — variación de volumen/énfasis
    try:
        rms = librosa.feature.rms(y=audio, frame_length=2048, hop_length=512)[0]
        rms_mean = float(np.mean(rms))
        energia_variacion = round(float(np.std(rms)) / (rms_mean + 1e-8) * 100, 1)
    except Exception:
        energia_variacion = 0.0

    # Solo frames con voz activa detectada por pyin
    if f0 is None or voiced_flag is None:
        voiced = np.array([])
    else:
        voiced = f0[voiced_flag]
        voiced = voiced[~np.isnan(voiced)]
        voiced = voiced[voiced > 0]

    if len(voiced) < 10:
        return {
            "disponible": True,
            "tono_promedio_hz": 0,
            "variacion_semitonos": 0,
            "nivel_monotonia": "sin_datos",
            "tendencia_tonal": "sin_datos",
            "score_prosodia": 50,
            "porcentaje_voz_activa": 0,
            "energia_variacion": energia_variacion,
        }

    # 4. Variación en semitonos (log2 × 12 = semitonos por octava)
    st = np.log2(voiced) * 12
    std_st = float(np.std(st))
    tono_prom = float(np.mean(voiced))

    # 5. Clasificar nivel de monotonía por variación de pitch
    if std_st < 1.5:
        nivel = "muy_monotono"
        score = max(20, int(std_st / 1.5 * 45))        # 20–45
    elif std_st < 3.0:
        nivel = "poco_variado"
        score = int(45 + (std_st - 1.5) / 1.5 * 25)   # 45–70
    elif std_st < 6.0:
        nivel = "adecuado"
        score = int(70 + (std_st - 3.0) / 3.0 * 25)   # 70–95
    else:
        nivel = "muy_expresivo"
        score = max(70, min(100, int(95 - (std_st - 6.0) * 4)))

    # Bonus por energía dinámica: orador que varía el volumen suena más vivo
    if energia_variacion > 50:
        score = min(100, score + 8)
    elif energia_variacion > 30:
        score = min(100, score + 4)

    # 6. Tendencia tonal (¿el pitch sube o baja hacia el final?)
    mitad = len(voiced) // 2
    primera_mitad = float(np.mean(voiced[:mitad]))
    segunda_mitad = float(np.mean(voiced[mitad:]))
    diff_pct = (segunda_mitad - primera_mitad) / max(primera_mitad, 1) * 100

    if diff_pct > 5:
        tendencia = "ascendente"
    elif diff_pct < -5:
        tendencia = "descendente"
    else:
        tendencia = "estable"

    pct_voz = round(len(voiced) / max(len(f0), 1) * 100, 1)

    return {
        "disponible": True,
        "tono_promedio_hz": round(tono_prom, 1),
        "variacion_semitonos": round(std_st, 2),
        "nivel_monotonia": nivel,
        "tendencia_tonal": tendencia,
        "score_prosodia": int(score),
        "porcentaje_voz_activa": pct_voz,
        "energia_variacion": energia_variacion,
    }
