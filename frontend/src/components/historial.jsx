// Historial.jsx
import { Clock, ChevronRight } from "lucide-react";
import { sesionesData, nivelEstilos } from "../constants";

export default function Historial({ busqueda }) {
    const sesionesFiltradas = sesionesData.filter((s) =>
        s.titulo.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <ul className="flex flex-col gap-4">
            {sesionesFiltradas.map((sesion) => (
                <li
                    key={sesion.id}
                    className="bg-white border border-slate-200 rounded-2xl px-6 py-5 flex items-center gap-6 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all shadow-sm"
                >
                    {/* Fecha */}
                    <div className="flex flex-col items-center min-w-14">
                        <span
                            className={`text-xs font-semibold tracking-widest uppercase ${
                                sesion.destacado
                                    ? "bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md"
                                    : "text-slate-400"
                            }`}
                        >
                            {sesion.mes}
                        </span>
                        <span
                            className={`text-2xl font-bold leading-tight mt-1 ${
                                sesion.destacado ? "text-blue-600" : "text-slate-900"
                            }`}
                        >
                            {sesion.dia}
                        </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-slate-900 mb-1 truncate">
                            {sesion.titulo}
                        </h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1.5">
                            <Clock size={13} />
                            {sesion.hora} • {sesion.duracion}
                        </p>
                    </div>

                    {/* Puntaje */}
                    <div className="flex flex-col items-end min-w-24">
                        <div className="flex items-baseline gap-0.5">
                            <span
                                className={`text-3xl font-bold ${
                                    sesion.destacado ? "text-blue-600" : "text-slate-900"
                                }`}
                            >
                                {sesion.puntaje}
                            </span>
                            <span className="text-sm text-slate-400">/100</span>
                        </div>
                        <span
                            className={`text-xs font-semibold tracking-wide mt-0.5 ${nivelEstilos[sesion.nivel]}`}
                        >
                            {sesion.nivel}
                        </span>
                    </div>

                    {/* Flecha */}
                    <ChevronRight size={20} className="text-slate-400 flex-shrink-0" />
                </li>
            ))}

            {sesionesFiltradas.length === 0 && (
                <li className="text-center text-slate-400 py-12 text-sm bg-white border border-slate-200 rounded-2xl">
                    No se encontraron sesiones.
                </li>
            )}
        </ul>
    );
}