import express from "express";
import { enviarMensaje, listarMensajes } from "../controllers/contacto.controller.js";

const router = express.Router();

router.post("/", enviarMensaje);
router.post("/enviar", enviarMensaje);
router.get("/listar", listarMensajes);

export default router;
