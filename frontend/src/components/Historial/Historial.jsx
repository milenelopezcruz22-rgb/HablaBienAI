import { useState } from "react";
import "./Historial.css";

const sesionesData = [
  {
    id: 1,
    mes: "OCT",
    dia: 24,
    titulo: "Presentación de Proyecto Final",
    hora: "14:30 PM",
    duracion: "5 min 12 seg",
    puntaje: 88,
    nivel: "SOBRESALIENTE",
    destacado: true,
  },
  {
    id: 2,
    mes: "OCT",
    dia: 22,
    titulo: "Ensayo: Pitch de Ventas",
    hora: "09:15 AM",
    duracion: "2 min 45 seg",
    puntaje: 74,
    nivel: "BUENO",
    destacado: false,
  },
  {
    id: 3,
    mes: "OCT",
    dia: 20,
    titulo: "Práctica de Entonación",
    hora: "18:00 PM",
    duracion: "12 min 00 seg",
    puntaje: 62,
    nivel: "EN PROGRESO",
    destacado: false,
  },
];

const getNivelColor = (nivel) => {
  switch (nivel) {
    case "SOBRESALIENTE": return "var(--color-sobresaliente)";
    case "BUENO": return "var(--color-bueno)";
    case "EN PROGRESO": return "var(--color-progreso)";
    default: return "#666";
  }
};

export default function Historial() {
  const [busqueda, setBusqueda] = useState("");

  const sesionesFiltradas = sesionesData.filter((s) =>
    s.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="historial-wrapper">
      {/* Header */}
      <header className="historial-header">
        <div className="historial-logo">
          <span className="logo-icon">✏</span>
          <h1 className="logo-titulo">Historial de Sesiones</h1>
        </div>
        <div className="historial-busqueda">
          <span className="busqueda-icono">🔍</span>
          <input
            type="text"
            placeholder="Buscar sesión..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="busqueda-input"
          />
          <button className="filtro-btn" title="Filtrar">⚗</button>
        </div>
      </header>

      <div className="historial-contenido">
        {/* Progreso */}
        <section className="progreso-seccion">
          <div className="progreso-texto">
            <h2 className="progreso-titulo">Tus Progresos</h2>
            <p className="progreso-subtitulo">
              Has completado {sesionesData.length} sesiones este mes. ¡Vas por buen camino!
            </p>
          </div>
          <div className="progreso-badge">
            <span className="badge-icono">↗</span>
            <span>+15% Mejora</span>
          </div>
        </section>

        {/* Lista de sesiones */}
        <ul className="sesiones-lista">
          {sesionesFiltradas.map((sesion) => (
            <li
              key={sesion.id}
              className={`sesion-card ${sesion.destacado ? "sesion-destacada" : ""}`}
            >
              {/* Fecha */}
              <div className={`sesion-fecha ${sesion.destacado ? "fecha-destacada" : ""}`}>
                <span className="fecha-mes">{sesion.mes}</span>
                <span className="fecha-dia">{sesion.dia}</span>
              </div>

              {/* Info */}
              <div className="sesion-info">
                <h3 className="sesion-titulo">{sesion.titulo}</h3>
                <p className="sesion-meta">
                  <span className="meta-reloj">⏱</span>
                  {sesion.hora} • {sesion.duracion}
                </p>
              </div>

              {/* Puntaje */}
              <div className="sesion-puntaje">
                <div className="puntaje-numero">
                  <span className="puntaje-grande">{sesion.puntaje}</span>
                  <span className="puntaje-total">/100</span>
                </div>
                <span
                  className="puntaje-nivel"
                  style={{ color: getNivelColor(sesion.nivel) }}
                >
                  {sesion.nivel}
                </span>
              </div>

              {/* Flecha */}
              <button className="sesion-flecha" aria-label="Ver detalle">›</button>
            </li>
          ))}

          {sesionesFiltradas.length === 0 && (
            <li className="sesiones-vacio">No se encontraron sesiones.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
