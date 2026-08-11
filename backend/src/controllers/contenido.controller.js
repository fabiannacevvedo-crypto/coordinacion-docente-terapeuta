import Contenido from '../models/contenido.js';

export const crearContenido = async (req, res) => {
  try {
    const nuevoContenido = new Contenido(req.body);
    await nuevoContenido.save();
    res.status(201).json({ mensaje: 'Contenido agregado', contenido: nuevoContenido });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear contenido', error });
  }
};

export const obtenerContenidos = async (req, res) => {
  try {
    const contenidos = await Contenido.find();
    res.json(contenidos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener contenidos', error });
  }
};
