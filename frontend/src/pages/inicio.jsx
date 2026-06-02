import { PlayIcon } from "../icons";
import { Link } from "react-router-dom";

function Inicio() {
    return (
        <div className="w-full min-h-screen relative px-4 pt-24 text-left">
            <div className="absolute top-24 right-8">
                <div className="bg-blue-500 shadow-md rounded-full w-48 h-48 flex flex-col items-center justify-center">
                    <p className="text-white text-7xl font-bold">78</p>
                    <p className="text-white text-xl">Puntaje General</p>
                </div>
            </div>
            <h1 className="text-4xl font-bold max-w-xl">
                Mejora tu{" "}
                <span className="bg-gradient-to-r from-sky-400 to-blue-600 text-transparent bg-clip-text">
                    Oratoria
                </span>{" "}
                con Inteligencia Artificial
            </h1>
            <p className="text-lg text-gray-600 mt-9 max-w-xl">
                Habla Bien IA analiza tus presentaciones en video y te proporciona
                retroalimentacion detallada para convertirte en un comunicador mas efectivo.
            </p>
            <div className="flex gap-4 mt-8">
                <Link to="/camera" className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-xl shadow-md hover:bg-blue-700 transition-all duration-200">
                    <PlayIcon size={20} />
                    Comenzar Ahora
                </Link>
                <Link to="/historial" className="px-6 py-3 rounded-xl border border-blue-200 text-blue-600 hover:bg-blue-50 transition-all duration-200">
                    Ver Historial
                </Link>
            </div>
        </div>
    );
}

export default Inicio;