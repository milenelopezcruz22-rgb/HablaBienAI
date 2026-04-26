import React from "react";
import { PlayIcon } from "../icons";
import Cards from "../components/cards";

function Inicio() {
    return (
        <div className="w-full min-h-screen flex flex-col justify-start pl-50 pt-24 text-left">
            <h1 className="text-7xl font-bold">
                Mejora tu{" "}
                <span className="bg-linear-to-r from-sky-400 to-blue-600 text-transparent bg-clip-text">
                    Oratoria
                </span>{" "}
                con <br /> Inteligencia Artificial
            </h1>
            <p className="pl-2 text-2xl text-gray-600 mt-9">
                Habla Bien IA analiza tus presentaciones en video y te proporciona{" "}
                <br /> retroalimentacion detallada para convertirte en un comunicador{" "}
                <br /> mas efectivo.
            </p>
            <div className="flex gap-4 mt-8">
                <button className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200">
                    <PlayIcon size={20} />
                    Comenzar Ahora
                </button>
                <button className="px-6 py-3 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-50 transition-all duration-200">
                    Ver Historial
                </button>
            </div>
            <div className="flex justify-end mr-70 -mt-70">
                <div className="text-right bg-blue-500 shadow-md rounded-full w-60 h-60 flex flex-col items-center justify-center">
                    <p className="text-white text-8xl font-bold">78</p>
                    <p className="text-white text-2xl flex flex-col items-center justify-center">Puntaje General</p>
                </div>
            </div>
            <div className="w-full mt-30 flex flex-col">
                <p className="text-3xl font-semibold mb-10 ml-170">
                    Cómo funciona
                </p>
                <div className="w-full max-w-6xl mr-40 ml-50">
                    <Cards />
                </div>
            </div>
        </div>
    );
}

export default Inicio;
