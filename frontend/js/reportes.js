// Consumir API de reportes
fetch("http://localhost:3001/api/reportes/listar")
  .then(res => res.json())
  .then(data => {
    // Total alumnos activos
    document.getElementById("stat-total").textContent = data.length;

    // Observaciones del mes
    document.getElementById("stat-notas").textContent = data.filter(r => r.observaciones).length;

    // Progreso sostenido
    document.getElementById("stat-buen").textContent = data.filter(r => r.estado === "bueno").length;

    // Requieren atención
    document.getElementById("stat-atencion").textContent = data.filter(r => r.estado === "atencion").length;

    // Listado de alumnos
    const lista = document.getElementById("lista-alumnos");
    lista.innerHTML = data.map(r => `
      <div class="col-12 col-md-6">
        <div class="alumno-card p-3">
          <div class="d-flex align-items-center gap-2">
            <div class="avatar-inicial">${r.alumnoId}</div>
            <div>
              <h6 class="mb-0">${r.observaciones || "Sin observaciones"}</h6>
              <small class="text-muted">Progreso: ${r.progreso}%</small>
            </div>
          </div>
        </div>
      </div>
    `).join("");
  })
  .catch(err => console.error("Error cargando reportes:", err));
