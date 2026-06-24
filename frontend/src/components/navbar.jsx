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

                {/* Separador y botones de auth */}
                <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-200">
                    <NavLink
                        to="/login"
                        className={({ isActive }) =>
                            `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                            ${isActive ? 'bg-sky-100 text-sky-700 font-semibold' : 'text-gray-600 hover:bg-sky-50 hover:text-sky-600'}`
                        }
                    >
                        Iniciar Sesión
                    </NavLink>
                    <NavLink
                        to="/register"
                        className={({ isActive }) =>
                            `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                            ${isActive
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg'
                            }`
                        }
                    >
                        Registrarse
                    </NavLink>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
