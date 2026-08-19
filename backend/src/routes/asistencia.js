import express from "express";
import Asistencia from "../models/asistencia.js";
import Alumno from "../models/alumno.js";
import Sala from "../models/sala.js";
import { verificarTokenOpcional } from "../middleware/auth.js";

const router = express.Router();

// GET /api/asistencias/fecha?fecha=YYYY-MM-DD&sala_id=X
router.get("/fecha", async (req, res) => {
  try {
    const { fecha, sala_id } = req.query;
    const where = {};
    if (fecha) where.fecha = fecha;
    if (sala_id) where.sala_id = sala_id;

    const asistencias = await Asistencia.findAll({
      where,
      include: [
        { model: Alumno, as: "Alumno", attributes: ["id", "nombre", "apellido", "diagnostico", "sala_id"] }
      ]
    });
    res.json(asistencias);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/asistencias (individual o por lote)
router.post("/", verificarTokenOpcional, async (req, res) => {
  try {
    const { alumnoId, alumno_id, sala_id, estado, observacion, fecha } = req.body;

    const finalAlumnoId = alumno_id || alumnoId;
    const finalFecha = fecha || new Date().toISOString().split("T")[0];

    const [asistencia, created] = await Asistencia.findOrCreate({
      where: {
        alumno_id: finalAlumnoId,
        fecha: finalFecha
      },
      defaults: {
        alumno_id: finalAlumnoId,
        sala_id: sala_id || null,
        estado: estado || "presente",
        observacion: observacion || "",
        fecha: finalFecha
      }
    });

    if (!created) {
      asistencia.estado = estado || asistencia.estado;
      asistencia.observacion = observacion !== undefined ? observacion : asistencia.observacion;
      if (sala_id) asistencia.sala_id = sala_id;
      await asistencia.save();
    }

    res.status(201).json(asistencia);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
