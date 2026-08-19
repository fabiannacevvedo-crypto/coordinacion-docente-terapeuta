/**
 * RED NEC - Gestión de Salas, Asistencia, Tareas y Reportes Interdisciplinarios
 */

let todasLasSalas = [];
let todosLosJardines = [];
let todosLosAlumnos = [];
let todasLasTareas = [];
let todosLosReportes = [];
let todosLosTerapeutas = [];
let salaSeleccionadaId = null;

let chartEstadosInstancia = null;
let chartProgresoInstancia = null;

document.addEventListener("DOMContentLoaded", async () => {
  await Promise.all([
    cargarJardines(),
    cargarTerapeutas(),
    cargarSalas(),
    cargarAlumnos(),
    cargarTareas(),
    cargarReportes()
  ]);

  inicializarModales();
});

// ==========================================
// 1. CARGAR JARDINES & TERAPEUTAS
// ==========================================
async function cargarJardines() {
  try {
    const res = await fetch("/api/jardines");
    todosLosJardines = await res.json();

    const selectJardinModal = document.getElementById("salaJardinId");
    if (selectJardinModal) {
      selectJardinModal.innerHTML = todosLosJardines.map(j => `
        <option value="${j.id}">${j.nombre} (${j.cantidad_aulas} aulas)</option>
      `).join("");
    }
  } catch (e) {
    console.error("Error al cargar jardines:", e);
  }
}

async function cargarTerapeutas() {
  try {
    const res = await fetch("/api/terapeutas");
    todosLosTerapeutas = await res.json();

    const selTeraSala = document.getElementById("salaTerapeutaId");
    const selTeraTarea = document.getElementById("tareaTerapeutaId");

    const opciones = todosLosTerapeutas.map(t => `
      <option value="${t.id}">${t.nombre} (${t.matricula ? 'Mat. ' + t.matricula : 'Terapeuta'})</option>
    `).join("");

    if (selTeraSala && opciones) selTeraSala.innerHTML = opciones;
    if (selTeraTarea && opciones) selTeraTarea.innerHTML = opciones;
  } catch (e) {
    console.error("Error al cargar terapeutas:", e);
  }
}

// ==========================================
// 2. CARGAR SALAS Y RENDERIZAR BADGES CO-GESTIONADAS
// ==========================================
async function cargarSalas() {
  try {
    const res = await fetch("/api/salas");
    todasLasSalas = await res.json();

    const contenedorSalas = document.getElementById("contenedorSalas");
    const selectSalaTarea = document.getElementById("tareaSalaId");

    if (selectSalaTarea) {
      selectSalaTarea.innerHTML = '<option value="">Todas las Salas del Jardín</option>' +
        todasLasSalas.map(s => `<option value="${s.id}">${s.nombre} (${s.turno})</option>`).join("");
    }

    if (!contenedorSalas) return;

    if (todasLasSalas.length === 0) {
      contenedorSalas.innerHTML = `
        <div class="col-12 text-muted small">No hay salas creadas aún. Crea la primera con el botón amarillo superior.</div>
      `;
      return;
    }

    if (!salaSeleccionadaId && todasLasSalas.length > 0) {
      salaSeleccionadaId = todasLasSalas[0].id;
    }

    contenedorSalas.innerHTML = todasLasSalas.map(s => {
      const esActiva = s.id === salaSeleccionadaId;
      const countAlumnos = s.Alumnos ? s.Alumnos.length : 0;
      const nombreDocente = s.DocenteTitular?.nombre || "Lic. María López (Docente)";
      const nombreTerapeuta = s.TerapeutaAsignado?.nombre || "Lic. Juan Pérez (Terapeuta)";

      return `
        <div class="col-md-4 col-sm-6">
          <div class="sala-badge-card ${esActiva ? 'active' : ''}" onclick="seleccionarSala(${s.id})" style="border-left: 6px solid ${s.color || '#0284c7'};">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <h6 class="fw-bold text-dark mb-0">${s.nombre}</h6>
              <span class="badge bg-light text-dark border small text-capitalize">${s.turno}</span>
            </div>
            <div class="text-muted small mb-2">
              <i class="bi bi-people me-1"></i> ${countAlumnos} alumnos • ${s.edad_grupo}
            </div>
            
            <div class="p-2 bg-light rounded-3 small">
              <div class="text-dark fw-semibold" style="font-size: 0.75rem;">
                <i class="bi bi-person-badge text-primary me-1"></i> Docente: ${nombreDocente}
              </div>
              <div class="text-dark fw-semibold" style="font-size: 0.75rem;">
                <i class="bi bi-heart-pulse-fill text-danger me-1"></i> Terapeuta: ${nombreTerapeuta}
              </div>
            </div>
          </div>
        </div>
      `;
    }).join("");

    await cargarAsistenciasDeSala(salaSeleccionadaId);
  } catch (e) {
    console.error("Error al cargar salas:", e);
  }
}

window.seleccionarSala = function(salaId) {
  salaSeleccionadaId = salaId;
  cargarSalas();
};

// ==========================================
// 3. ASISTENCIA DE LA SALA SELECCIONADA
// ==========================================
async function cargarAsistenciasDeSala(salaId) {
  const fechaHoy = new Date().toISOString().split("T")[0];
  const salaActual = todasLasSalas.find(s => s.id === salaId);

  const tituloEl = document.getElementById("tituloSalaAsistencia");
  const subtituloEl = document.getElementById("subtituloFechaAsistencia");
  const tbody = document.getElementById("tablaAsistenciasBody");

  if (salaActual && tituloEl) {
    tituloEl.innerHTML = `<i class="bi bi-calendar-check text-success me-2"></i> Asistencia: ${salaActual.nombre} (${salaActual.Jardin?.nombre || "Jardín"})`;
    subtituloEl.textContent = `Fecha de registro: ${fechaHoy}`;
  }

  try {
    const resAsist = await fetch(`/api/asistencias/fecha?fecha=${fechaHoy}&sala_id=${salaId}`);
    const asistencias = await resAsist.json();

    const mapa = {};
    asistencias.forEach(a => {
      mapa[a.alumno_id] = { estado: a.estado, observacion: a.observacion };
    });

    const alumnosSala = todosLosAlumnos.filter(a => !a.sala_id || a.sala_id === salaId);

    let countPres = 0;
    let countAus = 0;
    let countTar = 0;

    tbody.innerHTML = alumnosSala.map(alumno => {
      const asist = mapa[alumno.id] || { estado: "presente", observacion: "" };

      if (asist.estado === "presente") countPres++;
      if (asist.estado === "ausente") countAus++;
      if (asist.estado === "tarde") countTar++;

      return `
        <tr>
          <td>
            <div class="fw-bold text-dark">${alumno.nombre} ${alumno.apellido}</div>
            <small class="text-muted">${alumno.grado || "Sala"}</small>
          </td>
          <td>
            <span class="badge bg-light text-secondary border small">${alumno.diagnostico || "Interdisciplinario"}</span>
          </td>
          <td>
            <div class="btn-group btn-group-sm" role="group">
              <button type="button" class="btn ${asist.estado === 'presente' ? 'btn-success' : 'btn-outline-success'}" onclick="marcarAsistencia(${alumno.id}, 'presente')">
                <i class="bi bi-check-circle me-1"></i> Presente
              </button>
              <button type="button" class="btn ${asist.estado === 'tarde' ? 'btn-warning text-dark' : 'btn-outline-warning text-dark'}" onclick="marcarAsistencia(${alumno.id}, 'tarde')">
                <i class="bi bi-clock me-1"></i> Tarde
              </button>
              <button type="button" class="btn ${asist.estado === 'ausente' ? 'btn-danger' : 'btn-outline-danger'}" onclick="marcarAsistencia(${alumno.id}, 'ausente')">
                <i class="bi bi-x-circle me-1"></i> Ausente
              </button>
            </div>
          </td>
          <td>
            <input type="text" class="form-control form-control-sm" placeholder="Añadir nota de observación..." value="${asist.observacion || ''}" onblur="guardarObservacionAsistencia(${alumno.id}, this.value, '${asist.estado}')">
          </td>
        </tr>
      `;
    }).join("");

    document.getElementById("countPresentes").textContent = countPres;
    document.getElementById("countAusentes").textContent = countAus;
    document.getElementById("countTardes").textContent = countTar;

  } catch (e) {
    console.error("Error al cargar asistencias:", e);
  }
}

window.marcarAsistencia = async function(alumnoId, estado) {
  const fechaHoy = new Date().toISOString().split("T")[0];
  try {
    await fetch("/api/asistencias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        alumno_id: alumnoId,
        sala_id: salaSeleccionadaId,
        estado,
        fecha: fechaHoy
      })
    });
    await cargarAsistenciasDeSala(salaSeleccionadaId);
  } catch (e) {
    console.error("Error guardando asistencia:", e);
  }
};

window.guardarObservacionAsistencia = async function(alumnoId, observacion, estado) {
  const fechaHoy = new Date().toISOString().split("T")[0];
  try {
    await fetch("/api/asistencias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        alumno_id: alumnoId,
        sala_id: salaSeleccionadaId,
        estado,
        observacion,
        fecha: fechaHoy
      })
    });
  } catch (e) {}
};

// ==========================================
// 4. CARGAR TAREAS INTERDISCIPLINARIAS
// ==========================================
async function cargarTareas() {
  try {
    const res = await fetch("/api/tareas");
    todasLasTareas = await res.json();

    const contenedor = document.getElementById("contenedorTareas");
    if (!contenedor) return;

    if (todasLasTareas.length === 0) {
      contenedor.innerHTML = `
        <div class="col-12 text-muted text-center py-4">No hay tareas asignadas aún. Asigna una con el botón de Nueva Tarea.</div>
      `;
      return;
    }

    contenedor.innerHTML = todasLasTareas.map(t => {
      const completada = t.completada;
      const esInterdisciplinar = t.es_interdisciplinaria || t.tipo === "interdisciplinaria";

      return `
        <div class="col-md-6 col-lg-4">
          <div class="card h-100 border rounded-4 p-3 shadow-sm ${completada ? 'bg-light opacity-75' : 'bg-white'}" style="${esInterdisciplinar ? 'border-top: 4px solid #7c3aed !important;' : ''}">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <span class="badge bg-primary-subtle text-primary border border-primary small">
                <i class="bi bi-book me-1"></i>${t.materia || "Materia"}
              </span>
              <span class="badge bg-dark-subtle text-dark border small">
                <i class="bi bi-stopwatch me-1"></i>${t.duracion_minutos || 30} min
              </span>
            </div>

            ${esInterdisciplinar ? `
              <div class="mb-2">
                <span class="badge rounded-pill text-white p-2 small" style="background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); font-size: 0.72rem;">
                  <i class="bi bi-link-45deg me-1"></i> Coordinada Docente + Terapeuta
                </span>
              </div>
            ` : ''}

            <h6 class="fw-bold text-dark ${completada ? 'text-decoration-line-through' : ''}">${t.titulo}</h6>
            <p class="text-secondary small mb-2">${t.descripcion || "Sin descripción adicional."}</p>

            ${t.objetivo_terapeutico ? `
              <div class="p-2 bg-purple-subtle rounded-3 mb-3 border border-purple" style="background-color: #f5f3ff; border-color: #ddd6fe !important;">
                <div class="fw-bold text-purple small mb-1" style="color: #6d28d9;">
                  <i class="bi bi-heart-pulse-fill me-1"></i> Pautas Terapéuticas:
                </div>
                <div class="text-muted" style="font-size: 0.78rem;">
                  ${t.objetivo_terapeutico}
                </div>
              </div>
            ` : ''}

            <div class="pt-2 border-top d-flex justify-content-between align-items-center mt-auto">
              <button class="btn btn-sm ${completada ? 'btn-success' : 'btn-outline-secondary'}" onclick="alternarTarea(${t.id})">
                <i class="bi ${completada ? 'bi-check-circle-fill' : 'bi-circle'} me-1"></i> ${completada ? 'Completada' : 'Marcar Hecha'}
              </button>
              <button class="btn btn-sm btn-outline-danger border-0" onclick="eliminarTarea(${t.id})">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");
  } catch (e) {
    console.error("Error al cargar tareas:", e);
  }
}

window.alternarTarea = async function(id) {
  try {
    await fetch(`/api/tareas/${id}/toggle`, { method: "PATCH" });
    await cargarTareas();
  } catch (e) {}
};

window.eliminarTarea = async function(id) {
  if (!confirm("¿Eliminar tarea?")) return;
  try {
    await fetch(`/api/tareas/${id}`, { method: "DELETE" });
    await cargarTareas();
  } catch (e) {}
};

// ==========================================
// 5. CARGAR ALUMNOS Y REPORTES
// ==========================================
async function cargarAlumnos() {
  try {
    const res = await fetch("/api/alumnos");
    todosLosAlumnos = await res.json();

    const selectModalReporte = document.getElementById("nuevoAlumnoId");
    const selectModalTarea = document.getElementById("tareaAlumnoId");

    if (selectModalReporte) {
      selectModalReporte.innerHTML = '<option value="">Seleccione alumno...</option>' +
        todosLosAlumnos.map(a => `<option value="${a.id}">${a.nombre} ${a.apellido} (${a.grado || "Sala"})</option>`).join("");
    }

    if (selectModalTarea) {
      selectModalTarea.innerHTML = '<option value="">Toda la Sala</option>' +
        todosLosAlumnos.map(a => `<option value="${a.id}">${a.nombre} ${a.apellido}</option>`).join("");
    }
  } catch (e) {}
}

async function cargarReportes() {
  try {
    const [resRep, resStats] = await Promise.all([
      fetch("/api/reportes/listar"),
      fetch("/api/reportes/estadisticas")
    ]);
    todosLosReportes = await resRep.json();
    const stats = await resStats.json();

    document.getElementById("stat-total-alumnos").textContent = stats.totalAlumnos || 0;
    document.getElementById("stat-total-reportes").textContent = stats.totalReportes || 0;
    document.getElementById("stat-buen-progreso").textContent = stats.estados?.bueno || 0;
    document.getElementById("stat-requieren-atencion").textContent = stats.estados?.atencion || 0;

    renderizarGraficos(todosLosReportes, stats);
    renderizarReportes(todosLosReportes);
  } catch (e) {}
}

function renderizarGraficos(reportes, stats) {
  const ctxE = document.getElementById("graficoEstados");
  if (ctxE) {
    if (chartEstadosInstancia) chartEstadosInstancia.destroy();
    chartEstadosInstancia = new Chart(ctxE, {
      type: "doughnut",
      data: {
        labels: ["Bueno", "Regular", "En Atención"],
        datasets: [{
          data: [stats.estados?.bueno || 0, stats.estados?.regular || 0, stats.estados?.atencion || 0],
          backgroundColor: ["#22c55e", "#eab308", "#ef4444"]
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  const ctxP = document.getElementById("graficoProgreso");
  if (ctxP) {
    if (chartProgresoInstancia) chartProgresoInstancia.destroy();
    const ultimos = [...reportes].reverse().slice(-8);
    chartProgresoInstancia = new Chart(ctxP, {
      type: "line",
      data: {
        labels: ultimos.map(r => r.alumno_nombre ? r.alumno_nombre.split(" ")[0] : `A${r.alumno_id}`),
        datasets: [{
          label: "Progreso (%)",
          data: ultimos.map(r => r.progreso),
          borderColor: "#0284c7",
          backgroundColor: "rgba(2, 132, 199, 0.12)",
          fill: true,
          tension: 0.3
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { min: 0, max: 100 } } }
    });
  }
}

function renderizarReportes(reportes) {
  const cont = document.getElementById("contenedorReportes");
  if (!cont) return;

  cont.innerHTML = reportes.map(r => `
    <div class="col-md-6 col-lg-4">
      <div class="reporte-card p-3">
        <div>
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h6 class="fw-bold mb-0 text-dark">${r.alumno_nombre || "Alumno"}</h6>
            <span class="badge ${r.estado === 'bueno' ? 'badge-estado-bueno' : (r.estado === 'atencion' ? 'badge-estado-atencion' : 'badge-estado-regular')} rounded-pill">${r.estado}</span>
          </div>
          <span class="badge bg-light text-primary border small mb-2">${r.area || "Seguimiento"}</span>
          <p class="text-secondary small mb-3">${r.observaciones || "Sin observaciones."}</p>
        </div>
        <div class="pt-2 border-top">
          <div class="d-flex justify-content-between small text-muted mb-1">
            <span>${r.autor_nombre || "Profesional"}</span>
            <b>${r.progreso}%</b>
          </div>
          <div class="progress" style="height: 6px;">
            <div class="progress-bar ${r.progreso >= 70 ? 'bg-success' : (r.progreso >= 50 ? 'bg-warning' : 'bg-danger')}" style="width: ${r.progreso}%;"></div>
          </div>
        </div>
      </div>
    </div>
  `).join("");
}

// ==========================================
// 6. INICIALIZACIÓN DE FORMULARIOS MODAL
// ==========================================
function inicializarModales() {
  // Crear Sala Co-Gestionada
  const formSala = document.getElementById("formNuevaSala");
  if (formSala) {
    formSala.addEventListener("submit", async (e) => {
      e.preventDefault();
      const body = {
        jardin_id: document.getElementById("salaJardinId").value,
        nombre: document.getElementById("salaNombre").value,
        terapeuta_asignado_id: document.getElementById("salaTerapeutaId").value,
        edad_grupo: document.getElementById("salaEdad").value,
        turno: document.getElementById("salaTurno").value,
        capacidad: document.getElementById("salaCapacidad").value,
        color: document.getElementById("salaColor").value
      };

      const res = await fetch("/api/salas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        bootstrap.Modal.getInstance(document.getElementById("modalNuevaSala")).hide();
        formSala.reset();
        await cargarSalas();
      } else {
        alert("Error al crear sala.");
      }
    });
  }

  // Crear Tarea con Coordinación Terapéutica
  const formTarea = document.getElementById("formNuevaTarea");
  if (formTarea) {
    formTarea.addEventListener("submit", async (e) => {
      e.preventDefault();
      const esInter = document.getElementById("tareaEsInterdisciplinaria").checked;

      const body = {
        titulo: document.getElementById("tareaTitulo").value,
        materia: document.getElementById("tareaMateria").value,
        duracion_minutos: document.getElementById("tareaDuracion").value,
        sala_id: document.getElementById("tareaSalaId").value || null,
        alumno_id: document.getElementById("tareaAlumnoId").value || null,
        descripcion: document.getElementById("tareaDescripcion").value,
        es_interdisciplinaria: esInter,
        terapeuta_id: esInter ? document.getElementById("tareaTerapeutaId").value : null,
        objetivo_terapeutico: esInter ? document.getElementById("tareaObjetivoTerapeutico").value : null
      };

      const res = await fetch("/api/tareas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        bootstrap.Modal.getInstance(document.getElementById("modalNuevaTarea")).hide();
        formTarea.reset();
        await cargarTareas();
      } else {
        alert("Error al crear tarea.");
      }
    });
  }

  // Crear Reporte
  const formReporte = document.getElementById("formNuevoReporte");
  if (formReporte) {
    formReporte.addEventListener("submit", async (e) => {
      e.preventDefault();
      const body = {
        alumno_id: document.getElementById("nuevoAlumnoId").value,
        area: document.getElementById("nuevoArea").value,
        progreso: document.getElementById("nuevoProgreso").value,
        estado: document.getElementById("nuevoEstado").value,
        observaciones: document.getElementById("nuevoObservaciones").value
      };

      const res = await fetch("/api/reportes/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        bootstrap.Modal.getInstance(document.getElementById("modalNuevoReporte")).hide();
        formReporte.reset();
        await cargarReportes();
      } else {
        alert("Error al crear reporte.");
      }
    });
  }
}
