import { MicrophoneIcon, VideoIcon, ChartLineIcon, HistoryIcon, HomeOutlineIcon } from "../icons";
import { NavLink } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="flex w-full items-center justify-between p-5 border-b border-gray-200 shadow-lg bg-white/80 backdrop-blur-md">
            <div className="flex items-center gap-2 font-semibold ml-30">
                <MicrophoneIcon className="text-sky-400"/>
                <NavLink className="text-xl" to="/">
                    Habla Bien IA
                </NavLink>
            </div>
            <div className="flex gap-6 pr-30">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `flex items-center gap-2 px-4 py-2 rounded-xl ${isActive ? 'bg-sky-100 font-semibold' : 'hover:bg-sky-100'}`
                    }
                >
                    <HomeOutlineIcon />
                    Inicio
                </NavLink>
                <NavLink
                    to="/camera"
                    className={({ isActive }) =>
                        `flex items-center gap-2 px-4 py-2 rounded-xl ${isActive ? 'bg-sky-100 font-semibold' : 'hover:bg-sky-100'}`
                    }
                >
                    <VideoIcon />
                    Grabar
                </NavLink>
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `flex items-center gap-2 px-4 py-2 rounded-xl ${isActive ? 'bg-sky-100 font-semibold' : 'hover:bg-sky-100'}`
                    }
                >
                    <ChartLineIcon />
                    Dashboard
                </NavLink>
                <NavLink
                    to="/historial"
                    className={({ isActive }) =>
                        `flex items-center gap-2 px-4 py-2 rounded-xl ${isActive ? 'bg-sky-100 font-semibold' : 'hover:bg-sky-100'}`
                    }
                >
                    <HistoryIcon />
                    Historial
                </NavLink>
            </div>
        </nav>
    );
}

export default Navbar;