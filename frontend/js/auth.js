// Ejemplo de login
async function login(email, password) {
  const res = await fetch("http://localhost:3001/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (data.token) {
    localStorage.setItem("token", data.token);
    alert("Login exitoso");
  } else {
    alert("Error en login");
  }
}

// Ejemplo de registro
async function register(nombre, email, password) {
  const res = await fetch("http://localhost:3001/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, email, password })
  });
  const data = await res.json();
  alert(data.mensaje || "Registro completado");
}
