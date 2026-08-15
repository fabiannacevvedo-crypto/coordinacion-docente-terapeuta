import express from "express";
import Tarea from "../models/tarea.js";
import Alumno from "../models/alumno.js";

const router = express.Router();

// Listar tareas (con filtro opcional por tipo o alumno)
router.get("/", async (req, res) => {
  try {
    const { tipo, alumnoId } = req.query;
    const where = {};
    if (tipo) where.tipo = tipo;
    if (alumnoId) where.alumnoId = alumnoId;

    const tareas = await Tarea.findAll({
      where,
      include: [{ model: Alumno, as: "alumno" }],
      order: [["createdAt", "DESC"]]
    });
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ msg: "Error al listar tareas", error: error.message });
  }
});

// Crear nueva tarea escolar o terapéutica
router.post("/", async (req, res) => {
  try {
    const { titulo, descripcion, tipo, area, fecha_limite, alumnoId, creador_nombre } = req.body;
    if (!titulo || !descripcion) {
      return res.status(400).json({ msg: "Título y descripción son obligatorios." });
    }

    const nueva = await Tarea.create({
      titulo,
      descripcion,
      tipo: tipo || "docente",
      area: area || "General",
      fecha_limite: fecha_limite || null,
      alumnoId: alumnoId || null,
      creador_nombre: creador_nombre || "Docente / Terapeuta"
    });

    res.status(201).json(nueva);
  } catch (error) {
    res.status(500).json({ msg: "Error al crear tarea", error: error.message });
  }
});

// Alternar estado de completada
router.patch("/:id/toggle", async (req, res) => {
  try {
    const tarea = await Tarea.findByPk(req.params.id);
    if (!tarea) return res.status(404).json({ msg: "Tarea no encontrada" });

    await tarea.update({ completada: !tarea.completada });
    res.json({ msg: "Estado de tarea actualizado", tarea });
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar tarea", error: error.message });
  }
});

// Eliminar tarea
router.delete("/:id", async (req, res) => {
  try {
    const tarea = await Tarea.findByPk(req.params.id);
    if (!tarea) return res.status(404).json({ msg: "Tarea no encontrada" });

    await tarea.destroy();
    res.json({ msg: "Tarea eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar tarea", error: error.message });
  }
});

export default router;
