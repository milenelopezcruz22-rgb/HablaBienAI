from app.services.speech_metrics_service import (
    calcular_score_voz,
    calcular_velocidad_habla,
    detectar_muletillas,
    detectar_pausas_largas,
    normalizar_texto,
)


def test_normalizar_texto_quita_tildes_mayusculas_y_signos():
    texto = "Más o menos, ASÍ QUE... Básicamente."

    assert normalizar_texto(texto) == "mas o menos asi que basicamente"


def test_detectar_muletillas_contextuales_de_transcripcion_corta():
    texto = "Ok, prueba de voz, este, bueno, se te trae, como diría, ¿quién sabe?"

    assert detectar_muletillas(texto) == {
        "este": 1,
        "bueno": 1,
        "como diria": 1,
    }


def test_no_detecta_usos_legitimos_como_muletillas():
    texto = "Este punto es importante y el resultado es bueno. Esteban esta comodo."

    assert detectar_muletillas(texto) == {}


def test_detecta_vocalizaciones_alargadas():
    texto = "mmmm mmmmm emmm ammm ummm ehhh eee"

    assert detectar_muletillas(texto) == {
        "mmm": 5,
        "eee": 1,
        "ehhh": 1,
    }


def test_calcular_velocidad_habla_clasifica_ritmo():
    assert calcular_velocidad_habla(" ".join(["palabra"] * 80), 60)["ritmo_habla"] == "lento"
    assert calcular_velocidad_habla(" ".join(["palabra"] * 130), 60)["ritmo_habla"] == "adecuado"
    assert calcular_velocidad_habla(" ".join(["palabra"] * 190), 60)["ritmo_habla"] == "rapido"
    assert calcular_velocidad_habla("", 0)["ritmo_habla"] == "sin_datos"


def test_detectar_pausas_largas_usa_palabras_si_existen():
    segmentos = [{"inicio": 0.0, "fin": 8.0, "texto": "una frase con pausa interna"}]
    palabras = [
        {"inicio": 0.0, "fin": 0.4, "texto": "una"},
        {"inicio": 0.5, "fin": 0.9, "texto": "frase"},
        {"inicio": 3.0, "fin": 3.5, "texto": "con"},
    ]

    resultado = detectar_pausas_largas(segmentos, palabras)

    assert resultado["fuente_pausas"] == "palabras"
    assert resultado["total_pausas_largas"] == 1
    assert resultado["pausas_largas"][0] == {"inicio": 0.9, "fin": 3.0, "duracion": 2.1}


def test_detectar_pausas_largas_usa_segmentos_como_respaldo():
    segmentos = [
        {"inicio": 0.0, "fin": 1.0},
        {"inicio": 2.8, "fin": 4.0},
    ]

    resultado = detectar_pausas_largas(segmentos)

    assert resultado["fuente_pausas"] == "segmentos"
    assert resultado["total_pausas_largas"] == 1
    assert resultado["pausas_largas"][0] == {"inicio": 1.0, "fin": 2.8, "duracion": 1.8}


def test_calcular_score_voz_ponderado():
    texto_ok = " ".join(["palabra"] * 130)
    velocidad_ok = {"palabras_por_minuto": 130}
    pausas_ok = {"total_pausas_largas": 0, "duracion_pausas_largas": 0}

    assert calcular_score_voz(texto_ok, {}, velocidad_ok, pausas_ok)["score_voz"] == 100

    texto_mal = " ".join(["palabra"] * 90)
    muletillas = {"este": 5, "bueno": 4}
    velocidad_lenta = {"palabras_por_minuto": 80}
    pausas_malas = {"total_pausas_largas": 3, "duracion_pausas_largas": 8.5}

    assert calcular_score_voz(texto_mal, muletillas, velocidad_lenta, pausas_malas)["score_voz"] == 31.1
    assert calcular_score_voz("", {}, {}, {})["score_voz"] == 0
