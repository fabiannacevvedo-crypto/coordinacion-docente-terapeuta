import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import sequelize from "./backend/src/config/database.js";
import { seedInitialData } from "./backend/src/config/seed.js";

// Rutas API
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
app.use(express.urlencoded({ extended: true }));

// ======================================
// SERVIR ARCHIVOS ESTÁTICOS DEL FRONTEND
// ======================================
const frontendPath = path.join(__dirname, "frontend");
const pagesPath = path.join(__dirname, "frontend", "pages");
const htmlPath = path.join(__dirname, "frontend", "html");

app.use(express.static(frontendPath));
app.use(express.static(pagesPath));
app.use("/frontend", express.static(frontendPath));
app.use("/pages", express.static(pagesPath));
app.use("/html", express.static(htmlPath));
app.use("/assets", express.static(path.join(frontendPath, "assets")));
app.use("/css", express.static(path.join(frontendPath, "css")));
app.use("/js", express.static(path.join(frontendPath, "js")));

// ======================================
// RUTAS AMIGABLES DE VISTAS (SIN CAMBIAR URL)
// ======================================
app.get("/", (req, res) => {
  res.sendFile(path.join(pagesPath, "index.html"));
});

app.get("/index.html", (req, res) => {
  res.sendFile(path.join(pagesPath, "index.html"));
});

app.get(["/login", "/registro", "/acceso"], (req, res) => {
  res.sendFile(path.join(htmlPath, "index.html"));
});

app.get("/seguimiento", (req, res) => {
  res.sendFile(path.join(pagesPath, "seguimiento.html"));
});

app.get("/docente", (req, res) => {
  res.sendFile(path.join(pagesPath, "docente.html"));
});

app.get("/informacion", (req, res) => {
  res.sendFile(path.join(pagesPath, "informacion.html"));
});

app.get("/contacto", (req, res) => {
  res.sendFile(path.join(pagesPath, "contacto.html"));
});

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

// Ruta protegida de perfil
app.get("/api/perfil", verificarToken, (req, res) => {
  res.json({
    msg: "Acceso permitido",
    usuario: req.usuario,
  });
});

// ======================================
// CONEXIÓN CON MYSQL & SEED
// ======================================
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión establecida con MySQL");

    await sequelize.sync({ alter: true });
    console.log("✅ Modelos sincronizados con la base de datos");

    await seedInitialData();
  } catch (error) {
    console.error("❌ Error al conectar o sincronizar con MySQL:", error.message);
  }
})();

// ======================================
// MANEJO DE ERRORES GLOBAL
// ======================================
app.use((err, req, res, next) => {
  console.error("❌ Error inesperado:", err);
  res.status(500).json({ mensaje: "Error interno del servidor", error: err.message });
});

// ======================================
// INICIAR SERVIDOR
// ======================================
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Servidor RED NEC activo en http://localhost:${PORT}`);
  console.log(`🏠 Portal Principal:   http://localhost:${PORT}/`);
  console.log(`🔐 Acceso / Login:     http://localhost:${PORT}/html/index.html (o /login)`);
  console.log(`📊 Seguimiento:        http://localhost:${PORT}/pages/seguimiento.html (o /seguimiento)`);
  console.log(`👩‍🏫 Portal Docente:     http://localhost:${PORT}/pages/docente.html (o /docente)`);
  console.log(`ℹ️  Información:        http://localhost:${PORT}/pages/informacion.html (o /informacion)`);
  console.log(`📞 Contacto:           http://localhost:${PORT}/pages/contacto.html (o /contacto)`);
  console.log(`======================================================\n`);
});
