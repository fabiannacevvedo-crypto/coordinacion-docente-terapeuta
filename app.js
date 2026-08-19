import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import sequelize, { asegurarBaseDatos } from "./backend/src/config/database.js";
import { conectarMongoDB, estadoMongoDB } from "./backend/src/config/mongodb.js";
import { sembrarDatos } from "./backend/src/config/seed.js";

// Modelos
import "./backend/src/models/usuario.js";
import "./backend/src/models/jardin.js";
import "./backend/src/models/sala.js";
import "./backend/src/models/docente_sala.js";
import "./backend/src/models/alumno.js";
import "./backend/src/models/asistencia.js";
import "./backend/src/models/tarea.js";
import "./backend/src/models/comunicacion.js";
import "./backend/src/models/reporte.js";
import "./backend/src/models/contenido.js";
import "./backend/src/models/contacto.js";
import "./backend/src/models/role.js";

// Rutas
import authRoutes from "./backend/src/routes/auth.js";
import jardinRoutes from "./backend/src/routes/jardin.js";
import salaRoutes from "./backend/src/routes/sala.js";
import alumnoRoutes from "./backend/src/routes/alumno.js";
import asistenciaRoutes from "./backend/src/routes/asistencia.js";
import tareaRoutes from "./backend/src/routes/tarea.js";
import comunicacionRoutes from "./backend/src/routes/comunicacion.js";
import reporteRoutes from "./backend/src/routes/reporte.js";
import contenidoRoutes from "./backend/src/routes/contenido.js";
import contactoRoutes from "./backend/src/routes/contacto.js";
import terapeutaRoutes from "./backend/src/routes/terapeuta.js";
import { verificarToken } from "./backend/src/middleware/auth.js";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir estáticos
app.use("/frontend", express.static(path.join(__dirname, "frontend")));
app.use(express.static(path.join(__dirname, "frontend")));

// Redirecciones Web
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "pages", "index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "html", "index.html"));
});

app.get("/seguimiento", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "pages", "seguimiento.html"));
});

app.get("/informacion", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "pages", "informacion.html"));
});

app.get("/contacto", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "pages", "contacto.html"));
});

// Rutas API
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    servicio: "RED NEC API Dual (MySQL + MongoDB)",
    mysql: "Conectado",
    mongodb: estadoMongoDB() ? "Conectado (Dual NoSQL)" : "Opcional / Standby",
    version: "2.0.0",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/jardines", jardinRoutes);
app.use("/api/salas", salaRoutes);
app.use("/api/alumnos", alumnoRoutes);
app.use("/api/asistencias", asistenciaRoutes);
app.use("/api/tareas", tareaRoutes);
app.use("/api/comunicaciones", comunicacionRoutes);
app.use("/api/reportes", reporteRoutes);
app.use("/api/contenidos", contenidoRoutes);
app.use("/api/contacto", contactoRoutes);
app.use("/api/terapeutas", terapeutaRoutes);

app.get("/api/perfil", verificarToken, (req, res) => {
  res.json({
    msg: "Acceso autorizado",
    usuario: req.usuario,
  });
});

// Manejo 404 para API
app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ mensaje: `Ruta API no encontrada: ${req.method} ${req.path}` });
  }
  next();
});

// Inicialización de Servidor y Bases de Datos
async function iniciarServidor() {
  try {
    await asegurarBaseDatos();
    await sequelize.authenticate();
    console.log("🐬 ✅ MySQL Conectado exitosamente");

    await sequelize.sync({ alter: true });
    console.log("✅ Modelos MySQL/Sequelize sincronizados (Jardines, Salas, Alumnos, Tareas, Asistencias, Reportes)");

    // Conectar MongoDB opcional
    await conectarMongoDB();

    // Sembrar datos de prueba
    await sembrarDatos(false);

    app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`🚀 SERVIDOR RED NEC INICIADO EN PUERTO ${PORT}`);
      console.log(`📡 Health Check:     http://localhost:${PORT}/api/health`);
      console.log(`🌐 Landing Page:     http://localhost:${PORT}/frontend/pages/index.html`);
      console.log(`📊 Panel Seguimiento:http://localhost:${PORT}/frontend/pages/seguimiento.html`);
      console.log(`🔐 Acceso / Login:   http://localhost:${PORT}/frontend/html/index.html`);
      console.log(`======================================================\n`);
    });
  } catch (error) {
    console.error("❌ Error fatal iniciando el servidor:", error.message);
  }
}

iniciarServidor();

export default app;
