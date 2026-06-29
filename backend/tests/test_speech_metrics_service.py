import io
import wave

import numpy as np

from app.services.speech_metrics_service import (
    calcular_score_voz,
    calcular_velocidad_habla,
    detectar_muletillas,
    detectar_pausas_largas,
    normalizar_texto,
    detectar_lenguaje_indeciso,
    analizar_variacion_ritmo,
    calcular_densidad_temporal_muletillas,
    analizar_prosodia,
)


def _generar_wav(frecuencia_hz: float = 180.0, duracion_s: float = 2.0) -> bytes:
    """Genera un WAV sinusoidal monocanal 16-bit a 16 kHz."""
    SR = 16000
    t = np.linspace(0, duracion_s, int(SR * duracion_s), endpoint=False)
    pcm = (np.sin(2 * np.pi * frecuencia_hz * t) * 0.7 * 32767).astype(np.int16)
    buf = io.BytesIO()
    with wave.open(buf, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    return buf.getvalue()


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


def test_detectar_lenguaje_indeciso_clasifica_nivel():
    texto_seguro = "El producto tiene estas tres ventajas principales."
    assert detectar_lenguaje_indeciso(texto_seguro)["nivel_confianza"] == "seguro"
    assert detectar_lenguaje_indeciso(texto_seguro)["total_expresiones"] == 0

    texto_inseguro = "Creo que tal vez podría ser bueno, aunque no estoy seguro y quizás sea así."
    res = detectar_lenguaje_indeciso(texto_inseguro)
    assert res["total_expresiones"] >= 3
    assert res["nivel_confianza"] in ("inseguro", "muy_inseguro")

    assert detectar_lenguaje_indeciso("")["nivel_confianza"] == "sin_datos"


def test_analizar_variacion_ritmo_detecta_segmentos():
    segs = [
        {"inicio": 0.0, "fin": 5.0, "texto": "hola mundo este es el primero"},     # 6 palabras / 5s = 72 ppm
        {"inicio": 6.0, "fin": 8.0, "texto": "rapido muy rapido ahora"},            # 4 palabras / 2s = 120 ppm
        {"inicio": 9.0, "fin": 15.0, "texto": "lento muy lento sin apuro alguno"}, # 6 palabras / 6s = 60 ppm
    ]
    res = analizar_variacion_ritmo(segs)
    assert len(res["ritmo_por_segmento"]) == 3
    assert res["variacion_ppm"] > 0
    assert res["segmento_mas_rapido"]["ppm"] >= res["segmento_mas_lento"]["ppm"]

    assert analizar_variacion_ritmo([])["variacion_score"] == 100


def test_calcular_densidad_temporal_muletillas_agrupa_en_tercios():
    segmentos = [
        {"inicio": 0.0,  "fin": 10.0, "texto": "este bueno o sea"},    # inicio
        {"inicio": 10.0, "fin": 20.0, "texto": "entonces este paso"},  # medio
        {"inicio": 20.0, "fin": 30.0, "texto": "final sin nada"},      # final
    ]
    muletillas = {"este": 2, "o sea": 1, "entonces": 1}

    res = calcular_densidad_temporal_muletillas(segmentos, muletillas)
    assert res["inicio"] >= 1
    assert res["tercio_critico"] in ("inicio", "medio", "final")

    assert calcular_densidad_temporal_muletillas([], {})["inicio"] == 0


def test_analizar_prosodia_tono_constante_es_monotono():
    wav = _generar_wav(frecuencia_hz=150.0, duracion_s=3.0)
    res = analizar_prosodia(wav)
    assert res["disponible"] is True
    assert res["tono_promedio_hz"] > 0
    # Tono constante → poca variación → monótono o poco variado
    assert res["nivel_monotonia"] in ("muy_monotono", "poco_variado")
    assert 0 <= res["score_prosodia"] <= 100


def test_analizar_prosodia_audio_muy_corto_devuelve_error():
    wav = _generar_wav(frecuencia_hz=200.0, duracion_s=0.2)
    res = analizar_prosodia(wav)
    # Audio < 0.5 s → fallback seguro, no lanza excepción
    assert "disponible" in res
    assert res["disponible"] is False or res.get("score_prosodia", 50) >= 0


def test_analizar_prosodia_bytes_invalidos_devuelve_error():
    res = analizar_prosodia(b"no soy audio")
    assert res["disponible"] is False
    assert "error" in res
