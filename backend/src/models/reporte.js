import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Alumno from "./alumno.js";

const Reporte = sequelize.define("Reporte", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  titulo: {
    type: DataTypes.STRING(150),
    allowNull: true,
    defaultValue: "Reporte de Evolución Pedagógica / Terapéutica",
  },
  progreso: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 50,
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  estado: {
    type: DataTypes.ENUM("bueno", "regular", "atencion"),
    defaultValue: "regular",
  },
  imagen_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  alumnoId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  terapeutaId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }
}, {
  tableName: "reportes",
  timestamps: true,
});

// Relación con Alumno
Alumno.hasMany(Reporte, { foreignKey: "alumnoId", as: "reportes" });
Reporte.belongsTo(Alumno, { foreignKey: "alumnoId", as: "alumno" });

export default Reporte;
