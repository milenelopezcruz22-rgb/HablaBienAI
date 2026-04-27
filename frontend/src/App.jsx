import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Inicio from "./pages/Inicio";
import Dashboard from "./pages/Dashboard";
import GrabarSesion from "./pages/GrabarSesion";
import HistorialPage from "./pages/HistorialPage";

export default function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/camera" element={<GrabarSesion />} />
                <Route path="/historial" element={<HistorialPage />} />
            </Routes>
        </BrowserRouter>
    );
}