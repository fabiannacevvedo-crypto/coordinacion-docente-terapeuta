const API_URL = "http://localhost:3001/api/reportes";

// ===============================
// 1. Estadísticas
// ===============================
function cargarEstadisticas(data) {
  document.getElementById('stat-total').textContent = data.length;
  document.getElementById('stat-notas').textContent = data.filter(r => r.observaciones).length;
  document.getElementById('stat-buen').textContent = data.filter(r => r.estado === 'bueno').length;
  document.getElementById('stat-atencion').textContent = data.filter(r => r.estado === 'atencion').length;
}

// ===============================
// 2. Gráficas profesionales
// ===============================
function renderGraficas(data) {
  const estados = { bueno: 0, regular: 0, atencion: 0 };
  data.forEach(r => estados[r.estado]++);

  // Pie chart con estilo moderno
  new Chart(document.getElementById("graficoEstados"), {
    type: "doughnut",
    data: {
      labels: ["Bueno", "Regular", "Atención"],
      datasets: [{
        data: [estados.bueno, estados.regular, estados.atencion],
        backgroundColor: ["#2fb380", "#ffc107", "#dc3545"],
        borderWidth: 2
      }]
    },
    options: {
      plugins: {
        legend: { position: "bottom" },
        title: { display: true, text: "Distribución de Estados", font: { size: 16 } }
      }
    }
  });

  // Line chart para progreso histórico
  new Chart(document.getElementById("graficoProgreso"), {
    type: "line",
    data: {
      labels: data.map(r => `Alumno ${r.alumnoId}`),
      datasets: [{
        label: "Progreso (%)",
        data: data.map(r => r.progreso),
        borderColor: "#17a2b8",
        backgroundColor: "rgba(23,162,184,0.2)",
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      plugins: {
        title: { display: true, text: "Progreso por Alumno", font: { size: 16 } }
      },
      scales: { y: { min: 0, max: 100 } }
    }
  });
}

// ===============================
// 3. Tarjetas dinámicas de alumnos
// ===============================
function renderListado(data) {
  const lista = document.getElementById("lista-alumnos");
  lista.innerHTML = data.map(r => `
    <div class="col-12 col-md-6 col-lg-4">
      <div class="alumno-card p-3">
        <div class="d-flex align-items-center gap-3">
          <img src="https://via.placeholder.com/80x80.png?text=A${r.alumnoId}" 
               alt="Alumno ${r.alumnoId}" class="rounded-circle shadow-sm" width="80" height="80">
          <div>
            <h6 class="mb-1 fw-bold">Alumno ${r.alumnoId}</h6>
            <small class="text-muted d-block">Estado: ${r.estado}</small>
            <small class="text-muted d-block">Progreso: ${r.progreso}%</small>
          </div>
        </div>
        <p class="mt-2 mb-0">${r.observaciones || "Sin observaciones registradas"}</p>
        <div class="progress mt-2" style="height:8px;">
          <div class="progress-bar bg-info" role="progressbar" 
               style="width:${r.progreso}%"></div>
        </div>
      </div>
    </div>
  `).join("");
}

// ===============================
// 4. Cargar reportes
// ===============================
async function cargarReportes() {
  const res = await fetch(`${API_URL}/listar`);
  const data = await res.json();

  cargarEstadisticas(data);
  renderGraficas(data);
  renderListado(data);
}

// ===============================
// 5. Guardar nuevo reporte
// ===============================
document.getElementById("form-reporte").addEventListener("submit", async (e) => {
  e.preventDefault();
  const reporte = {
    alumnoId: document.getElementById("alumnoId").value,
    progreso: document.getElementById("progreso").value,
    estado: document.getElementById("estado").value,
    observaciones: document.getElementById("observaciones").value
  };

  const res = await fetch(`${API_URL}/crear`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reporte)
  });

  if (res.ok) {
    alert("✅ Reporte guardado correctamente");
    cargarReportes(); // refresca estadísticas y gráficas
  } else {
    alert("❌ Error al guardar reporte");
  }
});

// ===============================
// Inicializar
// ===============================
cargarReportes();
