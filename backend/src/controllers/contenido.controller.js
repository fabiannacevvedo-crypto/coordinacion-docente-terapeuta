import Contenido from "../models/contenido.js";

export const crearContenido = async (req, res) => {
  try {
    const nuevoContenido = await Contenido.create(req.body);
    res.status(201).json({ mensaje: "Contenido agregado", contenido: nuevoContenido });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear contenido", error: error.message });
  }
};

export const obtenerContenidos = async (req, res) => {
  try {
    const contenidos = await Contenido.findAll();
    res.json(contenidos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener contenidos", error: error.message });
  }
};
