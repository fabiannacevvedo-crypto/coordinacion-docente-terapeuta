import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { BookOpen, Stethoscope, HeartHandshake, Sparkles, ArrowRight, Lock, Mail, User } from "lucide-react";

export default function AuthPage() {
  const { iniciarSesion, cambiarRolDemo } = useAuth();
  const [tab, setTab] = useState("login"); // 'login' | 'register'
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "docente",
    matricula: ""
  });
  const [mensaje, setMensaje] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(null);
    setCargando(true);

    try {
      if (tab === "register") {
        const res = await api.register(form);
        if (res.usuario) {
          setMensaje({ tipo: "exito", texto: "¡Cuenta creada con éxito! Ahora inicia sesión." });
          setTab("login");
        } else {
          setMensaje({ tipo: "error", texto: res.msg || "Error al registrarse." });
        }
      } else {
        const res = await api.login(form.email, form.password);
        if (res.token && res.usuario) {
          iniciarSesion(res.token, res.usuario);
        } else {
          setMensaje({ tipo: "error", texto: res.msg || "Credenciales incorrectas." });
        }
      }
    } catch (err) {
      setMensaje({ tipo: "error", texto: "No se pudo conectar con el backend." });
    }
    setCargando(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      background: "linear-gradient(135deg, #f0fdfa, #f0f9ff, #fdf4ff)"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "960px",
        background: "#ffffff",
        borderRadius: "24px",
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
        display: "grid",
        gridTemplateColumns: "1fr 1.1fr"
      }}>
        {/* Panel Izquierdo Decorativo */}
        <div style={{
          background: "linear-gradient(145deg, #0f172a, #1e293b, #0369a1)",
          color: "white",
          padding: "45px 35px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}>
          <div>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #38bdf8, #2dd4bf)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              marginBottom: "20px"
            }}>
              🤝
            </div>
            <h1 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "12px" }}>RED NEC</h1>
            <p style={{ fontSize: "15px", color: "#cbd5e1", lineHeight: "1.6" }}>
              Plataforma colaborativa integral que une a <strong>Docentes</strong>, <strong>Terapeutas</strong> y <strong>Familias</strong> en el seguimiento y estimulación de nivel inicial.
            </p>
          </div>

          {/* Accesos Rápidos de Demostración */}
          <div style={{
            background: "rgba(255,255,255,0.08)",
            padding: "16px",
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.12)"
          }}>
            <div style={{ fontSize: "12px", fontWeight: "700", color: "#38bdf8", marginBottom: "8px", textTransform: "uppercase" }}>
              ⚡ Probar roles al instante (Demo):
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <button
                onClick={() => cambiarRolDemo("docente")}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "none",
                  color: "white",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <span>👩‍🏫 Entrar como <strong>Docente</strong></span>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={() => cambiarRolDemo("terapeuta")}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "none",
                  color: "white",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <span>🧑‍⚕️ Entrar como <strong>Terapeuta</strong></span>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={() => cambiarRolDemo("familiar")}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "none",
                  color: "white",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <span>🎈 Entrar como <strong>Familiar / Niño</strong></span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Panel Derecho Formularios */}
        <div style={{ padding: "40px 35px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {/* Tabs */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "25px", borderBottom: "2px solid #f1f5f9", paddingBottom: "10px" }}>
            <button
              onClick={() => { setTab("login"); setMensaje(null); }}
              style={{
                background: tab === "login" ? "#e0f2fe" : "none",
                color: tab === "login" ? "#0284c7" : "#64748b",
                border: "none",
                padding: "8px 18px",
                borderRadius: "10px",
                fontWeight: "700",
                fontSize: "15px",
                cursor: "pointer"
              }}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => { setTab("register"); setMensaje(null); }}
              style={{
                background: tab === "register" ? "#e0f2fe" : "none",
                color: tab === "register" ? "#0284c7" : "#64748b",
                border: "none",
                padding: "8px 18px",
                borderRadius: "10px",
                fontWeight: "700",
                fontSize: "15px",
                cursor: "pointer"
              }}
            >
              Crear Cuenta
            </button>
          </div>

          {mensaje && (
            <div style={{
              background: mensaje.tipo === "exito" ? "#dcfce7" : "#fee2e2",
              color: mensaje.tipo === "exito" ? "#166534" : "#991b1b",
              border: `1px solid ${mensaje.tipo === "exito" ? "#86efac" : "#fca5a5"}`,
              padding: "12px",
              borderRadius: "10px",
              fontSize: "14px",
              marginBottom: "16px",
              fontWeight: "600"
            }}>
              {mensaje.texto}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {tab === "register" && (
              <div>
                <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "4px" }}>
                  Nombre Completo
                </label>
                <input
                  type="text"
                  placeholder="Ej: Lic. Martín / Seño Laura / Familia Gómez"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  required
                />
              </div>
            )}

            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "4px" }}>
                Correo Electrónico
              </label>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "4px" }}>
                Contraseña
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
              />
            </div>

            {tab === "register" && (
              <>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "4px" }}>
                    Selecciona tu Rol en RED NEC
                  </label>
                  <select
                    value={form.rol}
                    onChange={(e) => setForm({ ...form, rol: e.target.value })}
                  >
                    <option value="docente">👩‍🏫 Docente (Gestión escolar, asistencia, tareas)</option>
                    <option value="terapeuta">🧑‍⚕️ Terapeuta (Fichas clínicas, estimulación, reportes)</option>
                    <option value="familiar">🎈 Familiar / Tutor (Seguimiento amigable y minijuegos)</option>
                  </select>
                </div>

                {form.rol === "terapeuta" && (
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "4px" }}>
                      Matrícula Profesional
                    </label>
                    <input
                      type="text"
                      placeholder="N° de Matrícula (Ej: MP-4821)"
                      value={form.matricula}
                      onChange={(e) => setForm({ ...form, matricula: e.target.value })}
                      required
                    />
                  </div>
                )}
              </>
            )}

            <button type="submit" className="btn btn-primary" style={{ padding: "14px", fontSize: "15px", marginTop: "10px" }} disabled={cargando}>
              {cargando ? "Procesando..." : tab === "login" ? "Ingresar a RED NEC" : "Crear mi Cuenta"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
