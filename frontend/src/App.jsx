import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Inicio from "./pages/Inicio";
import Dashboard from "./pages/Dashboard";
import GrabarSesion from "./pages/GrabarSesion";
import HistorialPage from "./pages/HistorialPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rutas sin Navbar (auth) */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Rutas con Navbar */}
                <Route path="/*" element={
                    <>
                        <Navbar />
                        <Routes>
                            <Route path="/" element={<Inicio />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/camera" element={<GrabarSesion />} />
                            <Route path="/historial" element={<HistorialPage />} />
                        </Routes>
                    </>
                } />
            </Routes>
        </BrowserRouter>
    );
}
