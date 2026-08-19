import Contenido from "../models/contenido.js";

// GET /api/contenidos/listar
export async function obtenerContenidos(req, res) {
  try {
    const { categoria } = req.query;
    const where = {};
    if (categoria && categoria !== "todas") {
      where.categoria = categoria;
    }

    const contenidos = await Contenido.findAll({
      where,
      order: [["created_at", "DESC"]]
    });
    return res.json(contenidos);
  } catch (error) {
    console.error("Error al obtener contenidos:", error);
    return res.status(500).json({ mensaje: "Error al obtener contenidos", error: error.message });
  }
}

// POST /api/contenidos/crear
export async function crearContenido(req, res) {
  try {
    const { titulo, descripcion, categoria, urlRecurso, autor, icono } = req.body;

    if (!titulo || !descripcion) {
      return res.status(400).json({ mensaje: "El título y la descripción son obligatorios." });
    }

    const nuevoContenido = await Contenido.create({
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      categoria: categoria || "General",
      urlRecurso: urlRecurso ? urlRecurso.trim() : null,
      autor: autor || (req.usuario ? req.usuario.nombre : "Equipo RED NEC"),
      icono: icono || "bi-file-earmark-text"
    });

    return res.status(201).json({
      mensaje: "Recurso educativo agregado con éxito",
      contenido: nuevoContenido
    });
  } catch (error) {
    console.error("Error al crear contenido:", error);
    return res.status(500).json({ mensaje: "Error al crear contenido", error: error.message });
  }
}

// DELETE /api/contenidos/:id
export async function eliminarContenido(req, res) {
  try {
    const contenido = await Contenido.findByPk(req.params.id);
    if (!contenido) {
      return res.status(404).json({ mensaje: "Recurso no encontrado." });
    }
    await contenido.destroy();
    return res.json({ mensaje: "Recurso eliminado correctamente." });
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al eliminar recurso", error: error.message });
  }
}
