import Jardin from "../models/jardin.js";
import Sala from "../models/sala.js";

export async function listarJardines(req, res) {
  try {
    const jardines = await Jardin.findAll({
      include: [{ model: Sala, as: "Salas" }],
      order: [["nombre", "ASC"]]
    });
    res.json(jardines);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function crearJardin(req, res) {
  try {
    const { nombre, direccion, localidad, telefono, cantidad_aulas } = req.body;
    if (!nombre) {
      return res.status(400).json({ msg: "El nombre del jardín es obligatorio" });
    }
    const jardin = await Jardin.create({
      nombre: nombre.trim(),
      direccion,
      localidad: localidad || "Formosa",
      telefono,
      cantidad_aulas: Number(cantidad_aulas) || 6
    });
    res.status(201).json(jardin);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
