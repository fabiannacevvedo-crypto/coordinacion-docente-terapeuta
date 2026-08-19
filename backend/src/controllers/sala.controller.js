import Sala from "../models/sala.js";
import Jardin from "../models/jardin.js";
import Usuario from "../models/usuario.js";
import Alumno from "../models/alumno.js";
import DocenteSala from "../models/docente_sala.js";

export async function listarSalas(req, res) {
  try {
    const { jardin_id } = req.query;
    const where = {};
    if (jardin_id) where.jardin_id = jardin_id;

    const salas = await Sala.findAll({
      where,
      include: [
        { model: Jardin, as: "Jardin", attributes: ["id", "nombre", "cantidad_aulas"] },
        { model: Usuario, as: "DocenteTitular", attributes: ["id", "nombre", "email", "matricula"] },
        { model: Usuario, as: "TerapeutaAsignado", attributes: ["id", "nombre", "email", "matricula"] },
        { model: Alumno, as: "Alumnos", attributes: ["id", "nombre", "apellido", "diagnostico"] }
      ],
      order: [["nombre", "ASC"]]
    });
    res.json(salas);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function crearSala(req, res) {
  try {
    const { nombre, edad_grupo, color, turno, capacidad, jardin_id, docente_titular_id, terapeuta_asignado_id } = req.body;

    if (!nombre) {
      return res.status(400).json({ msg: "El nombre de la sala es obligatorio." });
    }

    const docenteId = docente_titular_id || (req.usuario?.rol === "docente" ? req.usuario.id : 1);
    const terapeutaId = terapeuta_asignado_id ? Number(terapeuta_asignado_id) : 2;

    const sala = await Sala.create({
      nombre: nombre.trim(),
      edad_grupo: edad_grupo || "4 Años",
      color: color || "#eab308",
      turno: turno || "mañana",
      capacidad: Number(capacidad) || 20,
      jardin_id: jardin_id ? Number(jardin_id) : null,
      docente_titular_id: docenteId,
      terapeuta_asignado_id: terapeutaId
    });

    if (docenteId) {
      await DocenteSala.findOrCreate({
        where: { docente_id: docenteId, sala_id: sala.id },
        defaults: { docente_id: docenteId, sala_id: sala.id, rol_en_sala: "titular" }
      });
    }

    const salaCompleta = await Sala.findByPk(sala.id, {
      include: [
        { model: Jardin, as: "Jardin" },
        { model: Usuario, as: "DocenteTitular" },
        { model: Usuario, as: "TerapeutaAsignado" },
        { model: Alumno, as: "Alumnos" }
      ]
    });

    res.status(201).json(salaCompleta);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function misSalasDocente(req, res) {
  try {
    const docenteId = req.usuario.id;
    const salas = await Sala.findAll({
      where: { docente_titular_id: docenteId },
      include: [
        { model: Jardin, as: "Jardin" },
        { model: Usuario, as: "TerapeutaAsignado" },
        { model: Alumno, as: "Alumnos" }
      ]
    });
    res.json(salas);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
