import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    api.me()
      .then(({ user }) => setUser(user))
      .catch(() => sessionStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  // Sincronizar token entre pestañas
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        if (e.newValue) {
          // Token agregado en otra pestaña
          api.me()
            .then(({ user }) => setUser(user))
            .catch(() => sessionStorage.removeItem("token"));
        } else {
          // Token removido en otra pestaña
          setUser(null);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = async (email, password) => {
    const { user, token } = await api.login(email, password);
    sessionStorage.setItem("token", token);
    setUser(user);
  };

  const register = async (email, password, nombre, apellido) => {
    const { user, token } = await api.register(email, password, nombre, apellido);
    sessionStorage.setItem("token", token);
    setUser(user);
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/jsx-no-comment-textnodes
export const useAuth = () => useContext(AuthContext);
