import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Usuario from "../models/usuario.js";
import Alumno from "../models/alumno.js";

const JWT_SECRET = process.env.JWT_SECRET || "rednec_super_secret_jwt_key_2026";

/**
 * Genera un token JWT para un usuario.
 */
function generarToken(usuario) {
  return jwt.sign(
    {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      matricula: usuario.matricula
    },
    JWT_SECRET,
    { expiresIn: "12h" }
  );
}

// POST /api/auth/register
export async function registrar(req, res) {
  try {
    const { nombre, email, password, contrasena, rol, matricula, telefono } = req.body;
    const pass = password || contrasena;

    if (!nombre || !email || !pass) {
      return res.status(400).json({
        msg: "Por favor, completa todos los campos requeridos (nombre, email, contraseña)."
      });
    }

    const emailNormalizado = email.trim().toLowerCase();
    const existe = await Usuario.findOne({ where: { email: emailNormalizado } });
    if (existe) {
      return res.status(400).json({
        msg: "El correo electrónico ya está registrado."
      });
    }

    const hash = await bcrypt.hash(pass, 10);
    const nuevoUsuario = await Usuario.create({
      nombre: nombre.trim(),
      email: emailNormalizado,
      password_hash: hash,
      rol: rol || "familiar",
      matricula: matricula ? matricula.trim() : null,
      telefono: telefono ? telefono.trim() : null
    });

    const token = generarToken(nuevoUsuario);

    return res.status(201).json({
      msg: "¡Usuario registrado con éxito!",
      token,
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol,
        matricula: nuevoUsuario.matricula
      }
    });
  } catch (error) {
    console.error("Error en registro:", error);
    return res.status(500).json({
      msg: "Error al registrar el usuario.",
      error: error.message
    });
  }
}

// POST /api/auth/login
export async function login(req, res) {
  try {
    const { email, password, contrasena } = req.body;
    const pass = password || contrasena;

    if (!email || !pass) {
      return res.status(400).json({
        msg: "Por favor, ingresa tu correo electrónico y contraseña."
      });
    }

    const emailNormalizado = email.trim().toLowerCase();
    const usuario = await Usuario.findOne({ where: { email: emailNormalizado } });
    if (!usuario) {
      return res.status(401).json({
        msg: "Credenciales inválidas. Verifica tu correo o contraseña."
      });
    }

    const passwordValido = await bcrypt.compare(pass, usuario.password_hash);
    if (!passwordValido) {
      return res.status(401).json({
        msg: "Credenciales inválidas. Verifica tu correo o contraseña."
      });
    }

    const token = generarToken(usuario);

    return res.json({
      msg: "Inicio de sesión exitoso.",
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        matricula: usuario.matricula
      }
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({
      msg: "Error al iniciar sesión.",
      error: error.message
    });
  }
}

// POST /api/auth/demo-login
export async function loginDemo(req, res) {
  try {
    const { rol = "terapeuta" } = req.body;
    const usuario = await Usuario.findOne({ where: { rol } });

    if (!usuario) {
      return res.status(404).json({
        msg: `No se encontró un usuario de demostración con rol '${rol}'.`
      });
    }

    const token = generarToken(usuario);

    return res.json({
      msg: `Acceso demo exitoso como ${usuario.nombre} (${usuario.rol}).`,
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        matricula: usuario.matricula
      }
    });
  } catch (error) {
    console.error("Error en login demo:", error);
    return res.status(500).json({
      msg: "Error al realizar login demo.",
      error: error.message
    });
  }
}

// GET /api/auth/perfil
export async function obtenerPerfil(req, res) {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, {
      attributes: ["id", "nombre", "email", "rol", "matricula", "telefono", "created_at"]
    });

    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado." });
    }

    return res.json({
      msg: "Perfil obtenido con éxito.",
      usuario
    });
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    return res.status(500).json({ msg: "Error al consultar perfil.", error: error.message });
  }
}

// GET /api/auth/alumnos
export async function listarAlumnos(req, res) {
  try {
    const alumnos = await Alumno.findAll({
      order: [["nombre", "ASC"]]
    });
    return res.json(alumnos);
  } catch (error) {
    console.error("Error al listar alumnos:", error);
    return res.status(500).json({ msg: "Error al obtener alumnos.", error: error.message });
  }
}

// GET /api/auth/usuarios
export async function listarUsuarios(req, res) {
  try {
    const { rol } = req.query;
    const where = {};
    if (rol) where.rol = rol;

    const usuarios = await Usuario.findAll({
      where,
      attributes: ["id", "nombre", "email", "rol", "matricula"]
    });
    return res.json(usuarios);
  } catch (error) {
    console.error("Error al listar usuarios:", error);
    return res.status(500).json({ msg: "Error al obtener usuarios.", error: error.message });
  }
}
