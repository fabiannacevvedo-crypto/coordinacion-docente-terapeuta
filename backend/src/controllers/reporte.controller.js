import { Op } from "sequelize";
import Reporte from "../models/reporte.js";
import Alumno from "../models/alumno.js";
import Usuario from "../models/usuario.js";

// GET /api/reportes/listar
export async function obtenerReportes(req, res) {
  try {
    const { alumno_id, estado, area, busqueda } = req.query;
    const where = {};

    if (alumno_id) {
      where.alumno_id = alumno_id;
    }
    if (estado && estado !== "todos") {
      where.estado = estado;
    }
    if (area && area !== "todas") {
      where.area = area;
    }
    if (busqueda) {
      where[Op.or] = [
        { observaciones: { [Op.like]: `%${busqueda}%` } },
        { alumno_nombre: { [Op.like]: `%${busqueda}%` } },
        { autor_nombre: { [Op.like]: `%${busqueda}%` } },
        { area: { [Op.like]: `%${busqueda}%` } }
      ];
    }

    const reportes = await Reporte.findAll({
      where,
      include: [
        {
          model: Alumno,
          as: "Alumno",
          attributes: ["id", "nombre", "apellido", "grado", "diagnostico", "tutor_nombre"],
          required: false
        }
      ],
      order: [["created_at", "DESC"]]
    });

    return res.json(reportes);
  } catch (error) {
    console.error("Error al obtener reportes:", error);
    return res.status(500).json({ mensaje: "Error al obtener reportes", error: error.message });
  }
}

// GET /api/reportes/estadisticas
export async function obtenerEstadisticas(req, res) {
  try {
    const reportes = await Reporte.findAll();
    const alumnos = await Alumno.findAll();

    const totalReportes = reportes.length;
    const totalAlumnos = alumnos.length;

    let totalProgreso = 0;
    const estados = { bueno: 0, regular: 0, atencion: 0 };
    const porArea = {};

    reportes.forEach(r => {
      totalProgreso += (r.progreso || 0);
      if (estados[r.estado] !== undefined) {
        estados[r.estado]++;
      }
      const area = r.area || "General";
      porArea[area] = (porArea[area] || 0) + 1;
    });

    const promedioProgreso = totalReportes > 0 ? Math.round(totalProgreso / totalReportes) : 0;
    const totalObservaciones = reportes.filter(r => r.observaciones && r.observaciones.trim().length > 0).length;

    return res.json({
      totalAlumnos,
      totalReportes,
      totalObservaciones,
      promedioProgreso,
      estados,
      porArea
    });
  } catch (error) {
    console.error("Error al calcular estadísticas:", error);
    return res.status(500).json({ mensaje: "Error al calcular estadísticas", error: error.message });
  }
}

// GET /api/reportes/:id
export async function obtenerReportePorId(req, res) {
  try {
    const reporte = await Reporte.findByPk(req.params.id, {
      include: [{ model: Alumno, as: "Alumno" }]
    });
    if (!reporte) {
      return res.status(404).json({ mensaje: "Reporte no encontrado." });
    }
    return res.json(reporte);
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al consultar reporte", error: error.message });
  }
}

// POST /api/reportes/crear
export async function crearReporte(req, res) {
  try {
    const {
      alumno_id,
      alumnoId,
      progreso,
      observaciones,
      estado,
      area,
      autor_nombre,
      terapeuta_id,
      docente_id
    } = req.body;

    const finalAlumnoId = alumno_id || alumnoId;
    if (!finalAlumnoId) {
      return res.status(400).json({ mensaje: "El ID del alumno es obligatorio." });
    }

    // Resolver datos del alumno si existe
    let alumnoNombre = req.body.alumno_nombre;
    const alumnoEncontrado = await Alumno.findByPk(finalAlumnoId);
    if (alumnoEncontrado) {
      alumnoNombre = `${alumnoEncontrado.nombre} ${alumnoEncontrado.apellido}`;
    }

    // Resolver autor desde usuario autenticado o body
    let autorFinal = autor_nombre;
    let finalTerapeutaId = terapeuta_id;
    let finalDocenteId = docente_id;

    if (req.usuario) {
      autorFinal = autorFinal || req.usuario.nombre;
      if (req.usuario.rol === "terapeuta") {
        finalTerapeutaId = req.usuario.id;
      } else if (req.usuario.rol === "docente") {
        finalDocenteId = req.usuario.id;
      }
    }

    const nuevoReporte = await Reporte.create({
      alumno_id: finalAlumnoId,
      alumno_nombre: alumnoNombre || `Alumno ${finalAlumnoId}`,
      progreso: Number(progreso) || 0,
      observaciones: observaciones ? observaciones.trim() : "",
      estado: estado || "regular",
      area: area || "Seguimiento General",
      autor_nombre: autorFinal || "Profesional RED NEC",
      terapeuta_id: finalTerapeutaId || null,
      docente_id: finalDocenteId || null,
      fecha_reporte: new Date()
    });

    return res.status(201).json({
      mensaje: "Reporte creado exitosamente",
      reporte: nuevoReporte
    });
  } catch (error) {
    console.error("Error al crear reporte:", error);
    return res.status(500).json({ mensaje: "Error al crear el reporte", error: error.message });
  }
}

// PUT /api/reportes/:id
export async function actualizarReporte(req, res) {
  try {
    const reporte = await Reporte.findByPk(req.params.id);
    if (!reporte) {
      return res.status(404).json({ mensaje: "Reporte no encontrado." });
    }

    const { progreso, observaciones, estado, area } = req.body;
    if (progreso !== undefined) reporte.progreso = Number(progreso);
    if (observaciones !== undefined) reporte.observaciones = observaciones;
    if (estado !== undefined) reporte.estado = estado;
    if (area !== undefined) reporte.area = area;

    await reporte.save();
    return res.json({ mensaje: "Reporte actualizado con éxito", reporte });
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al actualizar reporte", error: error.message });
  }
}

// DELETE /api/reportes/:id
export async function eliminarReporte(req, res) {
  try {
    const reporte = await Reporte.findByPk(req.params.id);
    if (!reporte) {
      return res.status(404).json({ mensaje: "Reporte no encontrado." });
    }

    await reporte.destroy();
    return res.json({ mensaje: "Reporte eliminado correctamente." });
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al eliminar reporte", error: error.message });
  }
}
