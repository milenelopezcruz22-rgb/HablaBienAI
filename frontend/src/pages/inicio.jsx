import { useState, useEffect } from "react";
import { PlayIcon } from "../icons";
import Cards from "../components/cards";
import { Link } from "react-router-dom";
import { obtenerHistorial } from "../services/api";

function Inicio() {
    const [ultimoPuntaje, setUltimoPuntaje] = useState(null);
    const [cargado, setCargado] = useState(false);

    useEffect(() => {
        obtenerHistorial()
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    setUltimoPuntaje(Math.round(data[0].score_voz || 0));
                }
            })
            .catch(() => {}) // si no hay backend/DB, dejamos el placeholder
            .finally(() => setCargado(true));
    }, []);

    return (
        <div className="min-h-screen bg-slate-50">
            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
                {/* Hero */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                            Mejora tu{" "}
                            <span className="bg-gradient-to-r from-sky-400 to-blue-600 text-transparent bg-clip-text">
                                Oratoria
                            </span>{" "}
                            con Inteligencia Artificial
                        </h1>
                        <p className="text-xl text-gray-600 mt-6 leading-relaxed">
                            Habla Bien IA analiza tus presentaciones en video y te proporciona
                            retroalimentación detallada para convertirte en un comunicador más efectivo.
                        </p>
                        <div className="flex flex-wrap gap-4 mt-8">
                            <Link
                                to="/camera"
                                className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200"
                            >
                                <PlayIcon size={20} />
                                Comenzar Ahora
                            </Link>
                            <Link
                                to="/historial"
                                className="px-6 py-3 rounded-xl border border-blue-200 text-blue-600 hover:bg-blue-50 transition-all duration-200"
                            >
                                Ver Historial
                            </Link>
                        </div>
                    </div>

                    {/* Círculo de puntaje */}
                    <div className="flex justify-center lg:justify-end">
                        <div className="bg-blue-500 shadow-lg rounded-full w-60 h-60 flex flex-col items-center justify-center">
                            <p className="text-white text-7xl font-bold">
                                {ultimoPuntaje !== null ? ultimoPuntaje : cargado ? "—" : "…"}
                            </p>
                            <p className="text-white text-xl text-center px-4">
                                {ultimoPuntaje !== null ? "Último Puntaje" : "Aún sin sesiones"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Cómo funciona */}
                <div className="mt-24">
                    <h2 className="text-3xl font-semibold text-center mb-10">
                        Cómo funciona
                    </h2>
                    <Cards />
                </div>
            </main>
        </div>
    );
}

export default Inicio;
