/**
 * RED NEC - Gestión unificada de sesión y barra de navegación
 */
document.addEventListener("DOMContentLoaded", () => {
  actualizarBarraNavegacion();
});

function obtenerUsuarioAutenticado() {
  try {
    const raw = localStorage.getItem("usuario");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function actualizarBarraNavegacion() {
  const token = localStorage.getItem("token");
  const usuario = obtenerUsuarioAutenticado();

  // Buscar contenedores de auth en la barra de navegación
  const navAuthContainers = document.querySelectorAll(".nav-auth-buttons, #navAuthContainer, .d-flex.gap-2");

  navAuthContainers.forEach(container => {
    // Si no es el contenedor de navegación específico, verificar si contiene botones de login
    if (!container.closest(".navbar")) return;

    if (token && usuario) {
      const rolCapitalizado = usuario.rol ? (usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1)) : "Usuario";
      container.innerHTML = `
        <div class="dropdown">
          <button class="btn btn-light dropdown-toggle text-info fw-bold shadow-sm d-flex align-items-center gap-2" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="bi bi-person-circle fs-5"></i>
            <span>${usuario.nombre || "Mi Cuenta"}</span>
            <span class="badge bg-info text-white ms-1" style="font-size: 0.75rem;">${rolCapitalizado}</span>
          </button>
          <ul class="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
            <li><h6 class="dropdown-header text-muted">${usuario.email || ""}</h6></li>
            <li><a class="dropdown-item py-2" href="/frontend/pages/seguimiento.html"><i class="bi bi-speedometer2 text-info me-2"></i>Panel de Seguimiento</a></li>
            <li><a class="dropdown-item py-2" href="/frontend/html/index.html"><i class="bi bi-person-gear text-secondary me-2"></i>Mi Perfil / Cuenta</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><button class="dropdown-item py-2 text-danger fw-semibold" id="btnCerrarSesionNav" onclick="cerrarSesionGlobal()"><i class="bi bi-box-arrow-right me-2"></i>Cerrar Sesión</button></li>
          </ul>
        </div>
      `;
    } else {
      container.innerHTML = `
        <a href="/frontend/html/index.html" class="btn btn-outline-light fw-semibold">
          <i class="bi bi-box-arrow-in-right me-1"></i> Iniciar Sesión
        </a>
        <a href="/frontend/html/index.html" class="btn btn-light text-info fw-semibold shadow-sm">
          <i class="bi bi-person-plus me-1"></i> Registrarse
        </a>
      `;
    }
  });
}

window.cerrarSesionGlobal = function() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
  window.location.href = "/frontend/html/index.html";
};
