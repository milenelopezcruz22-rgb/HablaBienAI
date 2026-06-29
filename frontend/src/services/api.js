const API_URL = "http://localhost:3001/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Error del servidor");
  return data;
}

export const api = {
  login: (email, password) =>
    request("/login", { method: "POST", body: JSON.stringify({ email, password }) }),

  register: (email, password, nombre, apellido) =>
    request("/register", { method: "POST", body: JSON.stringify({ nombre, apellido, email, password }) }),

  me: () => request("/me"),

  sesiones: {
    list: () => request("/sesiones"),
    get: (id) => request(`/sesiones/${id}`),
    create: (data) => request("/sesiones", { method: "POST", body: JSON.stringify(data) }),
    delete: (id) => request(`/sesiones/${id}`, { method: "DELETE" }),
  },
};