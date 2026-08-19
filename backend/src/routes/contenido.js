import express from "express";
import {
  obtenerContenidos,
  crearContenido,
  eliminarContenido
} from "../controllers/contenido.controller.js";
import { verificarTokenOpcional } from "../middleware/auth.js";

const router = express.Router();

router.get("/listar", obtenerContenidos);
router.post("/crear", verificarTokenOpcional, crearContenido);
router.delete("/:id", verificarTokenOpcional, eliminarContenido);

export default router;
