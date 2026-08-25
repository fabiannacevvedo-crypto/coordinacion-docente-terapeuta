const API_URL = "/api/reportes";

let chartEstados = null;
let chartProgreso = null;

// ===============================
// 1. Estadísticas
// ===============================
function cargarEstadisticas(data) {
  const total = data ? data.length : 0;
  const notas = data ? data.filter((r) => r.observaciones).length : 0;
  const buen = data ? data.filter((r) => r.estado === "bueno").length : 0;
  const atencion = data ? data.filter((r) => r.estado === "atencion").length : 0;

  const statTotal = document.getElementById("stat-total");
  const statNotas = document.getElementById("stat-notas");
  const statBuen = document.getElementById("stat-buen");
  const statAtencion = document.getElementById("stat-atencion");

  if (statTotal) statTotal.textContent = total;
  if (statNotas) statNotas.textContent = notas;
  if (statBuen) statBuen.textContent = buen;
  if (statAtencion) statAtencion.textContent = atencion;
}

// ===============================
// 2. Gráficas profesionales
// ===============================
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

  const canvasEstados = document.getElementById("graficoEstados");
  if (canvasEstados) {
    if (chartEstados) {
      chartEstados.destroy();
    }
    chartEstados = new Chart(canvasEstados, {
      type: "doughnut",
      data: {
        labels: ["Progreso Bueno", "Regular / En Proceso", "Requiere Atención"],
        datasets: [
          {
            data: [estados.bueno, estados.regular, estados.atencion],
            backgroundColor: ["#2fb380", "#ffc107", "#dc3545"],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom" },
          title: { display: true, text: "Distribución de Estados de Reportes", font: { size: 15 } },
        },
      },
    });
  }

  const canvasProgreso = document.getElementById("graficoProgreso");
  if (canvasProgreso) {
    if (chartProgreso) {
      chartProgreso.destroy();
    }
    chartProgreso = new Chart(canvasProgreso, {
      type: "line",
      data: {
        labels: data.map((r, i) => `Alumno #${r.alumnoId || i + 1}`),
        datasets: [
          {
            label: "Nivel de Progreso (%)",
            data: data.map((r) => r.progreso || 0),
            borderColor: "#17a2b8",
            backgroundColor: "rgba(23,162,184,0.15)",
            fill: true,
            tension: 0.3,
            pointRadius: 5,
            pointBackgroundColor: "#17a2b8",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: "Evolución de Progreso por Alumno", font: { size: 15 } },
        },
        scales: {
          y: { min: 0, max: 100, ticks: { callback: (v) => `${v}%` } },
        },
      },
    });
  }
}

// ===============================
// 3. Tarjetas dinámicas de alumnos
// ===============================
function renderListado(data) {
  const lista = document.getElementById("lista-alumnos");
  if (!lista) return;

  if (!data || data.length === 0) {
    lista.innerHTML = '<div class="col-12 text-center text-muted py-4">No hay reportes registrados aún.</div>';
    return;
  }

  lista.innerHTML = data
    .map((r) => {
      const estadoColor =
        r.estado === "bueno" ? "bg-success" : r.estado === "atencion" ? "bg-danger" : "bg-warning text-dark";
      const progreso = r.progreso || 0;

      return `
      <div class="col-12 col-md-6 col-lg-3">
        <div class="card h-100 shadow-sm border-0 p-3">
          <div class="d-flex align-items-center gap-3">
            <div class="avatar-inicial">A${r.alumnoId || "?"}</div>
            <div>
              <h6 class="mb-0 fw-bold">Alumno #${r.alumnoId || "S/N"}</h6>
              <span class="badge ${estadoColor} text-capitalize my-1">${r.estado || "Regular"}</span>
              <small class="text-muted d-block">Progreso: <strong>${progreso}%</strong></small>
            </div>
          </div>
          <p class="mt-3 mb-2 text-secondary small flex-grow-1">${r.observaciones || "Sin observaciones registradas."}</p>
          <div class="progress mt-2" style="height: 8px;">
            <div class="progress-bar ${r.estado === "bueno" ? "bg-success" : r.estado === "atencion" ? "bg-danger" : "bg-warning"}" 
                 role="progressbar" style="width: ${progreso}%"></div>
          </div>
        </div>
      </div>
    `;
    })
    .join("");
}

// ===============================
// 4. Cargar reportes
// ===============================
async function cargarReportes() {
  try {
    const res = await fetch(`${API_URL}/listar`);
    if (!res.ok) throw new Error("Error al obtener reportes");
    const data = await res.json();

    cargarEstadisticas(data);
    renderGraficas(data);
    renderListado(data);
  } catch (err) {
    console.error("Error al cargar reportes:", err);
  }
}

// ===============================
// 5. Guardar nuevo reporte
// ===============================
const formReporte = document.getElementById("form-reporte");
if (formReporte) {
  formReporte.addEventListener("submit", async (e) => {
    e.preventDefault();
    const alumnoId = parseInt(document.getElementById("alumnoId").value);
    const progreso = parseInt(document.getElementById("progreso").value);
    const estado = document.getElementById("estado").value;
    const observaciones = document.getElementById("observaciones").value;

    const reporte = {
      alumnoId,
      progreso,
      estado,
      observaciones,
    };

    try {
      const res = await fetch(`${API_URL}/crear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reporte),
      });

      if (res.ok) {
        alert("✅ Reporte guardado correctamente");
        formReporte.reset();
        await cargarReportes();
      } else {
        const errorData = await res.json();
        alert(`❌ Error al guardar reporte: ${errorData.mensaje || "Revisa los campos"}`);
      }
    } catch (err) {
      console.error("Error de conexión:", err);
      alert("❌ No se pudo conectar con el servidor.");
    }
  });
}

// ===============================
// Inicializar
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  cargarReportes();
});
