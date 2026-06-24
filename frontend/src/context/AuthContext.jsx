/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import {
    loginUsuario,
    registrarUsuario,
    obtenerPerfil,
    setToken,
} from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [cargando, setCargando] = useState(true);

    // Al cargar la app, si hay token guardado, recupera el perfil.
    useEffect(() => {
        obtenerPerfil()
            .then(setUser)
            .catch(() => setToken(null))
            .finally(() => setCargando(false));
    }, []);

    const login = async (email, password) => {
        const { token, usuario } = await loginUsuario(email, password);
        setToken(token);
        setUser(usuario);
        return usuario;
    };

    const register = async (datos) => {
        const { token, usuario } = await registrarUsuario(datos);
        setToken(token);
        setUser(usuario);
        return usuario;
    };

    const logout = () => {
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, cargando, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
