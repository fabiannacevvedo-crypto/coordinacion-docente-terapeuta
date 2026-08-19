import express from "express";
import { listarJardines, crearJardin } from "../controllers/jardin.controller.js";
import { verificarTokenOpcional } from "../middleware/auth.js";

const router = express.Router();

router.get("/", listarJardines);
router.post("/", verificarTokenOpcional, crearJardin);

export default router;
