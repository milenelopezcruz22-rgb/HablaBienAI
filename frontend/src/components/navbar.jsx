import React from "react";
import { MicrophoneIcon, VideoIcon, ChartLineIcon, HistoryIcon, HomeOutlineIcon } from "../icons";

function Navbar() {
    return (
        <nav className="flex w-full items-center justify-between p-5 border-b border-gray-200 shadow-lg bg-white/80 backdrop-blur-md">
            <div className="flex items-center gap-2 font-semibold ml-30">
                <MicrophoneIcon className="text-sky-400"/>
                <a className="text-xl" href="#">
                    Habla Bien IA
                </a>
            </div>
            <div className="flex gap-6 pr-30">
                <a className="flex items-center gap-2 hover:bg-sky-100 px-4 py-2 rounded-xl" href="#">
                    <HomeOutlineIcon />
                    Inicio
                </a>
                <a className="flex items-center gap-2 hover:bg-sky-100 px-4 py-2 rounded-xl" href="#">
                    <VideoIcon />
                    Grabar
                </a>
                <a className="flex items-center gap-2 hover:bg-sky-100 px-4 py-2 rounded-xl" href="#">
                    <ChartLineIcon />
                    Dashboard
                </a>
                <a className="flex items-center gap-2 hover:bg-sky-100 px-4 py-2 rounded-xl" href="#">
                    <HistoryIcon />
                    Historial
                </a>
            </div>
        </nav>
    );
}

export default Navbar;