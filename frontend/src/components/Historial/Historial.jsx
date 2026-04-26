import { useState } from "react";

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

const nivelEstilos = {
  SOBRESALIENTE: "text-indigo-500",
  BUENO: "text-amber-500",
  "EN PROGRESO": "text-gray-800",
};

export default function Historial() {
  const [busqueda, setBusqueda] = useState("");

  const sesionesFiltradas = sesionesData.filter((s) =>
    s.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-10 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white text-lg">
            ✏
          </div>
          <h1 className="text-xl font-bold text-gray-900">Historial de Sesiones</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-lg">🔍</span>
          <input
            type="text"
            placeholder="Buscar sesión..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="bg-transparent border-none outline-none text-gray-500 text-sm w-48 placeholder-gray-300"
          />
          <button className="text-gray-400 text-xl">⚗</button>
        </div>
      </header>

      {/* Contenido */}
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Progreso */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Tus Progresos</h2>
            <p className="text-gray-500 text-sm">
              Has completado {sesionesData.length} sesiones este mes. ¡Vas por buen camino!
            </p>
          </div>
          <div className="flex items-center gap-2 bg-green-100 text-green-600 font-bold text-sm px-4 py-2 rounded-xl">
            <span>↗</span>
            <span>+15% Mejora</span>
          </div>
        </div>

        {/* Lista */}
        <ul className="flex flex-col gap-4">
          {sesionesFiltradas.map((sesion) => (
            <li
              key={sesion.id}
              className="bg-white border border-gray-200 rounded-2xl px-7 py-5 flex items-center gap-6 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              {/* Fecha */}
              <div className="flex flex-col items-center min-w-12">
                <span
                  className={`text-xs font-semibold tracking-widest uppercase ${
                    sesion.destacado
                      ? "bg-indigo-100 text-indigo-500 px-2 py-0.5 rounded"
                      : "text-gray-400"
                  }`}
                >
                  {sesion.mes}
                </span>
                <span
                  className={`text-2xl font-extrabold leading-tight ${
                    sesion.destacado ? "text-indigo-500" : "text-gray-900"
                  }`}
                >
                  {sesion.dia}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="text-base font-bold text-gray-900 mb-1">{sesion.titulo}</h3>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <span>⏱</span>
                  {sesion.hora} • {sesion.duracion}
                </p>
              </div>

              {/* Puntaje */}
              <div className="flex flex-col items-end min-w-24">
                <div className="flex items-baseline gap-0.5">
                  <span
                    className={`text-3xl font-extrabold ${
                      sesion.destacado ? "text-indigo-500" : "text-gray-900"
                    }`}
                  >
                    {sesion.puntaje}
                  </span>
                  <span className="text-sm text-gray-400">/100</span>
                </div>
                <span className={`text-xs font-bold tracking-wide mt-0.5 ${nivelEstilos[sesion.nivel]}`}>
                  {sesion.nivel}
                </span>
              </div>

              {/* Flecha */}
              <span className="text-2xl text-gray-400">›</span>
            </li>
          ))}

          {sesionesFiltradas.length === 0 && (
            <li className="text-center text-gray-400 py-10 text-sm">
              No se encontraron sesiones.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
