import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './services/supabase';
import Navbar from "./components/Navbar";
import Inicio from "./pages/Inicio";
import Dashboard from "./pages/Dashboard";
import GrabarSesion from "./pages/GrabarSesion";
import HistorialPage from "./pages/HistorialPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

function RutaProtegida({ children }) {
    const [sesion, setSesion] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSesion(data.session);
            setCargando(false);
        });
    }, []);

    if (cargando) return null;
    return sesion ? children : <Navigate to="/login" />;
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rutas sin Navbar */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Rutas con Navbar - protegidas */}
                <Route path="/*" element={
                    <RutaProtegida>
                        <>
                            <Navbar />
                            <Routes>
                                <Route path="/" element={<Inicio />} />
                                <Route path="/inicio" element={<Inicio />} />
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/camera" element={<GrabarSesion />} />
                                <Route path="/historial" element={<HistorialPage />} />
                            </Routes>
                        </>
                    </RutaProtegida>
                } />
            </Routes>
        </BrowserRouter>
    );
}