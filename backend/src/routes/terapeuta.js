import express from "express";
import Reporte from "../models/reporte.js";

const router = express.Router();

// Crear reporte
router.post("/reportes", async (req, res) => {
  try {
    const { alumnoId, terapeutaId, progreso, observaciones, estado } = req.body;
    const reporte = await Reporte.create({ alumnoId, terapeutaId, progreso, observaciones, estado });
    res.status(201).json(reporte);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Listar reportes de un alumno
router.get("/alumnos/:id/reportes", async (req, res) => {
  try {
    const reportes = await Reporte.findAll({ where: { alumnoId: req.params.id } });
    res.json(reportes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
