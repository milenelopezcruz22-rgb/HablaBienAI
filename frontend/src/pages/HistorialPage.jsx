import { useState } from "react";
import Historial from "../components/Historial";

export default function HistorialPage() {
  const [busqueda, setBusqueda] = useState("");

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
              Has completado 3 sesiones este mes. ¡Vas por buen camino!
            </p>
          </div>
          <div className="flex items-center gap-2 bg-green-100 text-green-600 font-bold text-sm px-4 py-2 rounded-xl">
            <span>↗</span>
            <span>+15% Mejora</span>
          </div>
        </div>

        {/* Lista de sesiones */}
        <Historial busqueda={busqueda} />
      </div>
    </div>
  );
}
