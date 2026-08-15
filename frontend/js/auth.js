const API_URL = "http://localhost:3001/api/auth";

// Función de login reutilizable
export async function login(email, password) {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem("token", data.token);
      if (data.usuario) {
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
      }
      return { ok: true, data };
    } else {
      return { ok: false, msg: data.msg || "Credenciales incorrectas" };
    }
  } catch (err) {
    return { ok: false, msg: "Error al conectar con el servidor" };
  }
}

// Función de registro reutilizable
export async function register(nombre, email, password, rol = "familiar", matricula = null) {
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password, rol, matricula })
    });
    const data = await res.json();
    if (res.ok) {
      return { ok: true, data };
    } else {
      return { ok: false, msg: data.msg || "Error al registrar usuario" };
    }
  } catch (err) {
    return { ok: false, msg: "Error al conectar con el servidor" };
  }
}

// Función para obtener usuario autenticado actual
export function getUsuarioActual() {
  const user = localStorage.getItem("usuario");
  return user ? JSON.parse(user) : null;
}

// Función para cerrar sesión
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
}
