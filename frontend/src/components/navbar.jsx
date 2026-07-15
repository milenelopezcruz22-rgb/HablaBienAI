import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MicrophoneIcon, VideoIcon, ChartLineIcon, HistoryIcon, HomeOutlineIcon } from "../icons";
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const handleLogout = async () => {
        await logout();
        navigate('/');
        setMenuOpen(false);
    };

    const linkClass = ({ isActive }) =>
        `flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${isActive ? 'bg-sky-100 font-semibold' : 'hover:bg-sky-50'}`;

    const closeMenu = () => setMenuOpen(false);

    // Componente para link con línea indicadora
    const NavLinkWithIndicator = ({ to, children, onClick, index, total }) => (
        <motion.div
            className="relative"
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
        >
            <NavLink to={to} className={linkClass} onClick={onClick}>
                {children}
            </NavLink>
            {/* Línea indicadora */}
            <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full"
                initial={{ width: 0, x: 0 }}
                animate={hoveredIndex === index ? { width: "100%", x: 0 } : { width: 0, x: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
        </motion.div>
    );

    return (
        <nav className="relative flex w-full items-center justify-between p-4 sm:px-6 lg:px-12 border-b border-gray-200 shadow-lg bg-white/80 backdrop-blur-md z-50">
            <div className="flex items-center gap-2 font-semibold">
                <MicrophoneIcon className="text-sky-400" />
                <NavLink className="text-xl" to="/" onClick={closeMenu}>
                    Habla Bien IA
                </NavLink>
            </div>

            {/* Hamburger button */}
            <button onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Menú">
                <span className={`block w-6 h-0.5 bg-sky-500 rounded transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block w-6 h-0.5 bg-sky-500 rounded transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-6 h-0.5 bg-sky-500 rounded transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-6">
                {user && (
                    <NavLinkWithIndicator to="/" index={0}>
                        <HomeOutlineIcon /> Inicio
                    </NavLinkWithIndicator>
                )}

                {user ? (
                    <>
                        <NavLinkWithIndicator to="/camera" index={1}><VideoIcon /> Grabar</NavLinkWithIndicator>
                        <NavLinkWithIndicator to="/dashboard" index={2}><ChartLineIcon /> Dashboard</NavLinkWithIndicator>
                        <NavLinkWithIndicator to="/historial" index={3}><HistoryIcon /> Historial</NavLinkWithIndicator>
                        <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
                            <span className="text-sm text-gray-500 truncate max-w-32">{user.nombre || user.email}</span>
                            <motion.button 
                                onClick={handleLogout}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-3 py-1.5 text-sm font-medium text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                                Cerrar Sesión
                            </motion.button>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-200">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            className="cursor-pointer"
                        >
                            <NavLink to="/login"
                                className="px-5 py-2 rounded-xl text-sm font-medium border border-sky-300 text-sky-600 hover:bg-sky-50 hover:border-sky-400 transition-all duration-200 cursor-pointer">
                                Iniciar Sesión
                            </NavLink>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            className="cursor-pointer"
                        >
                            <NavLink to="/register"
                                className="px-5 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-sky-400 to-blue-500 text-white hover:from-sky-500 hover:to-blue-600 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
                                Registrarse
                            </NavLink>
                        </motion.div>
                    </div>
                )}
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div 
                        className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg lg:hidden flex flex-col p-4 gap-2"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {user && (
                            <NavLinkWithIndicator to="/" onClick={closeMenu} index={0}>
                                <HomeOutlineIcon /> Inicio
                            </NavLinkWithIndicator>
                        )}

                        {user ? (
                            <>
                                <NavLinkWithIndicator to="/camera" onClick={closeMenu} index={1}><VideoIcon /> Grabar</NavLinkWithIndicator>
                                <NavLinkWithIndicator to="/dashboard" onClick={closeMenu} index={2}><ChartLineIcon /> Dashboard</NavLinkWithIndicator>
                                <NavLinkWithIndicator to="/historial" onClick={closeMenu} index={3}><HistoryIcon /> Historial</NavLinkWithIndicator>
                                <div className="border-t border-gray-200 pt-3 mt-2 flex flex-col gap-2">
                                    <span className="text-sm text-gray-500 px-4">{user.nombre || user.email}</span>
                                    <motion.button 
                                        onClick={handleLogout}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="text-left px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer">
                                        Cerrar Sesión
                                    </motion.button>
                                </div>
                            </>
                        ) : (
                            <div className="border-t border-gray-200 pt-3 mt-2 flex flex-col gap-2">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <NavLink to="/login" onClick={closeMenu}
                                        className="px-4 py-2 rounded-xl text-sm font-medium border border-sky-300 text-sky-600 hover:bg-sky-50 transition-all duration-200 text-center block">
                                        Iniciar Sesión
                                    </NavLink>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <NavLink to="/register" onClick={closeMenu}
                                        className="px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-sky-400 to-blue-500 text-white hover:from-sky-500 hover:to-blue-600 shadow-md transition-all duration-200 text-center block">
                                        Registrarse
                                    </NavLink>
                                </motion.div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

export default Navbar;
