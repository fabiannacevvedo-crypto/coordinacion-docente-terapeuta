import express from "express";
import { obtenerReportes, crearReporte } from "../controllers/reporte.controller.js";

const router = express.Router();

// GET → listar reportes
router.get("/listar", obtenerReportes);

// POST → crear reporte
router.post("/crear", crearReporte);

export default router;
