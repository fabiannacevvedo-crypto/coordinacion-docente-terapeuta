import express from "express";
import { listarSalas, crearSala, misSalasDocente } from "../controllers/sala.controller.js";
import { verificarToken, verificarTokenOpcional } from "../middleware/auth.js";

const router = express.Router();

router.get("/", listarSalas);
router.get("/mis-salas", verificarToken, misSalasDocente);
router.post("/", verificarTokenOpcional, crearSala);

export default router;
