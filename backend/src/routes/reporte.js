import express from "express";
import {
  obtenerReportes,
  obtenerEstadisticas,
  obtenerReportePorId,
  crearReporte,
  actualizarReporte,
  eliminarReporte
} from "../controllers/reporte.controller.js";
import { verificarTokenOpcional } from "../middleware/auth.js";

const router = express.Router();

// Listado y métricas
router.get("/listar", obtenerReportes);
router.get("/estadisticas", obtenerEstadisticas);
router.get("/:id", obtenerReportePorId);

// Operaciones de escritura
router.post("/crear", verificarTokenOpcional, crearReporte);
router.put("/:id", verificarTokenOpcional, actualizarReporte);
router.delete("/:id", verificarTokenOpcional, eliminarReporte);

export default router;
