import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./backend/src/config/database.js";

// Rutas
import authRoutes from "./backend/src/routes/auth.js";
import verificarToken from "./backend/src/middleware/auth.js";
import reporteRoutes from "./backend/src/routes/reporte.js";
import contenidoRoutes from "./backend/src/routes/contenido.js";

// ======================================
// CONFIGURACIÓN INICIAL
// ======================================
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

// ======================================
// MIDDLEWARES
// ======================================
app.use(cors());
app.use(express.json());

// ======================================
// CONEXIÓN CON MYSQL
// ======================================
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión establecida con MySQL");

    await sequelize.sync({ alter: true }); // actualiza tablas si cambian modelos
    console.log("✅ Modelos sincronizados");
  } catch (error) {
    console.error("❌ Error al conectar o sincronizar:", error);
  }
})();

// ======================================
// RUTAS
// ======================================
app.use("/api/auth", authRoutes);
app.use("/api/reportes", reporteRoutes);
app.use("/api/contenidos", contenidoRoutes);

// Ruta protegida
app.get("/api/perfil", verificarToken, (req, res) => {
  res.json({
    msg: "Acceso permitido",
    usuario: req.usuario,
  });
});

// ======================================
// MANEJO DE ERRORES GLOBAL
// ======================================
app.use((err, req, res, next) => {
  console.error("❌ Error inesperado:", err);
  res.status(500).json({ mensaje: "Error interno del servidor" });
});

// ======================================
// INICIAR SERVIDOR
// ======================================
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});



