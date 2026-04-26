import { useState } from "react";
import { sesionesData, nivelEstilos } from "../../constants";

export default function Historial({ busqueda }) {
  const sesionesFiltradas = sesionesData.filter((s) =>
    s.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
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
  );
}
