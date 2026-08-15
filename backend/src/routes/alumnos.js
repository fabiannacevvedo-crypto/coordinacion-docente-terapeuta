import express from "express";
import Alumno from "../models/alumno.js";
import Asistencia from "../models/asistencia.js";
import Tarea from "../models/tarea.js";
import Reporte from "../models/reporte.js";

const router = express.Router();

// Listar todos los alumnos
router.get("/", async (req, res) => {
  try {
    const alumnos = await Alumno.findAll({
      include: [
        { model: Asistencia, as: "asistencias", limit: 5, order: [["fecha", "DESC"]] },
        { model: Tarea, as: "tareas" }
      ],
      order: [["nombre", "ASC"]]
    });
    res.json(alumnos);
  } catch (error) {
    res.status(500).json({ msg: "Error al listar alumnos", error: error.message });
  }
});

// Obtener detalle de alumno por ID
router.get("/:id", async (req, res) => {
  try {
    const alumno = await Alumno.findByPk(req.params.id, {
      include: [
        { model: Asistencia, as: "asistencias" },
        { model: Tarea, as: "tareas" }
      ]
    });
    if (!alumno) return res.status(404).json({ msg: "Alumno no encontrado" });
    res.json(alumno);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener alumno", error: error.message });
  }
});

// Crear nuevo alumno
router.post("/", async (req, res) => {
  try {
    const { nombre, apellido, edad, sala_grado, foto_url, diagnostico, tutor_nombre, tutor_contacto } = req.body;
    if (!nombre || !apellido || !edad) {
      return res.status(400).json({ msg: "Nombre, apellido y edad son requeridos." });
    }
    const nuevo = await Alumno.create({
      nombre,
      apellido,
      edad,
      sala_grado,
      foto_url: foto_url || "https://images.unsplash.com/photo-1543332164-6e82f355badc?w=150&auto=format&fit=crop&q=80",
      diagnostico,
      tutor_nombre,
      tutor_contacto
    });
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ msg: "Error al crear alumno", error: error.message });
  }
});

// Actualizar alumno
router.put("/:id", async (req, res) => {
  try {
    const alumno = await Alumno.findByPk(req.params.id);
    if (!alumno) return res.status(404).json({ msg: "Alumno no encontrado" });
    await alumno.update(req.body);
    res.json(alumno);
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar alumno", error: error.message });
  }
});

export default router;
