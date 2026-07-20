const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
const ANALYSIS_URL = import.meta.env.VITE_ANALYSIS_URL || "http://localhost:8000/api/v1/analizar";

async function request(path, options = {}) {
  const token = sessionStorage.getItem("token");
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Error del servidor");
  }
  return data;
}

// Validar ID numérico
const isValidId = (id) => /^\d+$/.test(String(id));

export const api = {
  login: (email, password) =>
    request("/login", { method: "POST", body: JSON.stringify({ email, password }) }),

  register: (email, password, nombre, apellido) =>
    request("/register", { method: "POST", body: JSON.stringify({ nombre, apellido, email, password }) }),

  me: () => request("/me"),

  sesiones: {
    list: () => request("/sesiones"),
    get: (id) => {
      if (!isValidId(id)) throw new Error("ID de sesión inválido");
      return request(`/sesiones/${id}`);
    },
    create: (data) =>
      request("/sesiones", { method: "POST", body: JSON.stringify(data) }),
    delete: (id) => {
      if (!isValidId(id)) throw new Error("ID de sesión inválido");
      return request(`/sesiones/${id}`, { method: "DELETE" });
    },
  },
};

export async function analizarAudio(videoBlob) {
  if (!videoBlob || videoBlob.size === 0) {
    throw new Error("El archivo de audio está vacío");
  }

  const formData = new FormData();
  formData.append("audio", videoBlob, "grabacion.webm");

  try {
    const res = await fetch(ANALYSIS_URL, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.detail || `Error ${res.status} al analizar el audio`);
    }

    return res.json();
  } catch (error) {
    throw new Error(error.message || "Error de conexión con el servicio de análisis", { cause: error });
  }
}
