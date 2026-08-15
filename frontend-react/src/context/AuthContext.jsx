import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function verificar() {
      if (token) {
        try {
          const res = await api.getPerfil();
          if (res.usuario) {
            setUsuario(res.usuario);
          } else {
            cerrarSesion();
          }
        } catch (e) {
          cerrarSesion();
        }
      }
      setCargando(false);
    }
    verificar();
  }, [token]);

  const iniciarSesion = (nuevoToken, datosUsuario) => {
    localStorage.setItem("token", nuevoToken);
    setToken(nuevoToken);
    setUsuario(datosUsuario);
  };

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUsuario(null);
  };

  // Función rápida para probar roles con un solo clic en desarrollo
  const cambiarRolDemo = (rol) => {
    const demoUser = {
      id: 99,
      nombre: rol === "docente" ? "Seño Laura" : rol === "terapeuta" ? "Lic. Martín" : "Familia Benítez",
      email: `${rol}@rednec.edu`,
      rol: rol,
      matricula: rol === "terapeuta" ? "MP-9842" : null
    };
    setUsuario(demoUser);
  };

  return (
    <AuthContext.Provider value={{ usuario, token, cargando, iniciarSesion, cerrarSesion, cambiarRolDemo }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
