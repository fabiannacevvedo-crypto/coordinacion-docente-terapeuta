import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { 
  Users, CheckCircle2, XCircle, Clock, PlusCircle, 
  Calendar, MessageSquare, BookOpen, BarChart3, Send, Check
} from "lucide-react";

export default function DocenteDashboard() {
  const [alumnos, setAlumnos] = useState([]);
  const [asistencias, setAsistencias] = useState({});
  const [tareas, setTareas] = useState([]);
  const [comunicaciones, setComunicaciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Formulario nueva tarea
  const [nuevaTarea, setNuevaTarea] = useState({
    titulo: "",
    descripcion: "",
    area: "Plástica y Lenguaje",
    tipo: "docente",
    alumnoId: ""
  });

  // Formulario nuevo saludo / aviso
  const [nuevoSaludo, setNuevoSaludo] = useState({
    titulo: "",
    mensaje: "",
    tipo: "saludo"
  });

  const fechaHoy = new Date().toISOString().split("T")[0];

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [dataAlumnos, dataAsistencias, dataTareas, dataComunicaciones] = await Promise.all([
        api.getAlumnos(),
        api.getAsistencias(fechaHoy),
        api.getTareas(),
        api.getComunicaciones()
      ]);

      setAlumnos(dataAlumnos || []);
      setTareas(dataTareas || []);
      setComunicaciones(dataComunicaciones || []);

      // Mapear asistencias de hoy por alumnoId
      const mapa = {};
      (dataAsistencias || []).forEach((a) => {
        mapa[a.alumnoId] = a.estado;
      });
      setAsistencias(mapa);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
    setCargando(false);
  };

  // Marcar Asistencia
  const handleAsistencia = async (alumnoId, estado) => {
    setAsistencias((prev) => ({ ...prev, [alumnoId]: estado }));
    try {
      await api.registrarAsistencia(alumnoId, estado, "", fechaHoy);
    } catch (e) {
      console.error("Error guardando asistencia:", e);
    }
  };

  // Crear Tarea
  const handleCrearTarea = async (e) => {
    e.preventDefault();
    if (!nuevaTarea.titulo) return;
    try {
      const creada = await api.createTarea({
        ...nuevaTarea,
        creador_nombre: "Docente Titular"
      });
      setTareas([creada, ...tareas]);
      setNuevaTarea({ titulo: "", descripcion: "", area: "Plástica y Lenguaje", tipo: "docente", alumnoId: "" });
    } catch (e) {
      console.error("Error creando tarea:", e);
    }
  };

  // Alternar Tarea
  const handleToggleTarea = async (id) => {
    try {
      await api.toggleTarea(id);
      setTareas(tareas.map(t => t.id === id ? { ...t, completada: !t.completada } : t));
    } catch (e) {
      console.error("Error al alternar tarea:", e);
    }
  };

  // Publicar Saludo / Aviso
  const handlePublicarSaludo = async (e) => {
    e.preventDefault();
    if (!nuevoSaludo.titulo || !nuevoSaludo.mensaje) return;
    try {
      const creada = await api.createComunicacion({
        ...nuevoSaludo,
        remitente_nombre: "Seño Laura (Sala Amarilla)",
        remitente_rol: "docente"
      });
      setComunicaciones([creada, ...comunicaciones]);
      setNuevoSaludo({ titulo: "", mensaje: "", tipo: "saludo" });
    } catch (e) {
      console.error("Error publicando saludo:", e);
    }
  };

  // Métricas
  const totalAlumnos = alumnos.length;
  const presentesCount = Object.values(asistencias).filter(v => v === "presente").length;
  const ausentesCount = Object.values(asistencias).filter(v => v === "ausente").length;
  const tardeCount = Object.values(asistencias).filter(v => v === "tarde").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Banner de Bienvenida */}
      <div className="card" style={{
        background: "linear-gradient(135deg, #0284c7, #0369a1)",
        color: "white",
        padding: "24px",
        borderRadius: "20px"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
          <div>
            <span style={{ background: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" }}>
              Panel Docente • Sala Amarilla (4 años)
            </span>
            <h2 style={{ fontSize: "26px", fontWeight: "800", marginTop: "8px" }}>¡Buen día, Seño! ☀️</h2>
            <p style={{ opacity: 0.9, fontSize: "14px", margin: 0 }}>
              Gestiona la asistencia diaria, asigna tareas escolares y envía notas y saludos a las familias.
            </p>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <div style={{ background: "rgba(255,255,255,0.15)", padding: "10px 18px", borderRadius: "14px", textAlign: "center" }}>
              <div style={{ fontSize: "22px", fontWeight: "800" }}>{presentesCount}/{totalAlumnos}</div>
              <div style={{ fontSize: "11px", opacity: 0.85 }}>Presentes Hoy</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.15)", padding: "10px 18px", borderRadius: "14px", textAlign: "center" }}>
              <div style={{ fontSize: "22px", fontWeight: "800" }}>{tareas.filter(t => !t.completada).length}</div>
              <div style={{ fontSize: "11px", opacity: 0.85 }}>Tareas Activas</div>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 1: TOMA DE ASISTENCIA RÁPIDA */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Calendar size={22} color="#0284c7" />
            <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
              Toma de Asistencia ({fechaHoy})
            </h3>
          </div>
          <div style={{ display: "flex", gap: "10px", fontSize: "13px" }}>
            <span className="badge badge-presente">Presentes: {presentesCount}</span>
            <span className="badge badge-tarde">Tarde: {tardeCount}</span>
            <span className="badge badge-ausente">Ausentes: {ausentesCount}</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
          {alumnos.map((alumno) => {
            const estadoActual = asistencias[alumno.id] || "sin_marcar";
            return (
              <div
                key={alumno.id}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "14px",
                  padding: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: estadoActual === "presente" ? "#f0fdf4" : estadoActual === "ausente" ? "#fef2f2" : estadoActual === "tarde" ? "#fffbeb" : "#ffffff"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <img
                    src={alumno.foto_url}
                    alt={alumno.nombre}
                    style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover" }}
                  />
                  <div>
                    <h4 style={{ fontSize: "14px", fontWeight: "700", margin: 0, color: "#1e293b" }}>
                      {alumno.nombre} {alumno.apellido}
                    </h4>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>{alumno.edad} años • {alumno.sala_grado}</span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "4px" }}>
                  <button
                    onClick={() => handleAsistencia(alumno.id, "presente")}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: "700",
                      border: "none",
                      cursor: "pointer",
                      background: estadoActual === "presente" ? "#22c55e" : "#f1f5f9",
                      color: estadoActual === "presente" ? "#ffffff" : "#475569"
                    }}
                    title="Presente"
                  >
                    ✓ P
                  </button>
                  <button
                    onClick={() => handleAsistencia(alumno.id, "tarde")}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: "700",
                      border: "none",
                      cursor: "pointer",
                      background: estadoActual === "tarde" ? "#f59e0b" : "#f1f5f9",
                      color: estadoActual === "tarde" ? "#ffffff" : "#475569"
                    }}
                    title="Tarde"
                  >
                    ⏱ T
                  </button>
                  <button
                    onClick={() => handleAsistencia(alumno.id, "ausente")}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: "700",
                      border: "none",
                      cursor: "pointer",
                      background: estadoActual === "ausente" ? "#ef4444" : "#f1f5f9",
                      color: estadoActual === "ausente" ? "#ffffff" : "#475569"
                    }}
                    title="Ausente"
                  >
                    ✕ A
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECCIÓN 2: GESTIÓN DE TAREAS Y ACTIVIDADES */}
      <div className="grid-2">
        {/* Formulario Crear Tarea */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <BookOpen size={20} color="#0284c7" />
            <h3 style={{ fontSize: "17px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
              Asignar Nueva Tarea / Actividad
            </h3>
          </div>

          <form onSubmit={handleCrearTarea} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "4px" }}>
                Título de la Actividad
              </label>
              <input
                type="text"
                value={nuevaTarea.titulo}
                onChange={(e) => setNuevaTarea({ ...nuevaTarea, titulo: e.target.value })}
                placeholder="Ej: Pintura dactilar con témpera azul"
                required
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "4px" }}>
                Descripción / Consigna
              </label>
              <textarea
                value={nuevaTarea.descripcion}
                onChange={(e) => setNuevaTarea({ ...nuevaTarea, descripcion: e.target.value })}
                placeholder="Explicar qué materiales usar y qué habilidad se estimula..."
                rows={3}
                style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "14px" }}
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "4px" }}>
                  Área
                </label>
                <select
                  value={nuevaTarea.area}
                  onChange={(e) => setNuevaTarea({ ...nuevaTarea, area: e.target.value })}
                >
                  <option value="Plástica y Lenguaje">Plástica y Lenguaje</option>
                  <option value="Psicomotricidad">Psicomotricidad</option>
                  <option value="Música y Expresión">Música y Expresión</option>
                  <option value="Juego Simbólico">Juego Simbólico</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "4px" }}>
                  Asignar a
                </label>
                <select
                  value={nuevaTarea.alumnoId}
                  onChange={(e) => setNuevaTarea({ ...nuevaTarea, alumnoId: e.target.value })}
                >
                  <option value="">Toda la Sala</option>
                  {alumnos.map(a => (
                    <option key={a.id} value={a.id}>{a.nombre} {a.apellido}</option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: "6px" }}>
              <PlusCircle size={16} /> Publicar Tarea
            </button>
          </form>
        </div>

        {/* Lista de Tareas Activas */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "17px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
              Tareas y Actividades en Curso
            </h3>
            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Total: {tareas.length}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "360px", overflowY: "auto" }}>
            {tareas.length === 0 ? (
              <p style={{ color: "#94a3b8", fontSize: "14px", textAlign: "center", padding: "20px" }}>No hay tareas cargadas aún.</p>
            ) : (
              tareas.map((t) => (
                <div
                  key={t.id}
                  style={{
                    padding: "12px",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    background: t.completada ? "#f8fafc" : "#ffffff",
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: "10px"
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span className={`badge ${t.tipo === "terapeutica" ? "badge-terapeuta" : "badge-docente"}`}>
                        {t.tipo === "terapeutica" ? "Terapéutica" : "Docente"}
                      </span>
                      <span style={{ fontSize: "11px", color: "#64748b" }}>{t.area}</span>
                    </div>
                    <h4 style={{ fontSize: "14px", fontWeight: "700", margin: "0 0 4px 0", textDecoration: t.completada ? "line-through" : "none", color: t.completada ? "#94a3b8" : "#1e293b" }}>
                      {t.titulo}
                    </h4>
                    <p style={{ fontSize: "13px", color: "#475569", margin: 0 }}>
                      {t.descripcion}
                    </p>
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
                    <Check size={14} /> {t.completada ? "Hecha" : "Pendiente"}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* SECCIÓN 3: MURO DE SALUDOS Y NOTAS PARA LAS FAMILIAS */}
      <div className="card">
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <MessageSquare size={20} color="#0284c7" />
          <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
            Muro de Saludos, Avisos y Descripciones Diarias
          </h3>
        </div>

        <form onSubmit={handlePublicarSaludo} style={{ display: "grid", gridTemplateColumns: "1fr 2fr auto", gap: "12px", marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Título (Ej: ¡Gran jornada de juegos!)"
            value={nuevoSaludo.titulo}
            onChange={(e) => setNuevoSaludo({ ...nuevoSaludo, titulo: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Escribe una nota cálida o saludo para las familias..."
            value={nuevoSaludo.mensaje}
            onChange={(e) => setNuevoSaludo({ ...nuevoSaludo, mensaje: e.target.value })}
            required
          />
          <button type="submit" className="btn btn-primary">
            <Send size={16} /> Enviar al Muro
          </button>
        </form>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "14px" }}>
          {comunicaciones.map((com) => (
            <div
              key={com.id}
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "14px",
                padding: "16px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span className={`badge ${com.remitente_rol === "terapeuta" ? "badge-terapeuta" : "badge-docente"}`}>
                  {com.remitente_nombre}
                </span>
                <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                  {new Date(com.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
              <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#1e293b", margin: "6px 0 4px 0" }}>
                {com.titulo}
              </h4>
              <p style={{ fontSize: "13px", color: "#475569", margin: 0, lineHeight: "1.5" }}>
                {com.mensaje}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
