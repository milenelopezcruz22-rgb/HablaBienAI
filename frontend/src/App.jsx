import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from "./components/Navbar";
import Inicio from "./pages/Inicio";
import Dashboard from "./pages/Dashboard";
import GrabarSesion from "./pages/GrabarSesion";
import HistorialPage from "./pages/HistorialPage";
import AuthPage from "./pages/AuthPage";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return children;
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-50 to-blue-100 gap-4">
      <div className="w-10 h-10 border-4 border-sky-400 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-gray-500">Cargando...</p>
    </div>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <AuthPage />} />
      <Route path="/register" element={user ? <Navigate to="/" /> : <AuthPage />} />
      <Route path="/*" element={
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/:id" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/camera" element={<ProtectedRoute><GrabarSesion /></ProtectedRoute>} />
            <Route path="/historial" element={<ProtectedRoute><HistorialPage /></ProtectedRoute>} />
          </Routes>
        </>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
