import express from 'express';
import { crearContenido, obtenerContenidos } from '../controllers/contenido.controller.js';

const router = express.Router();

router.post('/crear', crearContenido);
router.get('/listar', obtenerContenidos);

export default router;
