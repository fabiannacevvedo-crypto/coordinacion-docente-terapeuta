import React from "react";
import { useAuth } from "../context/AuthContext";
import { LogOut, User, Sparkles, BookOpen, Stethoscope, HeartHandshake } from "lucide-react";

export default function Navbar({ activeTab, setActiveTab }) {
  const { usuario, cerrarSesion, cambiarRolDemo } = useAuth();

  const getRoleBadge = (rol) => {
    switch (rol) {
      case "docente":
        return { label: "Docente", color: "badge-docente", icon: BookOpen };
      case "terapeuta":
        return { label: "Terapeuta", color: "badge-terapeuta", icon: Stethoscope };
      case "familiar":
      default:
        return { label: "Familiar / Tutor", color: "badge-familiar", icon: HeartHandshake };
    }
  };

  const badgeInfo = usuario ? getRoleBadge(usuario.rol) : null;
  const RoleIcon = badgeInfo?.icon;

  return (
    <header style={{
      background: "#ffffff",
      borderBottom: "1px solid var(--border-color)",
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: "0 2px 10px rgba(0,0,0,0.03)"
    }}>
      <div style={{
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "12px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "15px",
        flexWrap: "wrap"
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #0284c7, #0d9488)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "800",
            fontSize: "18px"
          }}>
            RN
          </div>
          <div>
            <h1 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", lineHeight: "1.2" }}>RED NEC</h1>
            <p style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "500" }}>Coordinación Docente • Terapeuta • Familia</p>
          </div>
        </div>

        {/* Demo Role Switcher (Para probar fácil) */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          background: "#f1f5f9",
          padding: "4px 8px",
          borderRadius: "12px"
        }}>
          <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", paddingRight: "4px" }}>
            Cambiar Rol:
          </span>
          <button
            onClick={() => cambiarRolDemo("docente")}
            style={{
              padding: "4px 10px",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: "600",
              border: "none",
              cursor: "pointer",
              background: usuario?.rol === "docente" ? "#0284c7" : "transparent",
              color: usuario?.rol === "docente" ? "white" : "#475569",
              transition: "all 0.2s"
            }}
          >
            👩‍🏫 Docente
          </button>
          <button
            onClick={() => cambiarRolDemo("terapeuta")}
            style={{
              padding: "4px 10px",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: "600",
              border: "none",
              cursor: "pointer",
              background: usuario?.rol === "terapeuta" ? "#0d9488" : "transparent",
              color: usuario?.rol === "terapeuta" ? "white" : "#475569",
              transition: "all 0.2s"
            }}
          >
            🧑‍⚕️ Terapeuta
          </button>
          <button
            onClick={() => cambiarRolDemo("familiar")}
            style={{
              padding: "4px 10px",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: "600",
              border: "none",
              cursor: "pointer",
              background: usuario?.rol === "familiar" ? "#f59e0b" : "transparent",
              color: usuario?.rol === "familiar" ? "white" : "#475569",
              transition: "all 0.2s"
            }}
          >
            🎈 Familiar
          </button>
        </div>

        {/* User Info & Logout */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {usuario && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b" }}>{usuario.nombre}</div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <span className={`badge ${badgeInfo?.color}`}>
                    {RoleIcon && <RoleIcon size={12} />}
                    {badgeInfo?.label}
                  </span>
                </div>
              </div>
              <button
                onClick={cerrarSesion}
                className="btn btn-secondary"
                style={{ padding: "8px 12px", borderRadius: "10px", fontSize: "13px" }}
                title="Cerrar Sesión"
              >
                <LogOut size={16} /> Salir
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
