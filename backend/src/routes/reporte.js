import express from "express";
import { obtenerReportes, crearReporte, eliminarReporte } from "../controllers/reporte.controller.js";

const router = express.Router();

// GET → listar reportes
router.get("/", obtenerReportes);
router.get("/listar", obtenerReportes);

// POST → crear reporte
router.post("/", crearReporte);
router.post("/crear", crearReporte);

// DELETE → eliminar reporte
router.delete("/:id", eliminarReporte);

export default router;
