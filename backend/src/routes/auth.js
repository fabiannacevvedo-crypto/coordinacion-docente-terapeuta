import express from "express";
import {
  registrar,
  login,
  loginDemo,
  obtenerPerfil,
  listarAlumnos,
  listarUsuarios
} from "../controllers/auth.controllers.js";
import { verificarToken } from "../middleware/auth.js";

const router = express.Router();

// Rutas de autenticación
router.post("/register", registrar);
router.post("/login", login);
router.post("/demo-login", loginDemo);
router.get("/perfil", verificarToken, obtenerPerfil);

// Datos de apoyo para el frontend
router.get("/alumnos", listarAlumnos);
router.get("/usuarios", listarUsuarios);

export default router;
