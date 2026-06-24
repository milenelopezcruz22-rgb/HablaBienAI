const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const TOKEN_KEY = 'token';

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
}

function authHeaders() {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

async function manejarRespuesta(response, mensajeError) {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: mensajeError }));
        throw new Error(error.detail || mensajeError);
    }
    return response.json();
}

// --- Autenticación ---
export async function registrarUsuario(datos) {
    const response = await fetch(`${API_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
    });
    return manejarRespuesta(response, 'Error al crear la cuenta');
}

export async function loginUsuario(email, password) {
    const response = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    return manejarRespuesta(response, 'Error al iniciar sesión');
}

export async function obtenerPerfil() {
    const response = await fetch(`${API_URL}/api/v1/auth/me`, {
        headers: { ...authHeaders() },
    });
    return manejarRespuesta(response, 'Sesión no válida');
}

// --- Análisis ---
export async function analizarAudio(audioBlob, metricasCorporales = {}, titulo = 'Sesión de práctica') {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'grabacion.webm');
    formData.append('metricas_corporales', JSON.stringify(metricasCorporales ?? {}));
    formData.append('titulo', titulo);

    const response = await fetch(`${API_URL}/api/v1/analizar`, {
        method: 'POST',
        headers: { ...authHeaders() },
        body: formData,
    });

    return manejarRespuesta(response, 'Error al analizar el audio');
}

// --- Historial ---
export async function obtenerHistorial() {
    const response = await fetch(`${API_URL}/api/v1/historial`, {
        headers: { ...authHeaders() },
    });
    return manejarRespuesta(response, 'Error al cargar el historial');
}

export async function obtenerSesion(id) {
    const response = await fetch(`${API_URL}/api/v1/sesion/${id}`, {
        headers: { ...authHeaders() },
    });
    return manejarRespuesta(response, 'Error al cargar la sesión');
}

export async function eliminarSesion(id) {
    const response = await fetch(`${API_URL}/api/v1/sesion/${id}`, {
        method: 'DELETE',
        headers: { ...authHeaders() },
    });
    return manejarRespuesta(response, 'Error al eliminar la sesión');
}
