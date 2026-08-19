import express from "express";
import Reporte from "../models/reporte.js";
import Alumno from "../models/alumno.js";
import { verificarTokenOpcional } from "../middleware/auth.js";

const router = express.Router();

// Crear reporte
router.post("/reportes", verificarTokenOpcional, async (req, res) => {
  try {
    const { alumnoId, alumno_id, terapeutaId, terapeuta_id, progreso, observaciones, estado, area } = req.body;
    const finalAlumnoId = alumno_id || alumnoId;

    let alumnoNombre = "Alumno " + finalAlumnoId;
    const alumno = await Alumno.findByPk(finalAlumnoId);
    if (alumno) {
      alumnoNombre = `${alumno.nombre} ${alumno.apellido}`;
    }

    const reporte = await Reporte.create({
      alumno_id: finalAlumnoId,
      alumno_nombre: alumnoNombre,
      terapeuta_id: terapeuta_id || terapeutaId || (req.usuario?.id) || null,
      progreso: Number(progreso) || 0,
      observaciones: observaciones || "",
      estado: estado || "regular",
      area: area || "Terapia / Seguimiento",
      autor_nombre: req.usuario?.nombre || "Terapeuta"
    });

    res.status(201).json(reporte);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Listar reportes de un alumno
router.get("/alumnos/:id/reportes", async (req, res) => {
  try {
    const reportes = await Reporte.findAll({
      where: { alumno_id: req.params.id },
      order: [["created_at", "DESC"]]
    });
    res.json(reportes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
