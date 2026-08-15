import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Alumno from "./alumno.js";

const Asistencia = sequelize.define("Asistencia", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  alumnoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  estado: {
    type: DataTypes.ENUM("presente", "ausente", "tarde"),
    defaultValue: "presente",
  },
  observacion: {
    type: DataTypes.STRING(255),
    allowNull: true,
  }
}, {
  tableName: "asistencias",
  timestamps: true,
});

Alumno.hasMany(Asistencia, { foreignKey: "alumnoId", as: "asistencias" });
Asistencia.belongsTo(Alumno, { foreignKey: "alumnoId", as: "alumno" });

export default Asistencia;
