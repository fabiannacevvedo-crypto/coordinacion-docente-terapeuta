import express from "express";
import Comunicacion from "../models/comunicacion.js";
import Alumno from "../models/alumno.js";

const router = express.Router();

// Listar todas las comunicaciones y saludos
router.get("/", async (req, res) => {
  try {
    const mensajes = await Comunicacion.findAll({
      include: [{ model: Alumno, as: "alumno" }],
      order: [["createdAt", "DESC"]]
    });
    res.json(mensajes);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener comunicaciones", error: error.message });
  }
});

// Publicar un saludo, aviso o nota diaria
router.post("/", async (req, res) => {
  try {
    const { remitente_nombre, remitente_rol, tipo, titulo, mensaje, alumnoId } = req.body;
    if (!remitente_nombre || !titulo || !mensaje) {
      return res.status(400).json({ msg: "Nombre de remitente, título y mensaje son requeridos." });
    }

    const nuevo = await Comunicacion.create({
      remitente_nombre,
      remitente_rol: remitente_rol || "docente",
      tipo: tipo || "saludo",
      titulo,
      mensaje,
      alumnoId: alumnoId || null
    });

    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ msg: "Error al publicar mensaje", error: error.message });
  }
});

export default router;
