import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Alumno from "./alumno.js";
import Sala from "./sala.js";
import Usuario from "./usuario.js";

const Tarea = sequelize.define("Tarea", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  titulo: { type: DataTypes.STRING(200), allowNull: false },
  descripcion: { type: DataTypes.TEXT, allowNull: true },
  materia: { type: DataTypes.STRING(100), defaultValue: "Expresión Plástica y Lenguaje" },
  duracion_minutos: { type: DataTypes.INTEGER, defaultValue: 30 },
  tipo: { type: DataTypes.STRING(50), defaultValue: "docente" },
  es_interdisciplinaria: { type: DataTypes.BOOLEAN, defaultValue: false },
  objetivo_terapeutico: { type: DataTypes.TEXT, allowNull: true },
  completada: { type: DataTypes.BOOLEAN, defaultValue: false },
  sala_id: { type: DataTypes.INTEGER, allowNull: true },
  alumno_id: { type: DataTypes.INTEGER, allowNull: true },
  docente_id: { type: DataTypes.INTEGER, allowNull: true },
  terapeuta_id: { type: DataTypes.INTEGER, allowNull: true },
  fecha_limite: { type: DataTypes.DATEONLY, allowNull: true },
  creador_nombre: { type: DataTypes.STRING(100), defaultValue: "Docente Titular" },
  terapeuta_nombre: { type: DataTypes.STRING(100), allowNull: true }
}, { tableName: "tareas", timestamps: true });

Sala.hasMany(Tarea, { foreignKey: "sala_id", as: "Tareas" });
Tarea.belongsTo(Sala, { foreignKey: "sala_id", as: "Sala" });

Alumno.hasMany(Tarea, { foreignKey: "alumno_id", as: "Tareas" });
Tarea.belongsTo(Alumno, { foreignKey: "alumno_id", as: "Alumno" });

Usuario.hasMany(Tarea, { foreignKey: "terapeuta_id", as: "TareasTerapeuta" });
Tarea.belongsTo(Usuario, { foreignKey: "terapeuta_id", as: "Terapeuta" });

export default Tarea;
