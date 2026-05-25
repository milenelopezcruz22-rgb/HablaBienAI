from app.services import groq_service


def test_analizar_con_groq_devuelve_feedback_local_sin_cliente(monkeypatch):
    monkeypatch.setattr(groq_service, "client", None)

    resultado = groq_service.analizar_con_groq(
        "este, bueno, prueba de voz",
        {
            "total_muletillas": 2,
            "ritmo_habla": "rapido",
            "total_pausas_largas": 1,
        },
    )

    assert resultado["fuente_feedback"] == "local"
    assert resultado["feedback"]
    assert len(resultado["recomendaciones"]) == 3
