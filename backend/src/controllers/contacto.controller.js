import Contacto from "../models/contacto.js";

// POST /api/contacto
export async function enviarMensaje(req, res) {
  try {
    const { nombre, email, telefono, mensaje } = req.body;

    if (!nombre || !email || !mensaje) {
      return res.status(400).json({
        mensaje: "Por favor completa los campos obligatorios (nombre, correo y mensaje)."
      });
    }

    const nuevoMensaje = await Contacto.create({
      nombre: nombre.trim(),
      email: email.trim().toLowerCase(),
      telefono: telefono ? telefono.trim() : null,
      mensaje: mensaje.trim()
    });

    return res.status(201).json({
      mensaje: "¡Gracias por contactarte con RED NEC! Tu mensaje ha sido recibido y nos comunicaremos a la brevedad.",
      contacto: nuevoMensaje
    });
  } catch (error) {
    console.error("Error al guardar mensaje de contacto:", error);
    return res.status(500).json({
      mensaje: "Error interno al enviar el mensaje de contacto.",
      error: error.message
    });
  }
}

// GET /api/contacto/listar
export async function listarMensajes(req, res) {
  try {
    const mensajes = await Contacto.findAll({
      order: [["created_at", "DESC"]]
    });
    return res.json(mensajes);
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al listar mensajes", error: error.message });
  }
}
