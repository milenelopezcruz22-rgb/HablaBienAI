// Historial.jsx
import { Clock, ChevronRight, Trash2 } from "lucide-react";

const MESES = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

const nivelEstilos = {
    SOBRESALIENTE: "text-indigo-500",
    BUENO: "text-amber-500",
    "EN PROGRESO": "text-gray-800",
};

function nivelDesdeScore(score) {
    if (score >= 80) return "SOBRESALIENTE";
    if (score >= 60) return "BUENO";
    return "EN PROGRESO";
}

function formatearDuracion(segundos) {
    const s = Math.round(segundos || 0);
    const min = Math.floor(s / 60);
    const seg = s % 60;
    if (min === 0) return `${seg} seg`;
    return `${min} min ${seg.toString().padStart(2, "0")} seg`;
}

function mapearSesion(sesion) {
    const fecha = sesion.fecha ? new Date(sesion.fecha) : new Date();
    const score = Math.round(sesion.score_voz || 0);
    return {
        id: sesion.id,
        mes: MESES[fecha.getMonth()],
        dia: fecha.getDate(),
        titulo: sesion.titulo || "Sesión de práctica",
        hora: fecha.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }),
        duracion: formatearDuracion(sesion.duracion_segundos),
        puntaje: score,
        nivel: nivelDesdeScore(score),
    };
}

export default function Historial({ sesiones = [], busqueda = "", onEliminar }) {
    const filtradas = sesiones
        .map(mapearSesion)
        .filter((s) => s.titulo.toLowerCase().includes(busqueda.toLowerCase()));

    return (
        <ul className="flex flex-col gap-4">
            {filtradas.map((sesion) => (
                <li
                    key={sesion.id}
                    className="bg-white border border-slate-200 rounded-2xl px-6 py-5 flex items-center gap-6 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all shadow-sm"
                >
                    {/* Fecha */}
                    <div className="flex flex-col items-center min-w-14">
                        <span className="text-xs font-semibold tracking-widest uppercase text-slate-400">
                            {sesion.mes}
                        </span>
                        <span className="text-2xl font-bold leading-tight mt-1 text-slate-900">
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
                            <span className="text-3xl font-bold text-slate-900">
                                {sesion.puntaje}
                            </span>
                            <span className="text-sm text-slate-400">/100</span>
                        </div>
                        <span className={`text-xs font-semibold tracking-wide mt-0.5 ${nivelEstilos[sesion.nivel]}`}>
                            {sesion.nivel}
                        </span>
                    </div>

                    {/* Acciones */}
                    {onEliminar && (
                        <button
                            onClick={() => onEliminar(sesion.id)}
                            className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
                            title="Eliminar sesión"
                        >
                            <Trash2 size={18} />
                        </button>
                    )}

                    <ChevronRight size={20} className="text-slate-400 flex-shrink-0" />
                </li>
            ))}

            {filtradas.length === 0 && (
                <li className="text-center text-slate-400 py-12 text-sm bg-white border border-slate-200 rounded-2xl">
                    No se encontraron sesiones.
                </li>
            )}
        </ul>
    );
}
