// ==========================================================================
// RED NEC - MÓDULO DE SEGUIMIENTO & REPORTES (EN TIEMPO REAL)
// ==========================================================================

const API_REPORTES = "/api/reportes";
const API_ALUMNOS = "/api/alumnos";

let chartEstados = null;
let chartProgreso = null;
let listaReportesCache = [];
let listaAlumnosCache = [];

// ==========================================================================
// 1. INICIALIZACIÓN
// ==========================================================================
document.addEventListener("DOMContentLoaded", async () => {
  await cargarAlumnosParaSelector();
  await cargarReportes();
  configurarEventosSeguimiento();
});

// ==========================================================================
// 2. CONFIGURACIÓN DE EVENTOS
// ==========================================================================
function configurarEventosSeguimiento() {
  // Slider de Progreso interactivo
  const sliderProgreso = document.getElementById("reporteProgreso");
  const badgeProgresoValor = document.getElementById("badgeProgresoValor");
  if (sliderProgreso && badgeProgresoValor) {
    sliderProgreso.addEventListener("input", (e) => {
      badgeProgresoValor.textContent = `${e.target.value}%`;
      actualizarColorBadgeProgreso(e.target.value);
    });
  }

  // Previsualización de Imagen del Reporte
  const inputImagenUrl = document.getElementById("reporteImagenUrl");
  const contenedorPreview = document.getElementById("previewImagenReporte");
  const imgPreview = document.getElementById("imgPreviewReporte");

  if (inputImagenUrl && contenedorPreview && imgPreview) {
    inputImagenUrl.addEventListener("input", (e) => {
      const url = e.target.value.trim();
      if (url && (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:image"))) {
        imgPreview.src = url;
        contenedorPreview.style.display = "block";
      } else {
        contenedorPreview.style.display = "none";
      }
    });
  }

  // Al seleccionar un alumno en el dropdown del generador, sugerir su foto y sala
  const selectAlumno = document.getElementById("selectAlumnoReporte");
  if (selectAlumno) {
    selectAlumno.addEventListener("change", (e) => {
      const alumnoId = parseInt(e.target.value);
      const alumno = listaAlumnosCache.find((a) => a.id === alumnoId);
      const inputIdDirecto = document.getElementById("reporteAlumnoId");
      if (inputIdDirecto && alumnoId) inputIdDirecto.value = alumnoId;

      if (alumno && alumno.foto_url && inputImagenUrl && !inputImagenUrl.value) {
        inputImagenUrl.value = alumno.foto_url;
        imgPreview.src = alumno.foto_url;
        contenedorPreview.style.display = "block";
      }
    });
  }

  // Formulario de Creación de Reporte
  const formReporte = document.getElementById("formNuevoReporte");
  if (formReporte) {
    formReporte.addEventListener("submit", guardarNuevoReporte);
  }

  // Filtros de Reportes
  const filtroBotones = document.querySelectorAll("[data-filtro-reporte]");
  filtroBotones.forEach((btn) => {
    btn.addEventListener("click", () => {
      filtroBotones.forEach((b) => b.classList.remove("active", "btn-primary"));
      filtroBotones.forEach((b) => b.classList.add("btn-outline-secondary"));
      btn.classList.add("active", "btn-primary");
      btn.classList.remove("btn-outline-secondary");

      const filtro = btn.getAttribute("data-filtro-reporte");
      filtrarReportes(filtro);
    });
  });

  // Buscador de Reportes
  const inputBuscar = document.getElementById("inputBuscarReporte");
  if (inputBuscar) {
    inputBuscar.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();
      const filtrados = listaReportesCache.filter((r) => {
        const nombre = r.alumno ? `${r.alumno.nombre} ${r.alumno.apellido}`.toLowerCase() : `alumno #${r.alumnoId}`;
        const obs = (r.observaciones || "").toLowerCase();
        const tit = (r.titulo || "").toLowerCase();
        return nombre.includes(query) || obs.includes(query) || tit.includes(query);
      });
      renderListadoReportes(filtrados);
    });
  }
}

function actualizarColorBadgeProgreso(valor) {
  const badge = document.getElementById("badgeProgresoValor");
  if (!badge) return;
  if (valor >= 75) {
    badge.className = "badge bg-success fs-6";
  } else if (valor >= 45) {
    badge.className = "badge bg-warning text-dark fs-6";
  } else {
    badge.className = "badge bg-danger fs-6";
  }
}

// ==========================================================================
// 3. CARGAR ALUMNOS PARA EL SELECTOR
// ==========================================================================
async function cargarAlumnosParaSelector() {
  try {
    const res = await fetch(API_ALUMNOS);
    if (!res.ok) return;
    const alumnos = await res.json();
    listaAlumnosCache = alumnos;

    const select = document.getElementById("selectAlumnoReporte");
    if (select) {
      select.innerHTML = `
        <option value="" disabled selected>-- Elige un alumno registrado --</option>
        ${alumnos.map((a) => `<option value="${a.id}">ID ${a.id}: ${a.nombre} ${a.apellido} (${a.sala_grado || "Sala"})</option>`).join("")}
      `;
    }
  } catch (error) {
    console.error("Error al cargar lista de alumnos para selector:", error);
  }
}

// ==========================================================================
// 4. CARGAR & RENDERIZAR REPORTES
// ==========================================================================
async function cargarReportes() {
  try {
    const res = await fetch(`${API_REPORTES}/listar`);
    if (!res.ok) throw new Error("Error al obtener reportes");
    const data = await res.json();
    listaReportesCache = data;

    actualizarMetricas(data);
    renderGraficas(data);
    renderListadoReportes(data);
  } catch (err) {
    console.error("Error al cargar reportes:", err);
  }
}

function actualizarMetricas(data) {
  const total = data ? data.length : 0;
  const buen = data ? data.filter((r) => r.estado === "bueno").length : 0;
  const regular = data ? data.filter((r) => r.estado === "regular").length : 0;
  const atencion = data ? data.filter((r) => r.estado === "atencion").length : 0;

  const promedio =
    total > 0 ? Math.round(data.reduce((acc, curr) => acc + (curr.progreso || 0), 0) / total) : 0;

  const elTotal = document.getElementById("statTotalReportes");
  const elPromedio = document.getElementById("statPromedioProgreso");
  const elBuen = document.getElementById("statBuenProgreso");
  const elAtencion = document.getElementById("statRequierenAtencion");

  if (elTotal) elTotal.textContent = total;
  if (elPromedio) elPromedio.textContent = `${promedio}%`;
  if (elBuen) elBuen.textContent = buen;
  if (elAtencion) elAtencion.textContent = atencion;
}

// ==========================================================================
// 5. GRÁFICAS PROFESIONALES (CHART.JS)
// ==========================================================================
function renderGraficas(data) {
  if (!data || data.length === 0) return;

  const estados = { bueno: 0, regular: 0, atencion: 0 };
  data.forEach((r) => {
    if (estados[r.estado] !== undefined) {
      estados[r.estado]++;
    } else {
      estados.regular++;
    }
  });

  // 1. Gráfica de Donut: Distribución de Estados
  const canvasEstados = document.getElementById("graficoEstados");
  if (canvasEstados) {
    if (chartEstados) chartEstados.destroy();

    chartEstados = new Chart(canvasEstados, {
      type: "doughnut",
      data: {
        labels: ["Progreso Favorable (Bueno)", "En Proceso (Regular)", "Requiere Atención Prioritaria"],
        datasets: [
          {
            data: [estados.bueno, estados.regular, estados.atencion],
            backgroundColor: ["#10b981", "#f59e0b", "#ef4444"],
            hoverOffset: 6,
            borderWidth: 2,
            borderColor: "#ffffff",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom", labels: { boxWidth: 14, font: { family: "'Plus Jakarta Sans', sans-serif" } } },
          tooltip: {
            callbacks: {
              label: (item) => ` ${item.label}: ${item.raw} alumnos (${Math.round((item.raw / data.length) * 100)}%)`,
            },
          },
        },
      },
    });
  }

  // 2. Gráfica de Barras/Línea: Progreso por Alumno
  const canvasProgreso = document.getElementById("graficoProgreso");
  if (canvasProgreso) {
    if (chartProgreso) chartProgreso.destroy();

    const ultimosReportes = data.slice(0, 10).reverse();

    chartProgreso = new Chart(canvasProgreso, {
      type: "bar",
      data: {
        labels: ultimosReportes.map((r) =>
          r.alumno ? `${r.alumno.nombre} ${r.alumno.apellido.charAt(0)}.` : `Alumno #${r.alumnoId || "S/N"}`
        ),
        datasets: [
          {
            label: "Porcentaje de Progreso Alcanzado",
            data: ultimosReportes.map((r) => r.progreso || 0),
            backgroundColor: ultimosReportes.map((r) =>
              r.estado === "bueno"
                ? "rgba(16, 185, 129, 0.75)"
                : r.estado === "atencion"
                ? "rgba(239, 68, 68, 0.75)"
                : "rgba(245, 158, 11, 0.75)"
            ),
            borderRadius: 8,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (item) => ` Progreso: ${item.raw}%`,
            },
          },
        },
        scales: {
          y: {
            min: 0,
            max: 100,
            ticks: { callback: (v) => `${v}%`, font: { family: "'Plus Jakarta Sans', sans-serif" } },
            grid: { color: "rgba(0, 0, 0, 0.05)" },
          },
          x: {
            grid: { display: false },
            ticks: { font: { family: "'Plus Jakarta Sans', sans-serif", weight: "600" } },
          },
        },
      },
    });
  }
}

// ==========================================================================
// 6. RENDERIZAR FEED DE REPORTES
// ==========================================================================
function renderListadoReportes(reportes) {
  const contenedor = document.getElementById("contenedorReportesFeed");
  if (!contenedor) return;

  if (!reportes || reportes.length === 0) {
    contenedor.innerHTML = `
      <div class="col-12 text-center py-5 bg-white rounded-4 shadow-sm">
        <i class="bi bi-folder2-open display-4 text-muted d-block mb-3"></i>
        <h5 class="text-secondary fw-bold">No hay reportes que coincidan con la búsqueda</h5>
        <p class="text-muted small">Crea un nuevo reporte usando el formulario superior.</p>
      </div>
    `;
    return;
  }

  contenedor.innerHTML = reportes
    .map((r) => {
      const alumno = r.alumno;
      const nombreAlumno = alumno ? `${alumno.nombre} ${alumno.apellido}` : `Alumno #${r.alumnoId || "General"}`;
      const salaAlumno = alumno ? alumno.sala_grado || "Sala de Nivel Inicial" : "Nivel Inicial";
      const fotoAlumno =
        alumno && alumno.foto_url
          ? alumno.foto_url
          : r.imagen_url || "https://images.unsplash.com/photo-1543332164-6e82f355badc?w=150&auto=format&fit=crop&q=80";

      const badgeClass =
        r.estado === "bueno" ? "badge-bueno" : r.estado === "atencion" ? "badge-atencion" : "badge-regular";
      const iconEstado =
        r.estado === "bueno"
          ? "bi-check-circle-fill"
          : r.estado === "atencion"
          ? "bi-exclamation-triangle-fill"
          : "bi-arrow-repeat";

      const fecha = r.createdAt ? new Date(r.createdAt).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" }) : "Hoy";

      return `
      <div class="col-md-6 col-xl-4 animate-fade-in-up">
        <div class="card-modern card-gradient-teal h-100 d-flex flex-column p-3">
          
          <!-- Encabezado de Reporte -->
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div class="d-flex align-items-center gap-2">
              <img src="${fotoAlumno}" class="avatar-circle" alt="${nombreAlumno}" onerror="this.src='https://images.unsplash.com/photo-1543332164-6e82f355badc?w=150&auto=format&fit=crop&q=80'" />
              <div>
                <h6 class="fw-bold mb-0 text-dark">${nombreAlumno}</h6>
                <small class="text-muted">${salaAlumno}</small>
              </div>
            </div>
            <span class="badge-pill-modern ${badgeClass}">
              <i class="bi ${iconEstado}"></i> ${r.estado ? r.estado.toUpperCase() : "REGULAR"}
            </span>
          </div>

          <!-- Imagen Adjunta de Evidencia (si existe) -->
          ${
            r.imagen_url && r.imagen_url !== alumno?.foto_url
              ? `<div class="mb-3 overflow-hidden rounded-3" style="max-height: 140px;">
                  <img src="${r.imagen_url}" class="w-100 object-fit-cover" alt="Evidencia de reporte" style="max-height: 140px;" onerror="this.style.display='none'" />
                 </div>`
              : ""
          }

          <!-- Título y Observaciones -->
          <div class="bg-light p-3 rounded-3 mb-3 flex-grow-1">
            <h6 class="fw-bold text-primary mb-1 small">${r.titulo || "Evolución Pedagógica & Terapéutica"}</h6>
            <p class="text-secondary small mb-0">${r.observaciones || "Sin observaciones descriptas."}</p>
          </div>

          <!-- Barra de Progreso -->
          <div class="mb-3">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <small class="text-muted fw-bold">Nivel de Logro / Progreso</small>
              <strong class="text-info">${r.progreso || 0}%</strong>
            </div>
            <div class="progress" style="height: 10px; border-radius: var(--radius-pill); background-color: #e2e8f0;">
              <div class="progress-bar ${r.estado === "bueno" ? "bg-success" : r.estado === "atencion" ? "bg-danger" : "bg-warning"}" 
                   role="progressbar" style="width: ${r.progreso || 0}%;" aria-valuenow="${r.progreso || 0}" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
          </div>

          <!-- Pie del Reporte & Acciones -->
          <div class="d-flex justify-content-between align-items-center border-top pt-2 mt-auto text-muted small">
            <span><i class="bi bi-calendar3 me-1"></i> ${fecha}</span>
            <button class="btn btn-outline-danger btn-sm border-0 py-0" title="Eliminar Reporte" onclick="eliminarReporteEnVivo(${r.id})">
              <i class="bi bi-trash3"></i>
            </button>
          </div>

        </div>
      </div>
    `;
    })
    .join("");
}

function filtrarReportes(filtro) {
  let filtrados = [...listaReportesCache];
  if (filtro === "bueno") {
    filtrados = filtrados.filter((r) => r.estado === "bueno");
  } else if (filtro === "regular") {
    filtrados = filtrados.filter((r) => r.estado === "regular");
  } else if (filtro === "atencion") {
    filtrados = filtrados.filter((r) => r.estado === "atencion");
  }
  renderListadoReportes(filtrados);
}

// ==========================================================================
// 7. GUARDAR NUEVO REPORTE EN LA BD (MYSQL)
// ==========================================================================
async function guardarNuevoReporte(e) {
  e.preventDefault();

  const alumnoId = document.getElementById("selectAlumnoReporte").value || document.getElementById("reporteAlumnoId").value;
  const titulo = document.getElementById("reporteTitulo").value.trim() || "Reporte de Evolución";
  const progreso = parseInt(document.getElementById("reporteProgreso").value);
  const estado = document.getElementById("reporteEstado").value;
  const imagen_url = document.getElementById("reporteImagenUrl").value.trim() || null;
  const observaciones = document.getElementById("reporteObservaciones").value.trim();

  if (!observaciones) {
    alert("Por favor describe las observaciones del reporte.");
    return;
  }

  const payload = {
    alumnoId: alumnoId ? parseInt(alumnoId) : null,
    titulo,
    progreso,
    estado,
    imagen_url,
    observaciones,
  };

  try {
    const res = await fetch(`${API_REPORTES}/crear`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("✅ ¡Reporte guardado exitosamente en la base de datos!");
      document.getElementById("formNuevoReporte").reset();
      document.getElementById("previewImagenReporte").style.display = "none";
      document.getElementById("badgeProgresoValor").textContent = "50%";
      actualizarColorBadgeProgreso(50);

      // Recargar reportes y métricas en tiempo real
      await cargarReportes();
    } else {
      const err = await res.json();
      alert(`❌ Error al guardar reporte: ${err.mensaje || "Revisa los campos requeridos"}`);
    }
  } catch (error) {
    console.error("Error de conexión:", error);
    alert("❌ Error al conectar con el servidor.");
  }
}

// ==========================================================================
// 8. ELIMINAR REPORTE
// ==========================================================================
window.eliminarReporteEnVivo = async function (id) {
  if (!confirm("¿Deseas eliminar este reporte?")) return;

  try {
    const res = await fetch(`${API_REPORTES}/${id}`, { method: "DELETE" });
    if (res.ok) {
      await cargarReportes();
    }
  } catch (error) {
    console.error("Error al eliminar:", error);
  }
};
