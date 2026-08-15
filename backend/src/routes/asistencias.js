import express from "express";
import Asistencia from "../models/asistencia.js";
import Alumno from "../models/alumno.js";

const router = express.Router();

// Obtener asistencias por fecha (por defecto hoy)
router.get("/fecha", async (req, res) => {
  try {
    const fecha = req.query.fecha || new Date().toISOString().split("T")[0];
    const asistencias = await Asistencia.findAll({
      where: { fecha },
      include: [{ model: Alumno, as: "alumno" }]
    });
    res.json(asistencias);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener asistencias", error: error.message });
  }
});

// Registrar o actualizar asistencia de un alumno para una fecha
router.post("/", async (req, res) => {
  try {
    const { alumnoId, estado, observacion, fecha } = req.body;
    const fechaRegistro = fecha || new Date().toISOString().split("T")[0];

    if (!alumnoId || !estado) {
      return res.status(400).json({ msg: "Alumno y estado son requeridos." });
    }

    let asistencia = await Asistencia.findOne({
      where: { alumnoId, fecha: fechaRegistro }
    });

    if (asistencia) {
      await asistencia.update({ estado, observacion });
    } else {
      asistencia = await Asistencia.create({
        alumnoId,
        fecha: fechaRegistro,
        estado,
        observacion
      });
    }

    res.json({ msg: "Asistencia registrada correctamente", asistencia });
  } catch (error) {
    res.status(500).json({ msg: "Error al registrar asistencia", error: error.message });
  }
});

export default router;
