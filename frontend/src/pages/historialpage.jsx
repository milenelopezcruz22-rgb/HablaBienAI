// HistorialPage.jsx
import { useState } from "react";
import { Search, History, ArrowUpRight, SlidersHorizontal } from "lucide-react";
import Historial from "../components/Historial";

export default function HistorialPage() {
    const [busqueda, setBusqueda] = useState("");

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
                            Has completado 3 sesiones este mes. ¡Vas por buen camino!
                        </p>
                    </div>
                    <div className="flex items-center gap-2 bg-green-50 text-green-600 font-semibold text-sm px-4 py-2 rounded-xl border border-green-200">
                        <ArrowUpRight size={16} />
                        <span>+15% Mejora</span>
                    </div>
                </div>

                {/* Lista de sesiones */}
                <Historial busqueda={busqueda} />
            </main>
        </div>
    );
}