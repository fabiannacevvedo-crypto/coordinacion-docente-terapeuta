import Reporte from "../models/Reporte.js";

export const obtenerReportes = async (req, res) => {
  try {
    const reportes = await Reporte.findAll();
    res.json(reportes);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener reportes", error });
  }
};

export const crearReporte = async (req, res) => {
  try {
    const nuevo = await Reporte.create(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear reporte", error });
  }
};
