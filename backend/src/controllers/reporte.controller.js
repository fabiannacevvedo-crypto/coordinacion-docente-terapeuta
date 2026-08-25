import Reporte from "../models/reporte.js";
import Alumno from "../models/alumno.js";

export const obtenerReportes = async (req, res) => {
  try {
    const reportes = await Reporte.findAll({
      include: [
        {
          model: Alumno,
          as: "alumno",
          attributes: ["id", "nombre", "apellido", "edad", "sala_grado", "foto_url", "diagnostico", "tutor_nombre"],
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(reportes);
  } catch (error) {
    console.error("Error al obtener reportes:", error);
    res.status(500).json({ mensaje: "Error al obtener reportes", error: error.message });
  }
};

export const crearReporte = async (req, res) => {
  try {
    const { alumnoId, progreso, observaciones, estado, imagen_url, titulo, terapeutaId } = req.body;

    if (progreso === undefined || progreso === null || progreso === "") {
      return res.status(400).json({ mensaje: "El progreso es obligatorio (0-100)." });
    }

    const nuevo = await Reporte.create({
      alumnoId: alumnoId ? parseInt(alumnoId) : null,
      progreso: parseInt(progreso),
      observaciones: observaciones || "Sin observaciones adicionales",
      estado: estado || "regular",
      imagen_url: imagen_url || null,
      titulo: titulo || "Reporte de Seguimiento",
      terapeutaId: terapeutaId ? parseInt(terapeutaId) : null,
    });

    const reporteCompleto = await Reporte.findByPk(nuevo.id, {
      include: [
        {
          model: Alumno,
          as: "alumno",
          attributes: ["id", "nombre", "apellido", "edad", "sala_grado", "foto_url", "diagnostico", "tutor_nombre"],
          required: false,
        },
      ],
    });

    res.status(201).json(reporteCompleto || nuevo);
  } catch (error) {
    console.error("Error al crear reporte:", error);
    res.status(500).json({ mensaje: "Error al crear reporte", error: error.message });
  }
};

export const eliminarReporte = async (req, res) => {
  try {
    const { id } = req.params;
    const reporte = await Reporte.findByPk(id);
    if (!reporte) return res.status(404).json({ mensaje: "Reporte no encontrado" });

    await reporte.destroy();
    res.json({ mensaje: "Reporte eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar reporte", error: error.message });
  }
};
