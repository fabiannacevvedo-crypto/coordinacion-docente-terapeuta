// ==========================================================================
// RED NEC - PORTAL DOCENTE (LOGICA INTERACTIVA)
// ==========================================================================

const API_ALUMNOS = "/api/alumnos";
const API_TAREAS = "/api/tareas";
const API_COMUNICACIONES = "/api/comunicaciones";

let listaAlumnosCache = [];
let listaTareasCache = [];

// ==========================================================================
// 1. CARGA INICIAL
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  cargarAlumnos();
  cargarTareas();
  cargarComunicaciones();
  configurarEventos();
});

// ==========================================================================
// 2. CONFIGURACIÓN DE EVENTOS
// ==========================================================================
function configurarEventos() {
  // Formulario de Nueva Tarea
  const formTarea = document.getElementById("formNuevaTarea");
  if (formTarea) {
    formTarea.addEventListener("submit", guardarNuevaTarea);
  }

  // Toggle Tipo de Tarea (General vs Particular)
  const radioGeneral = document.getElementById("tipoGeneral");
  const radioParticular = document.getElementById("tipoParticular");
  const contenedorSelectorAlumno = document.getElementById("contenedorSelectorAlumno");
  const selectAlumnoTarea = document.getElementById("selectAlumnoTarea");

  if (radioGeneral && radioParticular && contenedorSelectorAlumno) {
    radioGeneral.addEventListener("change", () => {
      contenedorSelectorAlumno.style.display = "none";
      if (selectAlumnoTarea) selectAlumnoTarea.required = false;
    });

    radioParticular.addEventListener("change", () => {
      contenedorSelectorAlumno.style.display = "block";
      if (selectAlumnoTarea) selectAlumnoTarea.required = true;
    });
  }

  // Formulario de Nuevo Alumno
  const formAlumno = document.getElementById("formNuevoAlumno");
  if (formAlumno) {
    formAlumno.addEventListener("submit", guardarNuevoAlumno);
  }

  // Formulario de Nuevo Mensaje / Comunicado
  const formCom = document.getElementById("formNuevaComunicacion");
  if (formCom) {
    formCom.addEventListener("submit", guardarNuevaComunicacion);
  }

  // Buscador de Alumnos en Vivo
  const inputBuscarAlumno = document.getElementById("inputBuscarAlumno");
  if (inputBuscarAlumno) {
    inputBuscarAlumno.addEventListener("input", (e) => {
      const termino = e.target.value.toLowerCase().trim();
      const filtrados = listaAlumnosCache.filter(
        (a) =>
          a.nombre.toLowerCase().includes(termino) ||
          a.apellido.toLowerCase().includes(termino) ||
          (a.sala_grado && a.sala_grado.toLowerCase().includes(termino)) ||
          (a.diagnostico && a.diagnostico.toLowerCase().includes(termino))
      );
      renderizarTarjetasAlumnos(filtrados);
    });
  }

  // Filtros de Tareas
  const filtroBotones = document.querySelectorAll("[data-filtro-tarea]");
  filtroBotones.forEach((btn) => {
    btn.addEventListener("click", () => {
      filtroBotones.forEach((b) => b.classList.remove("active", "btn-primary"));
      filtroBotones.forEach((b) => b.classList.add("btn-outline-secondary"));
      btn.classList.add("active", "btn-primary");
      btn.classList.remove("btn-outline-secondary");

      const filtro = btn.getAttribute("data-filtro-tarea");
      aplicarFiltroTareas(filtro);
    });
  });
}

// ==========================================================================
// 3. GESTIÓN DE ALUMNOS
// ==========================================================================
async function cargarAlumnos() {
  const contenedor = document.getElementById("contenedorAlumnos");
  if (!contenedor) return;

  try {
    const res = await fetch(API_ALUMNOS);
    if (!res.ok) throw new Error("Error al obtener alumnos");
    const data = await res.json();
    listaAlumnosCache = data;

    // Actualizar contadores
    const countEl = document.getElementById("statTotalAlumnos");
    if (countEl) countEl.textContent = data.length;

    renderizarTarjetasAlumnos(data);
    poblarSelectsAlumnos(data);
  } catch (error) {
    console.error("Error al cargar alumnos:", error);
    contenedor.innerHTML = `
      <div class="col-12 text-center py-5">
        <div class="alert alert-warning d-inline-block">
          <i class="bi bi-exclamation-triangle me-2"></i> No se pudieron cargar los alumnos. Revisa el servidor backend.
        </div>
      </div>
    `;
  }
}

function renderizarTarjetasAlumnos(alumnos) {
  const contenedor = document.getElementById("contenedorAlumnos");
  if (!contenedor) return;

  if (!alumnos || alumnos.length === 0) {
    contenedor.innerHTML = `
      <div class="col-12 text-center py-5">
        <p class="text-muted fs-5">No se encontraron alumnos registrados.</p>
        <button class="btn btn-gradient-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modalNuevoAlumno">
          <i class="bi bi-person-plus me-1"></i> Registrar Primer Alumno
        </button>
      </div>
    `;
    return;
  }

  contenedor.innerHTML = alumnos
    .map((a) => {
      const foto = a.foto_url || "https://images.unsplash.com/photo-1543332164-6e82f355badc?w=200&auto=format&fit=crop&q=80";
      const totalTareas = a.tareas ? a.tareas.length : 0;
      const completadas = a.tareas ? a.tareas.filter((t) => t.completada).length : 0;

      return `
      <div class="col-md-6 col-lg-4 col-xl-3 animate-fade-in-up">
        <div class="card-modern card-gradient-top h-100 d-flex flex-column p-3">
          <!-- Cabecera de Alumno -->
          <div class="d-flex align-items-center gap-3 mb-3">
            <img src="${foto}" alt="${a.nombre} ${a.apellido}" class="avatar-circle" onerror="this.src='https://images.unsplash.com/photo-1543332164-6e82f355badc?w=200&auto=format&fit=crop&q=80'" />
            <div class="overflow-hidden">
              <h5 class="fw-bold mb-0 text-truncate">${a.nombre} ${a.apellido}</h5>
              <span class="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill small">${a.sala_grado || "Sala de 4 años"}</span>
            </div>
          </div>

          <!-- Descripción y Diagnóstico -->
          <div class="bg-light p-2 rounded-3 mb-3 flex-grow-1">
            <p class="mb-1 small text-dark">
              <strong><i class="bi bi-clipboard-pulse text-info me-1"></i> Área de Enfoque:</strong><br>
              <span class="text-muted">${a.diagnostico || "Seguimiento pedagógico y psicomotriz."}</span>
            </p>
            ${
              a.observaciones_generales
                ? `<p class="mb-0 small text-secondary border-top pt-1 mt-1">
                    <i class="bi bi-chat-left-dots text-primary me-1"></i> ${a.observaciones_generales}
                   </p>`
                : ""
            }
          </div>

          <!-- Información de Tutor -->
          <div class="d-flex justify-content-between align-items-center text-muted small mb-3 border-top pt-2">
            <span><i class="bi bi-person-heart me-1"></i> ${a.tutor_nombre || "Familia"}</span>
            <span><i class="bi bi-telephone me-1"></i> ${a.tutor_contacto || "Sin tel."}</span>
          </div>

          <!-- Resumen de Tareas & Acciones -->
          <div class="d-flex justify-content-between align-items-center pt-2 border-top">
            <span class="badge bg-info-subtle text-info small">
              <i class="bi bi-journal-check me-1"></i> ${completadas}/${totalTareas} tareas
            </span>
            <button class="btn btn-outline-primary btn-sm rounded-pill" onclick="abrirModalTareaParticular(${a.id}, '${a.nombre} ${a.apellido}')">
              <i class="bi bi-plus-circle me-1"></i> Asignar Tarea
            </button>
          </div>
        </div>
      </div>
    `;
    })
    .join("");
}

function poblarSelectsAlumnos(alumnos) {
  const selectTarea = document.getElementById("selectAlumnoTarea");
  if (selectTarea) {
    selectTarea.innerHTML = `
      <option value="" selected disabled>-- Selecciona un alumno --</option>
      ${alumnos.map((a) => `<option value="${a.id}">${a.nombre} ${a.apellido} (${a.sala_grado || "Sala"})</option>`).join("")}
    `;
  }
}

// Abrir modal de tarea con alumno preseleccionado
window.abrirModalTareaParticular = function (alumnoId, alumnoNombre) {
  const radioParticular = document.getElementById("tipoParticular");
  const contenedorSelector = document.getElementById("contenedorSelectorAlumno");
  const selectTarea = document.getElementById("selectAlumnoTarea");
  const modalEl = document.getElementById("modalNuevaTarea");

  if (radioParticular) radioParticular.checked = true;
  if (contenedorSelector) contenedorSelector.style.display = "block";
  if (selectTarea) {
    selectTarea.value = alumnoId;
    selectTarea.required = true;
  }

  if (modalEl && typeof bootstrap !== "undefined") {
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }
};

// Guardar nuevo alumno
async function guardarNuevoAlumno(e) {
  e.preventDefault();
  const nombre = document.getElementById("alumnoNombre").value.trim();
  const apellido = document.getElementById("alumnoApellido").value.trim();
  const edad = parseInt(document.getElementById("alumnoEdad").value);
  const sala_grado = document.getElementById("alumnoSala").value.trim();
  const foto_url = document.getElementById("alumnoFoto").value.trim();
  const diagnostico = document.getElementById("alumnoDiagnostico").value.trim();
  const observaciones_generales = document.getElementById("alumnoObservaciones").value.trim();
  const tutor_nombre = document.getElementById("alumnoTutorNombre").value.trim();
  const tutor_contacto = document.getElementById("alumnoTutorTel").value.trim();

  const alumnoData = {
    nombre,
    apellido,
    edad,
    sala_grado,
    foto_url: foto_url || undefined,
    diagnostico,
    observaciones_generales,
    tutor_nombre,
    tutor_contacto,
  };

  try {
    const res = await fetch(API_ALUMNOS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(alumnoData),
    });

    if (res.ok) {
      alert("✅ Alumno registrado con éxito.");
      document.getElementById("formNuevoAlumno").reset();
      
      const modalEl = document.getElementById("modalNuevoAlumno");
      if (modalEl && typeof bootstrap !== "undefined") {
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
      }

      await cargarAlumnos();
    } else {
      const err = await res.json();
      alert(`❌ Error al registrar alumno: ${err.msg || "Verifica los datos"}`);
    }
  } catch (error) {
    console.error("Error guardando alumno:", error);
    alert("❌ Error al conectar con el servidor.");
  }
}

// ==========================================================================
// 4. GESTIÓN DE TAREAS ESCOLARES Y TERAPÉUTICAS
// ==========================================================================
async function cargarTareas() {
  const contenedor = document.getElementById("contenedorListaTareas");
  if (!contenedor) return;

  try {
    const res = await fetch(API_TAREAS);
    if (!res.ok) throw new Error("Error al obtener tareas");
    const tareas = await res.json();
    listaTareasCache = tareas;

    // Actualizar contadores
    const countTotal = document.getElementById("statTotalTareas");
    const countCompletas = document.getElementById("statTareasCompletadas");
    if (countTotal) countTotal.textContent = tareas.length;
    if (countCompletas) countCompletas.textContent = tareas.filter((t) => t.completada).length;

    renderizarListaTareas(tareas);
  } catch (error) {
    console.error("Error cargando tareas:", error);
    contenedor.innerHTML = `<div class="alert alert-warning">No se pudieron cargar las tareas.</div>`;
  }
}

function renderizarListaTareas(tareas) {
  const contenedor = document.getElementById("contenedorListaTareas");
  if (!contenedor) return;

  if (!tareas || tareas.length === 0) {
    contenedor.innerHTML = `
      <div class="text-center py-4 text-muted">
        <i class="bi bi-journal-x fs-1 d-block mb-2"></i>
        No hay tareas registradas en este filtro.
      </div>
    `;
    return;
  }

  contenedor.innerHTML = tareas
    .map((t) => {
      const esGeneral = !t.alumnoId;
      const alumnoInfo = t.alumno
        ? `${t.alumno.nombre} ${t.alumno.apellido} (${t.alumno.sala_grado || "Sala"})`
        : "Toda la sala / General";

      const badgeTipo = esGeneral
        ? '<span class="badge bg-purple-subtle text-primary border border-primary-subtle rounded-pill"><i class="bi bi-people-fill me-1"></i>General (Toda la Sala)</span>'
        : `<span class="badge bg-info-subtle text-info border border-info-subtle rounded-pill"><i class="bi bi-person-fill me-1"></i>Particular: ${alumnoInfo}</span>`;

      return `
      <div class="card p-3 mb-3 border-0 shadow-sm rounded-3 ${t.completada ? "bg-light opacity-75" : "bg-white"}">
        <div class="d-flex justify-content-between align-items-start gap-2">
          <div class="d-flex align-items-start gap-3">
            <button class="btn btn-sm ${t.completada ? "btn-success" : "btn-outline-secondary"} rounded-circle p-2 mt-1" 
                    title="${t.completada ? 'Marcar como pendiente' : 'Marcar como completada'}"
                    onclick="alternarCompletadaTarea(${t.id})">
              <i class="bi ${t.completada ? "bi-check-lg" : "bi-circle"}"></i>
            </button>
            <div>
              <div class="d-flex align-items-center gap-2 flex-wrap mb-1">
                <h6 class="fw-bold mb-0 ${t.completada ? "text-decoration-line-through text-muted" : "text-dark"}">${t.titulo}</h6>
                ${badgeTipo}
                <span class="badge bg-secondary-subtle text-secondary rounded-pill small">${t.area || "General"}</span>
              </div>
              <p class="text-secondary small mb-2">${t.descripcion}</p>
              <div class="d-flex gap-3 text-muted small flex-wrap">
                <span><i class="bi bi-person-badge me-1"></i> Asignó: <strong>${t.creador_nombre || "Docente"}</strong></span>
                ${t.fecha_limite ? `<span><i class="bi bi-calendar-event me-1"></i> Entrega: <strong>${t.fecha_limite}</strong></span>` : ""}
              </div>
            </div>
          </div>
          <button class="btn btn-outline-danger btn-sm border-0" title="Eliminar tarea" onclick="eliminarTarea(${t.id})">
            <i class="bi bi-trash3"></i>
          </button>
        </div>
      </div>
    `;
    })
    .join("");
}

function aplicarFiltroTareas(filtro) {
  let filtradas = [...listaTareasCache];
  if (filtro === "generales") {
    filtradas = filtradas.filter((t) => !t.alumnoId);
  } else if (filtro === "particulares") {
    filtradas = filtradas.filter((t) => t.alumnoId);
  } else if (filtro === "pendientes") {
    filtradas = filtradas.filter((t) => !t.completada);
  } else if (filtro === "completadas") {
    filtradas = filtradas.filter((t) => t.completada);
  }
  renderizarListaTareas(filtradas);
}

// Guardar nueva tarea
async function guardarNuevaTarea(e) {
  e.preventDefault();

  const esParticular = document.getElementById("tipoParticular").checked;
  const alumnoId = esParticular ? document.getElementById("selectAlumnoTarea").value : null;
  const titulo = document.getElementById("tareaTitulo").value.trim();
  const descripcion = document.getElementById("tareaDescripcion").value.trim();
  const area = document.getElementById("tareaArea").value;
  const fecha_limite = document.getElementById("tareaFechaLimite").value || null;
  const creador_nombre = document.getElementById("tareaCreador").value.trim() || "Docente";

  if (esParticular && !alumnoId) {
    alert("Por favor selecciona un alumno para la tarea particular.");
    return;
  }

  const tareaData = {
    titulo,
    descripcion,
    tipo: "docente",
    area,
    fecha_limite,
    alumnoId: alumnoId ? parseInt(alumnoId) : null,
    creador_nombre,
  };

  try {
    const res = await fetch(API_TAREAS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tareaData),
    });

    if (res.ok) {
      alert("✅ Tarea asignada exitosamente.");
      document.getElementById("formNuevaTarea").reset();

      // Reset radio selector
      document.getElementById("tipoGeneral").checked = true;
      document.getElementById("contenedorSelectorAlumno").style.display = "none";

      const modalEl = document.getElementById("modalNuevaTarea");
      if (modalEl && typeof bootstrap !== "undefined") {
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
      }

      await cargarTareas();
      await cargarAlumnos();
    } else {
      const err = await res.json();
      alert(`❌ Error al crear tarea: ${err.msg || "Verifica los datos"}`);
    }
  } catch (error) {
    console.error("Error guardando tarea:", error);
    alert("❌ Error al conectar con el servidor.");
  }
}

// Alternar completada
window.alternarCompletadaTarea = async function (id) {
  try {
    const res = await fetch(`${API_TAREAS}/${id}/toggle`, { method: "PATCH" });
    if (res.ok) {
      await cargarTareas();
      await cargarAlumnos();
    }
  } catch (error) {
    console.error("Error al actualizar tarea:", error);
  }
};

// Eliminar tarea
window.eliminarTarea = async function (id) {
  if (!confirm("¿Estás seguro de eliminar esta tarea?")) return;
  try {
    const res = await fetch(`${API_TAREAS}/${id}`, { method: "DELETE" });
    if (res.ok) {
      await cargarTareas();
      await cargarAlumnos();
    }
  } catch (error) {
    console.error("Error al eliminar tarea:", error);
  }
};

// ==========================================================================
// 5. GESTIÓN DE COMUNICACIONES / SALUDOS
// ==========================================================================
async function cargarComunicaciones() {
  const contenedor = document.getElementById("contenedorComunicaciones");
  if (!contenedor) return;

  try {
    const res = await fetch(API_COMUNICACIONES);
    if (!res.ok) throw new Error("Error al obtener comunicaciones");
    const mensajes = await res.json();

    if (!mensajes || mensajes.length === 0) {
      contenedor.innerHTML = `<p class="text-muted small text-center py-3">No hay comunicados publicados.</p>`;
      return;
    }

    contenedor.innerHTML = mensajes
      .slice(0, 5)
      .map((m) => `
      <div class="border-bottom pb-2 mb-2">
        <div class="d-flex justify-content-between align-items-center">
          <strong class="text-primary small">${m.titulo}</strong>
          <span class="badge bg-light text-muted small">${m.tipo || "Aviso"}</span>
        </div>
        <p class="text-muted small mb-1 mt-1">${m.mensaje}</p>
        <small class="text-secondary" style="font-size: 0.75rem;"><i class="bi bi-person me-1"></i>${m.remitente_nombre} (${m.remitente_rol})</small>
      </div>
    `)
      .join("");
  } catch (error) {
    console.error("Error cargando comunicaciones:", error);
  }
}

async function guardarNuevaComunicacion(e) {
  e.preventDefault();
  const titulo = document.getElementById("comTitulo").value.trim();
  const mensaje = document.getElementById("comMensaje").value.trim();
  const tipo = document.getElementById("comTipo").value;
  const remitente_nombre = document.getElementById("comRemitente").value.trim() || "Seño Docente";

  try {
    const res = await fetch(API_COMUNICACIONES, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, mensaje, tipo, remitente_nombre, remitente_rol: "docente" }),
    });

    if (res.ok) {
      alert("✅ Comunicado publicado en el mural.");
      document.getElementById("formNuevaComunicacion").reset();
      await cargarComunicaciones();
    }
  } catch (error) {
    console.error("Error al publicar:", error);
  }
}
