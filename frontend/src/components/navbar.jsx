import { useState } from 'react';
import { MicrophoneIcon, VideoIcon, ChartLineIcon, HistoryIcon, HomeOutlineIcon } from "../icons";
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuth } from "../context/AuthContext";

const navItems = [
    { to: "/", label: "Inicio", Icon: HomeOutlineIcon },
    { to: "/camera", label: "Grabar", Icon: VideoIcon },
    { to: "/dashboard", label: "Dashboard", Icon: ChartLineIcon },
    { to: "/historial", label: "Historial", Icon: HistoryIcon },
];

const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-xl ${isActive ? 'bg-sky-100 font-semibold' : 'hover:bg-sky-100'}`;

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        setMenuOpen(false);
        logout();
        navigate("/login");
    };

    return (
        <nav className="relative border-b border-gray-200 shadow-lg bg-white/80 backdrop-blur-md">
            <div className="flex w-full items-center justify-between px-6 lg:px-8 py-4">
                {/* Logo */}
                <div className="flex items-center gap-2 font-semibold">
                    <MicrophoneIcon className="text-sky-400" />
                    <NavLink className="text-xl" to="/">Habla Bien IA</NavLink>
                </div>

                {/* Nav de escritorio */}
                <div className="hidden md:flex gap-4 items-center">
                    {navItems.map(({ to, label, Icon }) => (
                        <NavLink key={to} to={to} end={to === "/"} className={linkClass}>
                            <Icon /> {label}
                        </NavLink>
                    ))}
                    <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-200">
                        {user ? (
                            <>
                                <span className="text-sm font-medium text-gray-700">Hola, {user.nombre}</span>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-200"
                                    title="Cerrar sesión"
                                >
                                    <LogOut size={18} />
                                </button>
                            </>
                        ) : (
                            <>
                                <NavLink to="/login" className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-sky-50 hover:text-sky-600 transition-all duration-200">
                                    Iniciar Sesión
                                </NavLink>
                                <NavLink to="/register" className="px-4 py-2 rounded-xl text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg transition-all duration-200">
                                    Registrarse
                                </NavLink>
                            </>
                        )}
                    </div>
                </div>

                {/* Botón hamburguesa (móvil) */}
                <button
                    className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-all"
                    onClick={() => setMenuOpen((o) => !o)}
                    aria-label="Abrir menú"
                >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Menú móvil desplegable */}
            {menuOpen && (
                <div className="md:hidden border-t border-gray-100 px-4 py-3 flex flex-col gap-1 bg-white shadow-lg">
                    {navItems.map(({ to, label, Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === "/"}
                            onClick={() => setMenuOpen(false)}
                            className={linkClass}
                        >
                            <Icon /> {label}
                        </NavLink>
                    ))}
                    <div className="mt-2 pt-3 border-t border-gray-100">
                        {user ? (
                            <div className="flex items-center justify-between px-4">
                                <span className="text-sm font-medium text-gray-700">Hola, {user.nombre}</span>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
                                >
                                    <LogOut size={18} /> Salir
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <NavLink to="/login" onClick={() => setMenuOpen(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-sky-50 text-center">
                                    Iniciar Sesión
                                </NavLink>
                                <NavLink to="/register" onClick={() => setMenuOpen(false)} className="px-4 py-2 rounded-xl text-sm font-medium bg-blue-500 text-white text-center shadow-md">
                                    Registrarse
                                </NavLink>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
