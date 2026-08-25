// Consumir API de contenidos educativos
document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("contenidos");
  if (!contenedor) return;

  fetch("/api/contenidos/listar")
    .then((res) => {
      if (!res.ok) throw new Error("Error al obtener contenidos");
      return res.json();
    })
    .then((contenidos) => {
      if (!contenidos || contenidos.length === 0) {
        contenedor.innerHTML = '<p class="text-muted text-center py-3">No hay recursos educativos registrados aún.</p>';
        return;
      }

      contenedor.innerHTML = `
        <div class="row g-4">
          ${contenidos
            .map(
              (c) => `
            <div class="col-md-4">
              <div class="card h-100 shadow-sm border-0 p-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="badge bg-info text-white">${c.categoria || "General"}</span>
                  <small class="text-muted"><i class="bi bi-journal-bookmark"></i></small>
                </div>
                <h5 class="fw-bold text-dark mb-2">${c.titulo}</h5>
                <p class="text-muted small flex-grow-1">${c.descripcion || "Sin descripción disponible."}</p>
                ${
                  c.urlRecurso
                    ? `<a href="${c.urlRecurso}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-info btn-sm mt-auto">
                        <i class="bi bi-box-arrow-up-right me-1"></i> Abrir recurso
                      </a>`
                    : ""
                }
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      `;
    })
    .catch((err) => {
      console.error("Error cargando contenidos:", err);
      contenedor.innerHTML = '<div class="alert alert-warning text-center">No se pudieron cargar los recursos en este momento.</div>';
    });
});
