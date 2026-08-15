import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { 
  Stethoscope, Activity, CheckCircle, Clock, FileText, 
  Plus, Sparkles, User, MessageSquare, Send, Check
} from "lucide-react";

export default function TerapeutaDashboard() {
  const [alumnos, setAlumnos] = useState([]);
  const [tareasTerapeuticas, setTareasTerapeuticas] = useState([]);
  const [reportes, setReportes] = useState([]);
  const [comunicaciones, setComunicaciones] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("todas");

  // Formulario nuevo reporte
  const [nuevoReporte, setNuevoReporte] = useState({
    alumnoId: "1",
    progreso: 75,
    estado: "bueno",
    observaciones: ""
  });

  // Formulario nueva actividad terapéutica diaria
  const [nuevaTareaTerapeutica, setNuevaTareaTerapeutica] = useState({
    titulo: "",
    descripcion: "",
    area: "Fonoaudiología",
    alumnoId: ""
  });

  // Formulario sugerencia interdisciplinaria
  const [sugerencia, setSugerencia] = useState({
    titulo: "",
    mensaje: "",
    alumnoId: ""
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [dataAlumnos, dataTareas, dataReportes, dataCom] = await Promise.all([
        api.getAlumnos(),
        api.getTareas("terapeutica"),
        api.getReportes(),
        api.getComunicaciones()
      ]);
      setAlumnos(dataAlumnos || []);
      setTareasTerapeuticas(dataTareas || []);
      setReportes(dataReportes || []);
      setComunicaciones(dataCom || []);
    } catch (e) {
      console.error("Error al cargar datos de terapeuta:", e);
    }
  };

  const handleCrearReporte = async (e) => {
    e.preventDefault();
    if (!nuevoReporte.observaciones) return;
    try {
      const res = await api.createReporte(nuevoReporte);
      setReportes([res, ...reportes]);
      setNuevoReporte({ alumnoId: "1", progreso: 75, estado: "bueno", observaciones: "" });
    } catch (e) {
      console.error("Error guardando reporte:", e);
    }
  };

  const handleCrearTareaTerapeutica = async (e) => {
    e.preventDefault();
    if (!nuevaTareaTerapeutica.titulo) return;
    try {
      const creada = await api.createTarea({
        ...nuevaTareaTerapeutica,
        tipo: "terapeutica",
        creador_nombre: "Lic. Martín (Fonoaudiología)"
      });
      setTareasTerapeuticas([creada, ...tareasTerapeuticas]);
      setNuevaTareaTerapeutica({ titulo: "", descripcion: "", area: "Fonoaudiología", alumnoId: "" });
    } catch (e) {
      console.error("Error creando tarea terapéutica:", e);
    }
  };

  const handleToggleTarea = async (id) => {
    try {
      await api.toggleTarea(id);
      setTareasTerapeuticas(tareasTerapeuticas.map(t => t.id === id ? { ...t, completada: !t.completada } : t));
    } catch (e) {
      console.error("Error al alternar tarea:", e);
    }
  };

  const handleEnviarSugerencia = async (e) => {
    e.preventDefault();
    if (!sugerencia.titulo || !sugerencia.mensaje) return;
    try {
      const creada = await api.createComunicacion({
        ...sugerencia,
        remitente_nombre: "Lic. Martín (Terapeuta)",
        remitente_rol: "terapeuta",
        tipo: "sugerencia_terapeutica"
      });
      setComunicaciones([creada, ...comunicaciones]);
      setSugerencia({ titulo: "", mensaje: "", alumnoId: "" });
    } catch (e) {
      console.error("Error enviando sugerencia:", e);
    }
  };

  const tareasFiltradas = tareasTerapeuticas.filter(t => {
    if (filtroEstado === "completadas") return t.completada;
    if (filtroEstado === "pendientes") return !t.completada;
    return true;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Banner Terapeuta */}
      <div className="card" style={{
        background: "linear-gradient(135deg, #0d9488, #0f766e)",
        color: "white",
        padding: "24px",
        borderRadius: "20px"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
          <div>
            <span style={{ background: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" }}>
              Panel Terapéutico Interdisciplinario
            </span>
            <h2 style={{ fontSize: "26px", fontWeight: "800", marginTop: "8px" }}>Coordinación y Seguimiento Clínico 🩺</h2>
            <p style={{ opacity: 0.9, fontSize: "14px", margin: 0 }}>
              Evalúa progresos, añade actividades de estimulación y complementa tareas diarias con docentes.
            </p>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <div style={{ background: "rgba(255,255,255,0.15)", padding: "10px 18px", borderRadius: "14px", textAlign: "center" }}>
              <div style={{ fontSize: "22px", fontWeight: "800" }}>{alumnos.length}</div>
              <div style={{ fontSize: "11px", opacity: 0.85 }}>Casos en Seguimiento</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.15)", padding: "10px 18px", borderRadius: "14px", textAlign: "center" }}>
              <div style={{ fontSize: "22px", fontWeight: "800" }}>{tareasTerapeuticas.filter(t => t.completada).length}/{tareasTerapeuticas.length}</div>
              <div style={{ fontSize: "11px", opacity: 0.85 }}>Metas Logradas</div>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 1: FICHAS DE ALUMNOS CON FOTOS Y DIAGNÓSTICO */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
            👶 Fichas de Alumnos y Objetivos de Desarrollo
          </h3>
          <span style={{ fontSize: "13px", color: "#64748b" }}>{alumnos.length} alumnos registrados</span>
        </div>

        <div className="grid-2">
          {alumnos.map((alumno) => (
            <div key={alumno.id} className="card card-hover" style={{ borderLeft: "5px solid #0d9488" }}>
              <div style={{ display: "flex", gap: "16px" }}>
                <img
                  src={alumno.foto_url}
                  alt={alumno.nombre}
                  style={{ width: "70px", height: "70px", borderRadius: "18px", objectFit: "cover" }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <h4 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
                      {alumno.nombre} {alumno.apellido}
                    </h4>
                    <span style={{ background: "#f0fdfa", color: "#0f766e", fontSize: "12px", fontWeight: "700", padding: "2px 8px", borderRadius: "8px" }}>
                      {alumno.edad} años
                    </span>
                  </div>
                  <p style={{ fontSize: "12px", color: "#0284c7", fontWeight: "700", margin: "2px 0 6px 0" }}>
                    {alumno.sala_grado}
                  </p>
                  <p style={{ fontSize: "13px", color: "#334155", margin: "0 0 6px 0", fontWeight: "600" }}>
                    🎯 {alumno.diagnostico}
                  </p>
                  <p style={{ fontSize: "12px", color: "#64748b", margin: 0, fontStyle: "italic" }}>
                    "{alumno.observaciones_generales}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECCIÓN 2: TAREAS TERAPÉUTICAS Y ACTIVIDADES POR DÍA */}
      <div className="grid-2">
        {/* Creador de Tarea Terapéutica */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <Activity size={20} color="#0d9488" />
            <h3 style={{ fontSize: "17px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
              Nueva Actividad Terapéutica Diaria
            </h3>
          </div>

          <form onSubmit={handleCrearTareaTerapeutica} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "4px" }}>
                Título del Ejercicio / Meta
              </label>
              <input
                type="text"
                value={nuevaTareaTerapeutica.titulo}
                onChange={(e) => setNuevaTareaTerapeutica({ ...nuevaTareaTerapeutica, titulo: e.target.value })}
                placeholder="Ej: Estimulación orofacial con canciones"
                required
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "4px" }}>
                Instrucciones para Docente / Familia
              </label>
              <textarea
                value={nuevaTareaTerapeutica.descripcion}
                onChange={(e) => setNuevaTareaTerapeutica({ ...nuevaTareaTerapeutica, descripcion: e.target.value })}
                placeholder="Indica paso a paso cómo realizar la actividad durante la jornada..."
                rows={3}
                style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "14px" }}
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "4px" }}>
                  Especialidad
                </label>
                <select
                  value={nuevaTareaTerapeutica.area}
                  onChange={(e) => setNuevaTareaTerapeutica({ ...nuevaTareaTerapeutica, area: e.target.value })}
                >
                  <option value="Fonoaudiología">Fonoaudiología</option>
                  <option value="Psicomotricidad">Psicomotricidad</option>
                  <option value="Terapia Ocupacional">Terapia Ocupacional</option>
                  <option value="Psicopedagogía">Psicopedagogía</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "4px" }}>
                  Alumno
                </label>
                <select
                  value={nuevaTareaTerapeutica.alumnoId}
                  onChange={(e) => setNuevaTareaTerapeutica({ ...nuevaTareaTerapeutica, alumnoId: e.target.value })}
                >
                  <option value="">General / Toda la Sala</option>
                  {alumnos.map(a => (
                    <option key={a.id} value={a.id}>{a.nombre} {a.apellido}</option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ background: "#0d9488", marginTop: "6px" }}>
              <Plus size={16} /> Asignar Ejercicio Terapéutico
            </button>
          </form>
        </div>

        {/* Lista de Tareas con Filtro Hechas / No Hechas */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
            <h3 style={{ fontSize: "17px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
              Seguimiento de Metas Terapéuticas
            </h3>
            <div style={{ display: "flex", gap: "6px" }}>
              <button
                onClick={() => setFiltroEstado("todas")}
                style={{
                  padding: "4px 8px", borderRadius: "8px", fontSize: "12px", border: "none", cursor: "pointer",
                  background: filtroEstado === "todas" ? "#0d9488" : "#f1f5f9",
                  color: filtroEstado === "todas" ? "white" : "#475569"
                }}
              >
                Todas
              </button>
              <button
                onClick={() => setFiltroEstado("completadas")}
                style={{
                  padding: "4px 8px", borderRadius: "8px", fontSize: "12px", border: "none", cursor: "pointer",
                  background: filtroEstado === "completadas" ? "#22c55e" : "#f1f5f9",
                  color: filtroEstado === "completadas" ? "white" : "#475569"
                }}
              >
                Hechas ({tareasTerapeuticas.filter(t => t.completada).length})
              </button>
              <button
                onClick={() => setFiltroEstado("pendientes")}
                style={{
                  padding: "4px 8px", borderRadius: "8px", fontSize: "12px", border: "none", cursor: "pointer",
                  background: filtroEstado === "pendientes" ? "#f59e0b" : "#f1f5f9",
                  color: filtroEstado === "pendientes" ? "white" : "#475569"
                }}
              >
                Pendientes ({tareasTerapeuticas.filter(t => !t.completada).length})
              </button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "360px", overflowY: "auto" }}>
            {tareasFiltradas.map((t) => (
              <div
                key={t.id}
                style={{
                  padding: "12px",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  background: t.completada ? "#f0fdf4" : "#ffffff",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "10px"
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span className="badge badge-terapeuta">{t.area}</span>
                    <span style={{ fontSize: "11px", color: "#64748b" }}>{t.creador_nombre}</span>
                  </div>
                  <h4 style={{ fontSize: "14px", fontWeight: "700", margin: "0 0 4px 0", color: t.completada ? "#166534" : "#1e293b" }}>
                    {t.titulo}
                  </h4>
                  <p style={{ fontSize: "13px", color: "#475569", margin: 0 }}>{t.descripcion}</p>
                </div>

                <button
                  onClick={() => handleToggleTarea(t.id)}
                  style={{
                    background: t.completada ? "#22c55e" : "#f1f5f9",
                    color: t.completada ? "white" : "#64748b",
                    border: "none",
                    padding: "6px 10px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "12px",
                    fontWeight: "600"
                  }}
                >
                  <Check size={14} /> {t.completada ? "Completada" : "Por Hacer"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECCIÓN 3: COORDINACIÓN INTERDISCIPLINARIA CON DOCENTES */}
      <div className="card">
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <MessageSquare size={20} color="#0d9488" />
          <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
            Coordinación Interdisciplinaria (Mensajes para la Seño y Familias)
          </h3>
        </div>

        <form onSubmit={handleEnviarSugerencia} style={{ display: "grid", gridTemplateColumns: "1fr 2fr auto", gap: "12px" }}>
          <input
            type="text"
            placeholder="Título de la sugerencia (Ej: Pausa activa con música)"
            value={sugerencia.titulo}
            onChange={(e) => setSugerencia({ ...sugerencia, titulo: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Recomendación terapéutica para complementar las actividades del día..."
            value={sugerencia.mensaje}
            onChange={(e) => setSugerencia({ ...sugerencia, mensaje: e.target.value })}
            required
          />
          <button type="submit" className="btn btn-primary" style={{ background: "#0d9488" }}>
            <Send size={16} /> Enviar Recomendación
          </button>
        </form>
      </div>
    </div>
  );
}
