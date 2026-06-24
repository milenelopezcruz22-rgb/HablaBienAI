import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Inicio from "./pages/Inicio";
import Dashboard from "./pages/Dashboard";
import GrabarSesion from "./pages/GrabarSesion";
import HistorialPage from "./pages/HistorialPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
    return (
        <AuthProvider>
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
                                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                                <Route path="/camera" element={<ProtectedRoute><GrabarSesion /></ProtectedRoute>} />
                                <Route path="/historial" element={<ProtectedRoute><HistorialPage /></ProtectedRoute>} />
                            </Routes>
                        </>
                    } />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
