import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Alumno from "./alumno.js";
import Sala from "./sala.js";

const Asistencia = sequelize.define("Asistencia", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  alumno_id: { type: DataTypes.INTEGER, allowNull: false },
  sala_id: { type: DataTypes.INTEGER, allowNull: true },
  estado: { type: DataTypes.ENUM("presente", "ausente", "tarde", "justificado"), defaultValue: "presente" },
  observacion: { type: DataTypes.STRING(255), allowNull: true },
  fecha: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW }
}, { tableName: "asistencias", timestamps: true });

Alumno.hasMany(Asistencia, { foreignKey: "alumno_id", as: "Asistencias" });
Asistencia.belongsTo(Alumno, { foreignKey: "alumno_id", as: "Alumno" });

Sala.hasMany(Asistencia, { foreignKey: "sala_id", as: "Asistencias" });
Asistencia.belongsTo(Sala, { foreignKey: "sala_id", as: "Sala" });

export default Asistencia;
