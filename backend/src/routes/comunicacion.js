import express from "express";
import Comunicacion from "../models/comunicacion.js";
import { verificarTokenOpcional } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const comunicaciones = await Comunicacion.findAll({ order: [["created_at", "DESC"]] });
    res.json(comunicaciones);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/", verificarTokenOpcional, async (req, res) => {
  try {
    const comunicacion = await Comunicacion.create(req.body);
    res.status(201).json(comunicacion);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
