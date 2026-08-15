import React from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import AuthPage from "./pages/AuthPage";
import DocenteDashboard from "./pages/DocenteDashboard";
import TerapeutaDashboard from "./pages/TerapeutaDashboard";
import FamiliarDashboard from "./pages/FamiliarDashboard";

function MainApp() {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "18px",
        color: "#0284c7",
        fontWeight: "700"
      }}>
        Cargando RED NEC... 🚀
      </div>
    );
  }

  if (!usuario) {
    return <AuthPage />;
  }

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        {usuario.rol === "docente" && <DocenteDashboard />}
        {usuario.rol === "terapeuta" && <TerapeutaDashboard />}
        {usuario.rol === "familiar" && <FamiliarDashboard />}
      </main>
      <footer style={{
        background: "#ffffff",
        borderTop: "1px solid var(--border-color)",
        padding: "16px 20px",
        textAlign: "center",
        fontSize: "13px",
        color: "#64748b"
      }}>
        © 2026 RED NEC • Coordinación Interdisciplinaria de Educación Inicial • Formosa
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
