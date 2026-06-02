import { PlayIcon } from "../icons";
import Cards from "../components/cards";
import { Link } from "react-router-dom";

function Inicio() {
    return (
        <div className="w-full min-h-screen flex flex-col justify-start px-16 pt-24 pb-16" >
            
            {/* Hero: texto + círculo */}
            <div className="flex items-center justify-between pl-20">
                <div className="max-w-3xl">
                    <h1 className="text-7xl font-bold">
                        Mejora tu{" "}
                        <span className="bg-linear-to-r from-sky-400 to-blue-600 text-transparent bg-clip-text">
                            Oratoria
                        </span>{" "}
                        con Inteligencia Artificial
                    </h1>
                    <p className="text-2xl text-gray-600 mt-9">
                        Habla Bien IA analiza tus presentaciones en video y te proporciona
                        retroalimentacion detallada para convertirte en un comunicador
                        mas efectivo.
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

                <div className="flex-shrink-0 pr-25">
                    <div className="bg-blue-500 shadow-md rounded-full w-80 h-80 flex flex-col items-center justify-center">
                        <p className="text-white text-8xl font-bold">78</p>
                        <p className="text-white text-2xl">Puntaje General</p>
                    </div>
                </div>
            </div>

            {/* Cómo funciona */}
            <div className="w-full mt-6 flex flex-col items-center">
                <p className="text-3xl font-semibold mb-10">Cómo funciona</p>
                <div className="w-full max-w-6xl">
                    <Cards />
                </div>
            </div>

        </div>
    );
}

export default Inicio;