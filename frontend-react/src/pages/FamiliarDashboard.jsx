import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import MemoriaCartas from "../minijuegos/MemoriaCartas";
import ReconocerEmociones from "../minijuegos/ReconocerEmociones";
import ColoresYFormas from "../minijuegos/ColoresYFormas";
import { 
  Gamepad2, Sparkles, Heart, Sun, CheckCircle2, 
  BookOpen, Stethoscope, Star, Trophy, Smile
} from "lucide-react";

export default function FamiliarDashboard() {
  const [subTab, setSubTab] = useState("dia"); // 'dia' | 'juegos'
  const [juegoSeleccionado, setJuegoSeleccionado] = useState("memoria"); // 'memoria' | 'emociones' | 'colores'
  const [alumno, setAlumno] = useState(null);
  const [tareas, setTareas] = useState([]);
  const [comunicaciones, setComunicaciones] = useState([]);

  useEffect(() => {
    cargarDatosFamilia();
  }, []);

  const cargarDatosFamilia = async () => {
    try {
      const [dataAlumnos, dataTareas, dataCom] = await Promise.all([
        api.getAlumnos(),
        api.getTareas(),
        api.getComunicaciones()
      ]);

      if (dataAlumnos && dataAlumnos.length > 0) {
        setAlumno(dataAlumnos[0]); // Mostrar al alumno vinculado (ej: Mateo)
      }
      setTareas(dataTareas || []);
      setComunicaciones(dataCom || []);
    } catch (e) {
      console.error("Error al cargar datos familiares:", e);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Banner Lúdico Familiar */}
      <div className="card" style={{
        background: "linear-gradient(135deg, #f59e0b, #ec4899, #8b5cf6)",
        color: "white",
        padding: "26px",
        borderRadius: "24px",
        boxShadow: "0 10px 25px rgba(236, 72, 153, 0.25)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
          <div>
            <span className="font-fun" style={{ background: "rgba(255,255,255,0.25)", padding: "4px 14px", borderRadius: "20px", fontSize: "14px", fontWeight: "700" }}>
              🌈 Portal de la Familia • Nivel Inicial
            </span>
            <h2 className="font-fun" style={{ fontSize: "30px", fontWeight: "700", marginTop: "10px", textShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
              ¡Hola Familia! ☀️
            </h2>
            <p style={{ opacity: 0.95, fontSize: "15px", margin: 0, maxWidth: "600px" }}>
              Acompañá el crecimiento de Mateo con reportes diarios amigables, mensajes de sus docentes y divertidos juegos educativos.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => setSubTab("dia")}
              className="btn"
              style={{
                background: subTab === "dia" ? "#ffffff" : "rgba(255,255,255,0.2)",
                color: subTab === "dia" ? "#b45309" : "#ffffff",
                fontFamily: "var(--font-fun)",
                fontSize: "16px",
                padding: "10px 20px",
                borderRadius: "16px"
              }}
            >
              🌟 Mi Día y Tareas
            </button>
            <button
              onClick={() => setSubTab("juegos")}
              className="btn"
              style={{
                background: subTab === "juegos" ? "#ffffff" : "rgba(255,255,255,0.2)",
                color: subTab === "juegos" ? "#7c3aed" : "#ffffff",
                fontFamily: "var(--font-fun)",
                fontSize: "16px",
                padding: "10px 20px",
                borderRadius: "16px"
              }}
            >
              🎮 Minijuegos ({3})
            </button>
          </div>
        </div>
      </div>

      {/* CONTENIDO SEGÚN SUBTAB */}
      {subTab === "dia" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Tarjeta del Alumno & Asistencia de Hoy */}
          {alumno && (
            <div className="card" style={{
              background: "linear-gradient(135deg, #ffffff, #fffbeb)",
              border: "3px solid #fef08a",
              borderRadius: "20px",
              padding: "20px"
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "15px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <img
                    src={alumno.foto_url}
                    alt={alumno.nombre}
                    style={{ width: "70px", height: "70px", borderRadius: "50%", objectFit: "cover", border: "4px solid #fde047" }}
                  />
                  <div>
                    <h3 className="font-fun" style={{ fontSize: "22px", color: "#854d0e", margin: 0 }}>
                      {alumno.nombre} {alumno.apellido} 🧒
                    </h3>
                    <p style={{ fontSize: "14px", color: "#a16207", margin: "2px 0 0 0" }}>
                      {alumno.sala_grado} • 4 años
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    background: "#dcfce7",
                    color: "#166534",
                    border: "2px solid #86efac",
                    padding: "8px 18px",
                    borderRadius: "20px",
                    fontWeight: "800",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}>
                    <CheckCircle2 size={18} /> ¡Presente hoy en la escuela!
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Misiones y Tareas para hacer en Casa */}
          <div className="grid-2">
            <div className="card" style={{ borderRadius: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                <Star size={22} color="#f59e0b" />
                <h3 className="font-fun" style={{ fontSize: "19px", color: "#1e293b", margin: 0 }}>
                  Misiones y Juegos del Día
                </h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {tareas.map((t) => (
                  <div
                    key={t.id}
                    style={{
                      background: t.completada ? "#f0fdf4" : "#ffffff",
                      border: `2px solid ${t.completada ? "#86efac" : "#e2e8f0"}`,
                      borderRadius: "16px",
                      padding: "14px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <div>
                      <span className={`badge ${t.tipo === "terapeutica" ? "badge-terapeuta" : "badge-docente"}`} style={{ marginBottom: "6px" }}>
                        {t.tipo === "terapeutica" ? "Actividad Terapéutica" : "Actividad de la Seño"}
                      </span>
                      <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#1e293b", margin: "4px 0 2px 0" }}>
                        {t.titulo}
                      </h4>
                      <p style={{ fontSize: "13px", color: "#475569", margin: 0 }}>
                        {t.descripcion}
                      </p>
                    </div>

                    <div style={{ textAlign: "center", paddingLeft: "10px" }}>
                      {t.completada ? (
                        <span style={{ color: "#16a34a", fontWeight: "800", fontSize: "13px" }}>✅ ¡Lista!</span>
                      ) : (
                        <span style={{ color: "#ea580c", fontWeight: "800", fontSize: "13px" }}>⏳ Por hacer</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notas y Saludos de la Seño y el Terapeuta */}
            <div className="card" style={{ borderRadius: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                <Heart size={22} color="#ec4899" />
                <h3 className="font-fun" style={{ fontSize: "19px", color: "#1e293b", margin: 0 }}>
                  Mensajitos de la Escuela
                </h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {comunicaciones.map((com) => (
                  <div
                    key={com.id}
                    style={{
                      background: "#fdf4ff",
                      border: "1px solid #f5d0fe",
                      borderRadius: "16px",
                      padding: "14px"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <span style={{ fontSize: "12px", fontWeight: "700", color: "#a21caf" }}>
                        {com.remitente_nombre}
                      </span>
                      <span style={{ fontSize: "11px", color: "#94a3b8" }}>Hoy</span>
                    </div>
                    <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#701a75", margin: "2px 0 4px 0" }}>
                      {com.titulo}
                    </h4>
                    <p style={{ fontSize: "13px", color: "#475569", margin: 0 }}>
                      {com.mensaje}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* SUBTAB MINIJUEGOS EDUCATIVOS */
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Selector de Minijuego */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "14px"
          }}>
            <button
              onClick={() => setJuegoSeleccionado("memoria")}
              style={{
                background: juegoSeleccionado === "memoria" ? "#fdf2f8" : "#ffffff",
                border: `3px solid ${juegoSeleccionado === "memoria" ? "#db2777" : "#e2e8f0"}`,
                borderRadius: "20px",
                padding: "16px",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s"
              }}
            >
              <div style={{ fontSize: "36px", marginBottom: "6px" }}>🧠</div>
              <h4 className="font-fun" style={{ fontSize: "18px", color: "#db2777", margin: 0 }}>Memorama</h4>
              <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>Parejas de animalitos</p>
            </button>

            <button
              onClick={() => setJuegoSeleccionado("emociones")}
              style={{
                background: juegoSeleccionado === "emociones" ? "#eff6ff" : "#ffffff",
                border: `3px solid ${juegoSeleccionado === "emociones" ? "#0284c7" : "#e2e8f0"}`,
                borderRadius: "20px",
                padding: "16px",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s"
              }}
            >
              <div style={{ fontSize: "36px", marginBottom: "6px" }}>🎭</div>
              <h4 className="font-fun" style={{ fontSize: "18px", color: "#0284c7", margin: 0 }}>Rueda de Emociones</h4>
              <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>Identifica qué sienten</p>
            </button>

            <button
              onClick={() => setJuegoSeleccionado("colores")}
              style={{
                background: juegoSeleccionado === "colores" ? "#fefce8" : "#ffffff",
                border: `3px solid ${juegoSeleccionado === "colores" ? "#ca8a04" : "#e2e8f0"}`,
                borderRadius: "20px",
                padding: "16px",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s"
              }}
            >
              <div style={{ fontSize: "36px", marginBottom: "6px" }}>🎨</div>
              <h4 className="font-fun" style={{ fontSize: "18px", color: "#ca8a04", margin: 0 }}>Formas y Colores</h4>
              <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>Misiones visuales</p>
            </button>
          </div>

          {/* Renderizado del Minijuego Activo */}
          {juegoSeleccionado === "memoria" && <MemoriaCartas />}
          {juegoSeleccionado === "emociones" && <ReconocerEmociones />}
          {juegoSeleccionado === "colores" && <ColoresYFormas />}
        </div>
      )}
    </div>
  );
}
