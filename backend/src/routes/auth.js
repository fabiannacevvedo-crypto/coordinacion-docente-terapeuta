import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Usuario from "../models/usuario.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "clave_secreta_rednec";

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { nombre, email, password, contrasena, rol, matricula } = req.body;
    const pass = password || contrasena;

    if (!nombre || !email || !pass) {
      return res.status(400).json({
        msg: "Por favor, completa todos los campos requeridos (nombre, email, contraseña)."
      });
    }

    const existe = await Usuario.findOne({ where: { email } });
    if (existe) {
      return res.status(400).json({
        msg: "El correo electrónico ya está registrado."
      });
    }

    const hash = await bcrypt.hash(pass, 10);

    const nuevo = await Usuario.create({
      nombre,
      email,
      password_hash: hash,
      rol: rol || "familiar",
      matricula: matricula || null
    });

    res.status(201).json({
      msg: "Usuario registrado con éxito.",
      usuario: {
        id: nuevo.id,
        nombre: nuevo.nombre,
        email: nuevo.email,
        rol: nuevo.rol
      }
    });
  } catch (err) {
    console.error("Error en registro:", err);
    res.status(500).json({
      msg: "Error al registrar el usuario.",
      error: err.message
    });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password, contrasena } = req.body;
    const pass = password || contrasena;

    if (!email || !pass) {
      return res.status(400).json({
        msg: "Por favor, ingresa tu email y contraseña."
      });
    }

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(400).json({
        msg: "Usuario o contraseña incorrectos."
      });
    }

    const valido = await bcrypt.compare(pass, usuario.password_hash);
    if (!valido) {
      return res.status(401).json({
        msg: "Usuario o contraseña incorrectos."
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      msg: "Inicio de sesión exitoso.",
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({
      msg: "Error al iniciar sesión.",
      error: err.message
    });
  }
});

export default router;