// HistorialPage.jsx
import { useState, useEffect } from "react";
import { Search, History, ArrowUpRight, SlidersHorizontal, Loader2, Mic } from "lucide-react";
import { Link } from "react-router-dom";
import Historial from "../components/Historial";
import EvolucionChart from "../components/EvolucionChart";
import { obtenerHistorial, eliminarSesion } from "../services/api";

export default function HistorialPage() {
    const [busqueda, setBusqueda] = useState("");
    const [sesiones, setSesiones] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const cargar = async () => {
        setCargando(true);
        setError(null);
        try {
            const data = await obtenerHistorial();
            setSesiones(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || "No se pudo cargar el historial.");
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargar();
    }, []);

    const handleEliminar = async (id) => {
        const previas = sesiones;
        setSesiones((prev) => prev.filter((s) => s.id !== id)); // optimista
        try {
            await eliminarSesion(id);
        } catch {
            setSesiones(previas); // revertir si falla
        }
    };

    const promedio = sesiones.length
        ? Math.round(sesiones.reduce((acc, s) => acc + (s.score_voz || 0), 0) / sesiones.length)
        : 0;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
            <main className="max-w-[1600px] mx-auto px-6 py-10">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-sm">
                            <History size={20} />
                        </div>
                        <h1 className="text-xl font-semibold text-slate-900">
                            Historial de Sesiones
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400 transition-all">
                            <Search size={18} className="text-slate-400" />
                            <input
                                type="text"
                                placeholder="Buscar sesión..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                className="bg-transparent border-none outline-none text-sm text-slate-700 w-48 placeholder-slate-400"
                            />
                        </div>
                        <button className="flex items-center justify-center w-10 h-10 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all shadow-sm">
                            <SlidersHorizontal size={18} />
                        </button>
                    </div>
                </div>

                {/* Progreso */}
                <div className="flex items-start justify-between mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">
                            Tus Progresos
                        </h2>
                        <p className="text-slate-500 text-sm">
                            {sesiones.length > 0
                                ? `Has completado ${sesiones.length} ${sesiones.length === 1 ? "sesión" : "sesiones"}. ¡Vas por buen camino!`
                                : "Aún no tienes sesiones registradas."}
                        </p>
                    </div>
                    {sesiones.length > 0 && (
                        <div className="flex items-center gap-2 bg-green-50 text-green-600 font-semibold text-sm px-4 py-2 rounded-xl border border-green-200">
                            <ArrowUpRight size={16} />
                            <span>Promedio {promedio}/100</span>
                        </div>
                    )}
                </div>

                {/* Estados */}
                {cargando && (
                    <div className="flex items-center justify-center gap-3 py-20 text-slate-400">
                        <Loader2 size={20} className="animate-spin" />
                        <span className="text-sm">Cargando historial...</span>
                    </div>
                )}

                {!cargando && error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm text-center border border-red-200">
                        {error}
                    </div>
                )}

                {!cargando && !error && sesiones.length === 0 && (
                    <div className="flex flex-col items-center gap-4 py-16 bg-white border border-slate-200 rounded-2xl text-center">
                        <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                            <Mic size={26} />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-1">Sin sesiones todavía</h3>
                            <p className="text-slate-500 text-sm">Graba tu primera presentación para ver tu progreso aquí.</p>
                        </div>
                        <Link
                            to="/camera"
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-all"
                        >
                            Grabar primera sesión
                        </Link>
                    </div>
                )}

                {!cargando && !error && sesiones.length > 0 && (
                    <>
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8">
                            <h3 className="text-sm font-semibold text-slate-700 mb-4">Evolución de tu puntaje</h3>
                            <EvolucionChart sesiones={sesiones} />
                        </div>
                        <Historial sesiones={sesiones} busqueda={busqueda} onEliminar={handleEliminar} />
                    </>
                )}
            </main>
        </div>
    );
}
