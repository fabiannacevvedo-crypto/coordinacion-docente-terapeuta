/**
 * RED NEC - Lógica de Biblioteca de Recursos y Contenidos
 */

let todosLosRecursos = [];
let categoriaActual = "todas";

document.addEventListener("DOMContentLoaded", () => {
  cargarRecursos();
  inicializarModalNuevoRecurso();
});

// ==========================================
// 1. CARGAR RECURSOS DESDE LA API
// ==========================================
async function cargarRecursos() {
  const contenedor = document.getElementById("contenedorRecursos");
  try {
    const res = await fetch("/api/contenidos/listar");
    if (!res.ok) throw new Error("Error al consultar contenidos");
    todosLosRecursos = await res.json();
    renderizarRecursos(todosLosRecursos);
  } catch (error) {
    console.error("Error cargando contenidos:", error);
    contenedor.innerHTML = `
      <div class="col-12 text-center py-5">
        <div class="alert alert-danger d-inline-block px-4">
          <i class="bi bi-exclamation-triangle me-2"></i> Error al conectar con el servidor para cargar los recursos.
        </div>
      </div>
    `;
  }
}

// ==========================================
// 2. RENDERIZAR TARJETAS
// ==========================================
function renderizarRecursos(lista) {
  const contenedor = document.getElementById("contenedorRecursos");

  if (lista.length === 0) {
    contenedor.innerHTML = `
      <div class="col-12 text-center py-5 text-muted">
        <i class="bi bi-folder-x fs-1 d-block mb-2"></i>
        <h6 class="fw-bold">No hay materiales en esta categoría todavía</h6>
        <p class="small mb-0">Sé el primero en aportar un recurso con el botón superior.</p>
      </div>
    `;
    return;
  }

  contenedor.innerHTML = lista.map(c => {
    let iconClass = "bi-journal-bookmark";
    let badgeColor = "bg-primary";

    if (c.categoria?.includes("Terapia")) {
      iconClass = "bi-activity";
      badgeColor = "bg-info";
    } else if (c.categoria?.includes("Fonoaudiología")) {
      iconClass = "bi-chat-dots";
      badgeColor = "bg-teal";
    } else if (c.categoria?.includes("Familiar")) {
      iconClass = "bi-house-heart";
      badgeColor = "bg-success";
    }

    const enlaceBtn = c.urlRecurso
      ? `<a href="${c.urlRecurso}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-info text-white fw-semibold">
           <i class="bi bi-box-arrow-up-right me-1"></i> Abrir / Descargar
         </a>`
      : `<span class="badge bg-light text-muted border">Documento Interno</span>`;

    return `
      <div class="col-12 col-md-6 col-lg-6">
        <div class="recurso-card">
          <div>
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div class="p-2 bg-light text-info rounded-3 border">
                <i class="bi ${c.icono || iconClass} fs-4"></i>
              </div>
              <span class="badge bg-light text-info border small px-2 py-1">${c.categoria || "General"}</span>
            </div>

            <h5 class="fw-bold text-dark mb-2">${c.titulo}</h5>
            <p class="text-muted small mb-3" style="line-height: 1.6;">
              ${c.descripcion}
            </p>
          </div>

          <div class="pt-3 border-top d-flex justify-content-between align-items-center">
            <small class="text-muted" style="font-size: 0.78rem;">
              <i class="bi bi-person-circle me-1"></i>${c.autor || "Equipo RED NEC"}
            </small>
            ${enlaceBtn}
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// ==========================================
// 3. FILTRADO POR CATEGORÍA
// ==========================================
window.filtrarCategoria = function(categoria, botonEl) {
  categoriaActual = categoria;

  // Actualizar estilos de botones
  document.querySelectorAll(".category-pill").forEach(btn => btn.classList.remove("active"));
  if (botonEl) botonEl.classList.add("active");

  if (categoria === "todas") {
    renderizarRecursos(todosLosRecursos);
  } else {
    const filtrados = todosLosRecursos.filter(c => c.categoria === categoria);
    renderizarRecursos(filtrados);
  }
};

// ==========================================
// 4. NUEVO RECURSO (MODAL)
// ==========================================
function inicializarModalNuevoRecurso() {
  const form = document.getElementById("formNuevoRecurso");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const titulo = document.getElementById("recursoTitulo").value;
    const categoria = document.getElementById("recursoCategoria").value;
    const descripcion = document.getElementById("recursoDescripcion").value;
    const urlRecurso = document.getElementById("recursoUrl").value;

    const token = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const btnSubmit = document.getElementById("btnGuardarRecurso");
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span> Publicando...`;

    try {
      const res = await fetch("/api/contenidos/crear", {
        method: "POST",
        headers,
        body: JSON.stringify({ titulo, categoria, descripcion, urlRecurso })
      });

      const data = await res.json();

      if (res.ok) {
        // Cerrar modal
        const modalEl = document.getElementById("modalNuevoRecurso");
        const modalBootstrap = bootstrap.Modal.getInstance(modalEl);
        if (modalBootstrap) modalBootstrap.hide();

        form.reset();
        await cargarRecursos();
      } else {
        alert("Error: " + (data.mensaje || "No se pudo publicar el recurso."));
      }
    } catch (err) {
      alert("Error al conectar con el servidor.");
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = `<i class="bi bi-check2-circle me-1"></i> Publicar Recurso`;
    }
  });
}
