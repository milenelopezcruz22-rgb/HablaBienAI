import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PlayIcon } from "../icons";
import { Mic, Eye, Activity, FileText, Star } from "lucide-react";
import Cards from "../components/cards";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

function Inicio() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [ultimasSesiones, setUltimasSesiones] = useState([]);

    useEffect(() => {
        if (user) {
            api.sesiones.list().then(({ sesiones }) => {
                setUltimasSesiones(sesiones.slice(0, 3));
            }).catch(() => {});
        }
    }, [user]);

    if (user) {
        return (
            <div className="w-full min-h-screen flex flex-col items-center px-4 sm:px-6 lg:px-12 pt-24 sm:pt-28 lg:pt-32">
                <div className="w-full max-w-7xl">
                    <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 lg:gap-16 mb-16">
                        <div className="flex-1 text-center lg:text-left">
                            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-sky-100 text-sky-700 mb-4">
                                Panel de Control
                            </span>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                                Bienvenido de nuevo,{" "}
                                <span className="bg-gradient-to-r from-sky-400 to-blue-500 text-transparent bg-clip-text">
                                    {user.nombre || "Usuario"}
                                </span>
                            </h1>
                            <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
                                Revisa tu progreso, graba una nueva presentacion o explora tu historial de sesiones.
                            </p>
                            <div className="flex flex-wrap gap-3 mt-6 justify-center lg:justify-start">
                                <button onClick={() => navigate("/camera")}
                                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-sky-400 to-blue-500 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg hover:from-sky-500 hover:to-blue-600 transition-all duration-200 font-semibold">
                                    <PlayIcon size={20} />
                                    Nueva Grabacion
                                </button>
                                <button onClick={() => navigate("/historial")}
                                    className="flex items-center justify-center px-6 py-3 rounded-xl border-2 border-sky-300 text-sky-600 font-semibold hover:bg-sky-50 hover:border-sky-400 transition-all duration-200">
                                    Ver Historial
                                </button>
                            </div>
                        </div>

                        <div className="flex-shrink-0 w-full max-w-sm">
                            <div className="bg-white rounded-2xl shadow-lg border border-sky-100 p-6">
                                <h3 className="font-semibold text-gray-800 mb-4">Tus ultimas sesiones</h3>
                                {ultimasSesiones.length === 0 ? (
                                    <p className="text-sm text-gray-400 text-center py-6">
                                        Aun no tienes sesiones. ¡Graba tu primera presentacion!
                                    </p>
                                ) : (
                                    <ul className="flex flex-col gap-3">
                                        {ultimasSesiones.map((s) => (
                                            <li key={s.id}
                                                onClick={() => navigate(`/dashboard/${s.id}`)}
                                                className="flex items-center justify-between p-3 rounded-xl bg-sky-50 hover:bg-sky-100 cursor-pointer transition-colors">
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-gray-800 truncate">{s.titulo}</p>
                                                    <p className="text-xs text-gray-400">
                                                        {new Date(s.fecha).toLocaleDateString("es-MX")}
                                                    </p>
                                                </div>
                                                <span className="text-lg font-bold text-sky-600 ml-3">{s.puntaje_general}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {ultimasSesiones.length > 0 && (
                                    <button onClick={() => navigate("/historial")}
                                        className="w-full mt-4 text-sm text-sky-600 font-medium hover:text-sky-800 transition-colors">
                                        Ver todas las sesiones →
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mb-16">
                        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
                            <span className="bg-gradient-to-r from-sky-400 to-blue-500 text-transparent bg-clip-text">
                                Como funciona
                            </span>
                        </h2>
                        <Cards />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen flex flex-col items-center px-4 sm:px-6 lg:px-12 pt-24 sm:pt-28 lg:pt-32">
            <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center lg:items-start justify-between gap-10 lg:gap-20">
                <motion.div 
                    className="flex-1 text-center lg:text-left"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.span 
                        className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-sky-100 text-sky-700 mb-5"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                    >
                        Plataforma de oratoria con IA
                    </motion.span>
                    <motion.h1 
                        className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Mejora tu{" "}
                        <span className="bg-gradient-to-r from-sky-400 to-blue-500 text-transparent bg-clip-text">
                            Oratoria
                        </span>{" "}
                        con <br /> Inteligencia Artificial
                    </motion.h1>
                    <motion.p 
                        className="text-base sm:text-lg lg:text-xl text-gray-600 mt-6 max-w-2xl mx-auto lg:mx-0"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        Habla Bien IA analiza tus presentaciones en video y te proporciona
                        retroalimentacion detallada para convertirte en un comunicador
                        mas efectivo.
                    </motion.p>

                    <motion.div 
                        className="flex flex-wrap gap-3 mt-8 justify-center lg:justify-start"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <Link to={"/register"}
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-sky-400 to-blue-500 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg hover:from-sky-500 hover:to-blue-600 transition-all duration-200 font-semibold">
                            <PlayIcon size={20} />
                            Comenzar Gratis
                        </Link>
                        <Link to="/login"
                            className="flex items-center justify-center px-6 py-3 rounded-xl border-2 border-sky-300 text-sky-600 font-semibold hover:bg-sky-50 hover:border-sky-400 transition-all duration-200">
                            Iniciar Sesion
                        </Link>
                    </motion.div>
                    <motion.p 
                        className="text-sm text-gray-400 mt-3 text-center lg:text-left"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        Sin compromiso. Crea tu cuenta gratis en segundos.
                    </motion.p>
                </motion.div>

                <motion.div 
                    className="flex-shrink-0 relative"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full bg-gradient-to-br from-sky-200/60 to-blue-300/60 blur-3xl absolute -z-10 -top-10 -right-10" />
                    <motion.div 
                        className="relative bg-white rounded-2xl shadow-lg border border-sky-100 p-6 sm:p-7 max-w-xs sm:max-w-sm"
                        whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.12)" }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div 
                            className="flex items-center gap-3 mb-4"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <motion.div 
                                className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white font-bold text-base shadow-sm"
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                IA
                            </motion.div>
                            <div>
                                <p className="font-semibold text-gray-800">Analisis en vivo</p>
                                <p className="text-sm text-gray-400">Procesando tu sesion</p>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="flex items-center gap-2 mb-4 text-sm text-gray-600"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                        >
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            <span>Procesando en tiempo real</span>
                        </motion.div>

                        <div className="space-y-3 mb-4">
                            <motion.div 
                                className="flex items-center gap-3 text-sm"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                            >
                                <span className="w-7 h-7 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600">
                                    <Mic size={14} />
                                </span>
                                <span className="text-gray-600">Claridad y tono de voz</span>
                            </motion.div>
                            <motion.div 
                                className="flex items-center gap-3 text-sm"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.55 }}
                            >
                                <span className="w-7 h-7 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600">
                                    <Eye size={14} />
                                </span>
                                <span className="text-gray-600">Contacto visual y postura</span>
                            </motion.div>
                            <motion.div 
                                className="flex items-center gap-3 text-sm"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                            >
                                <span className="w-7 h-7 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600">
                                    <Activity size={14} />
                                </span>
                                <span className="text-gray-600">Ritmo y fluidez verbal</span>
                            </motion.div>
                            <motion.div 
                                className="flex items-center gap-3 text-sm"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.65 }}
                            >
                                <span className="w-7 h-7 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600">
                                    <FileText size={14} />
                                </span>
                                <span className="text-gray-600">Reporte detallado con IA</span>
                            </motion.div>
                        </div>

                        <motion.div 
                            className="mt-4 pt-4 border-t border-sky-50 grid grid-cols-2 gap-6 text-sm"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.7 }}
                        >
                            <div>
                                <p className="text-sky-500 font-bold text-lg">12</p>
                                <p className="text-xs text-gray-400">sesiones hoy</p>
                            </div>
                            <div>
                                <p className="text-sky-500 font-bold text-lg flex items-center gap-1"><Star size={16} fill="currentColor" /> 4.8</p>
                                <p className="text-xs text-gray-400">calificacion</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>

            <motion.div 
                className="w-full max-w-7xl mt-20 sm:mt-28 lg:mt-36 mb-16"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
            >
                <motion.h2 
                    className="text-2xl sm:text-3xl font-bold text-center mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="bg-gradient-to-r from-sky-400 to-blue-500 text-transparent bg-clip-text">
                        Como funciona
                    </span>
                </motion.h2>
                <Cards />
            </motion.div>
        </div>
    );
}

export default Inicio;
