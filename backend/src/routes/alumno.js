import express from "express";
import Alumno from "../models/alumno.js";
import { verificarTokenOpcional } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const alumnos = await Alumno.findAll({ order: [["nombre", "ASC"]] });
    res.json(alumnos);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/", verificarTokenOpcional, async (req, res) => {
  try {
    const nuevo = await Alumno.create(req.body);
    res.status(201).json(nuevo);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
