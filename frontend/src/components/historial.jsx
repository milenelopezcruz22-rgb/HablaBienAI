import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, ChevronRight, Film, Search } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "../services/api";

function formatearFecha(fechaISO) {
  const d = new Date(fechaISO);
  const meses = ["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"];
  return {
    mes: meses[d.getMonth()],
    dia: d.getDate(),
    hora: d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }),
  };
}

function formatoDuracion(seg) {
  if (!seg) return "0 min";
  const m = Math.floor(seg / 60);
  const s = seg % 60;
  return m > 0 ? `${m} min ${s} seg` : `${s} seg`;
}

function nivelDesdePuntaje(puntaje) {
  if (puntaje >= 85) return { label: "SOBRESALIENTE", style: "text-indigo-500" };
  if (puntaje >= 70) return { label: "BUENO", style: "text-amber-500" };
  return { label: "EN PROGRESO", style: "text-gray-800" };
}

export default function Historial({ busqueda }) {
  const navigate = useNavigate();
  const [sesiones, setSesiones] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    api.sesiones.list()
      .then(({ sesiones }) => setSesiones(sesiones))
      .catch(() => {})
      .finally(() => setCargando(false));
  }, []);

  const filtradas = sesiones.filter((s) =>
    (s.titulo || "").toLowerCase().includes(busqueda.toLowerCase())
  );

  if (cargando) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-sky-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (filtradas.length === 0) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center py-16 px-6 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {busqueda ? (
            <Search size={32} className="text-slate-400" />
          ) : (
            <Film size={32} className="text-slate-400" />
          )}
        </motion.div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          {busqueda ? "Sin resultados" : "Sin sesiones grabadas"}
        </h3>
        <p className="text-sm text-slate-600 text-center max-w-sm">
          {busqueda 
            ? "No se encontraron sesiones con ese término. Intenta otra búsqueda."
            : "Aún no tienes sesiones grabadas. ¡Graba tu primera presentación para obtener análisis detallado!"}
        </p>
      </motion.div>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {filtradas.map((s) => {
        const fecha = formatearFecha(s.fecha);
        const nivel = nivelDesdePuntaje(s.puntaje_general);
        return (
          <li
            key={s.id}
            onClick={() => navigate(`/dashboard/${s.id}`)}
            className="bg-white border border-slate-200 rounded-2xl px-6 py-5 flex items-center gap-6 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all shadow-sm"
          >
            <div className="flex flex-col items-center min-w-14">
              <span className="text-xs font-semibold tracking-widest uppercase text-slate-400">
                {fecha.mes}
              </span>
              <span className="text-2xl font-bold leading-tight mt-1 text-slate-900">
                {fecha.dia}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-slate-900 mb-1 truncate">
                {s.titulo}
              </h3>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Clock size={13} />
                {fecha.hora} &bull; {formatoDuracion(s.duracion_seg)}
              </p>
            </div>

            <div className="flex flex-col items-end min-w-24">
              <div className="flex items-baseline gap-0.5">
                <span className="text-3xl font-bold text-slate-900">
                  {s.puntaje_general}
                </span>
                <span className="text-sm text-slate-400">/100</span>
              </div>
              <span className={`text-xs font-semibold tracking-wide mt-0.5 ${nivel.style}`}>
                {nivel.label}
              </span>
            </div>

            <ChevronRight size={20} className="text-slate-400 flex-shrink-0" />
          </li>
        );
      })}
    </ul>
  );
}
