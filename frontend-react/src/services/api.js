const API_BASE = "http://localhost:3001/api";

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { "Authorization": `Bearer ${token}` } : {};
}

export const api = {
  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  async register(data) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getPerfil() {
    const res = await fetch(`${API_BASE}/perfil`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  // Alumnos
  async getAlumnos() {
    const res = await fetch(`${API_BASE}/alumnos`);
    return res.json();
  },

  async createAlumno(alumno) {
    const res = await fetch(`${API_BASE}/alumnos`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify(alumno)
    });
    return res.json();
  },

  // Asistencias
  async getAsistencias(fecha) {
    const query = fecha ? `?fecha=${fecha}` : "";
    const res = await fetch(`${API_BASE}/asistencias/fecha${query}`);
    return res.json();
  },

  async registrarAsistencia(alumnoId, estado, observacion = "", fecha) {
    const res = await fetch(`${API_BASE}/asistencias`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify({ alumnoId, estado, observacion, fecha })
    });
    return res.json();
  },

  // Tareas
  async getTareas(tipo) {
    const query = tipo ? `?tipo=${tipo}` : "";
    const res = await fetch(`${API_BASE}/tareas${query}`);
    return res.json();
  },

  async createTarea(tarea) {
    const res = await fetch(`${API_BASE}/tareas`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify(tarea)
    });
    return res.json();
  },

  async toggleTarea(id) {
    const res = await fetch(`${API_BASE}/tareas/${id}/toggle`, {
      method: "PATCH",
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  async deleteTarea(id) {
    const res = await fetch(`${API_BASE}/tareas/${id}`, {
      method: "DELETE",
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  // Comunicaciones
  async getComunicaciones() {
    const res = await fetch(`${API_BASE}/comunicaciones`);
    return res.json();
  },

  async createComunicacion(comunicacion) {
    const res = await fetch(`${API_BASE}/comunicaciones`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify(comunicacion)
    });
    return res.json();
  },

  // Reportes
  async getReportes() {
    const res = await fetch(`${API_BASE}/reportes/listar`);
    return res.json();
  },

  async createReporte(reporte) {
    const res = await fetch(`${API_BASE}/reportes/crear`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify(reporte)
    });
    return res.json();
  }
};
