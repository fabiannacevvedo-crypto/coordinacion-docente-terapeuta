import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Alumno from "./alumno.js";

const Tarea = sequelize.define("Tarea", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  titulo: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  tipo: {
    type: DataTypes.ENUM("docente", "terapeutica", "compartida"),
    defaultValue: "docente",
  },
  area: {
    type: DataTypes.STRING(100),
    defaultValue: "Motricidad y Expresión",
  },
  fecha_limite: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  completada: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  alumnoId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Puede ser asignada a un alumno específico o general
  },
  creador_nombre: {
    type: DataTypes.STRING(100),
    defaultValue: "Docente / Terapeuta",
  }
}, {
  tableName: "tareas",
  timestamps: true,
});

Alumno.hasMany(Tarea, { foreignKey: "alumnoId", as: "tareas" });
Tarea.belongsTo(Alumno, { foreignKey: "alumnoId", as: "alumno" });

export default Tarea;
