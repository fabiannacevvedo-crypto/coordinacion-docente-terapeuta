import express from "express";
import Tarea from "../models/tarea.js";
import Alumno from "../models/alumno.js";
import Sala from "../models/sala.js";
import { verificarTokenOpcional } from "../middleware/auth.js";

const router = express.Router();

// GET /api/tareas?tipo=...&sala_id=...
router.get("/", async (req, res) => {
  try {
    const { tipo, sala_id, alumno_id } = req.query;
    const where = {};
    if (tipo) where.tipo = tipo;
    if (sala_id) where.sala_id = sala_id;
    if (alumno_id) where.alumno_id = alumno_id;

    const tareas = await Tarea.findAll({
      where,
      include: [
        { model: Alumno, as: "Alumno", attributes: ["id", "nombre", "apellido"], required: false },
        { model: Sala, as: "Sala", attributes: ["id", "nombre", "color"], required: false }
      ],
      order: [["created_at", "DESC"]]
    });
    res.json(tareas);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/tareas
router.post("/", verificarTokenOpcional, async (req, res) => {
  try {
    const {
      titulo,
      descripcion,
      materia,
      duracion_minutos,
      tipo,
      sala_id,
      alumno_id,
      alumnoId,
      fecha_limite,
      creador_nombre
    } = req.body;

    if (!titulo) {
      return res.status(400).json({ msg: "El título de la tarea es obligatorio" });
    }

    const tarea = await Tarea.create({
      titulo: titulo.trim(),
      descripcion: descripcion || "",
      materia: materia || "Expresión Plástica y Lenguaje",
      duracion_minutos: Number(duracion_minutos) || 30,
      tipo: tipo || "docente",
      sala_id: sala_id ? Number(sala_id) : null,
      alumno_id: alumno_id || alumnoId || null,
      fecha_limite: fecha_limite || null,
      creador_nombre: creador_nombre || (req.usuario?.nombre) || "Docente Titular",
      completada: false
    });

    res.status(201).json(tarea);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /api/tareas/:id/toggle
router.patch("/:id/toggle", verificarTokenOpcional, async (req, res) => {
  try {
    const tarea = await Tarea.findByPk(req.params.id);
    if (!tarea) return res.status(404).json({ msg: "Tarea no encontrada" });
    tarea.completada = !tarea.completada;
    await tarea.save();
    res.json(tarea);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/tareas/:id
router.delete("/:id", verificarTokenOpcional, async (req, res) => {
  try {
    const tarea = await Tarea.findByPk(req.params.id);
    if (!tarea) return res.status(404).json({ msg: "Tarea no encontrada" });
    await tarea.destroy();
    res.json({ msg: "Tarea eliminada exitosamente" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
