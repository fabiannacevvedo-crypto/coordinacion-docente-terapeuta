import express from "express";
import bcrypt from "bcrypt";
import Usuario from "../models/Usuario.js";

const router = express.Router();

// Registro de usuario
router.post("/register", async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Encriptar contraseña
    const password_hash = await bcrypt.hash(password, 10);

    const nuevoUsuario = await Usuario.create({ nombre, email, password_hash });
    res.status(201).json({ mensaje: "Usuario registrado correctamente", usuario: nuevoUsuario });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al registrar usuario", error });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });

    const coincide = await bcrypt.compare(password, usuario.password_hash);
    if (!coincide) return res.status(401).json({ mensaje: "Contraseña incorrecta" });

    res.json({ mensaje: "Inicio de sesión exitoso", usuario });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al iniciar sesión", error });
  }
});

export default router;
