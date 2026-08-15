import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import sequelize from "./backend/src/config/database.js";
import { seedInitialData } from "./backend/src/config/seed.js";

// Rutas
import authRoutes from "./backend/src/routes/auth.js";
import verificarToken from "./backend/src/middleware/auth.js";
import reporteRoutes from "./backend/src/routes/reporte.js";
import contenidoRoutes from "./backend/src/routes/contenido.js";
import terapeutaRoutes from "./backend/src/routes/terapeuta.js";
import alumnoRoutes from "./backend/src/routes/alumnos.js";
import asistenciaRoutes from "./backend/src/routes/asistencias.js";
import tareaRoutes from "./backend/src/routes/tareas.js";
import comunicacionRoutes from "./backend/src/routes/comunicaciones.js";

// ======================================
// CONFIGURACIÓN INICIAL
// ======================================
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// ======================================
// MIDDLEWARES
// ======================================
app.use(cors());
app.use(express.json());

// Servir frontend compilado de React y estáticos tradicionales
const reactDistPath = path.join(__dirname, "frontend-react", "dist");
const frontendStaticPath = path.join(__dirname, "frontend");

app.use("/assets", express.static(path.join(reactDistPath, "assets")));
app.use("/frontend", express.static(frontendStaticPath));
app.use(express.static(frontendStaticPath));

// Rutas directas para la App React
app.get(["/app", "/react", "/app/*"], (req, res) => {
  res.sendFile(path.join(reactDistPath, "index.html"));
});

// ======================================
// CONEXIÓN CON MYSQL & SEED
// ======================================
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión establecida con MySQL");

    await sequelize.sync({ alter: true }); // actualiza tablas si cambian modelos
    console.log("✅ Modelos sincronizados");

    await seedInitialData();
  } catch (error) {
    console.error("❌ Error al conectar o sincronizar con MySQL:", error.message);
  }
})();

// ======================================
// RUTAS DE LA API
// ======================================
app.use("/api/auth", authRoutes);
app.use("/api/alumnos", alumnoRoutes);
app.use("/api/asistencias", asistenciaRoutes);
app.use("/api/tareas", tareaRoutes);
app.use("/api/comunicaciones", comunicacionRoutes);
app.use("/api/reportes", reporteRoutes);
app.use("/api/contenidos", contenidoRoutes);
app.use("/api/terapeutas", terapeutaRoutes);

// Ruta protegida
app.get("/api/perfil", verificarToken, (req, res) => {
  res.json({
    msg: "Acceso permitido",
    usuario: req.usuario,
  });
});

// Redirección raíz al portal React moderno
app.get("/", (req, res) => {
  res.sendFile(path.join(reactDistPath, "index.html"));
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
  console.log(`🚀 Servidor RED NEC corriendo en http://localhost:${PORT}`);
  console.log(`✨ Plataforma React: http://localhost:${PORT}/`);
  console.log(`⚡ Vite Dev Server (si se usa): http://localhost:5173`);
});
