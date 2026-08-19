import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Usuario from "./usuario.js";
import Alumno from "./alumno.js";

const Reporte = sequelize.define(
  "Reporte",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    alumno_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    alumno_nombre: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    terapeuta_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    docente_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    autor_nombre: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    area: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "Seguimiento General",
    },
    progreso: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 50,
      validate: {
        min: 0,
        max: 100,
      },
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    estado: {
      type: DataTypes.ENUM("bueno", "regular", "atencion"),
      defaultValue: "regular",
    },
    fecha_reporte: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    }
  },
  {
    tableName: "reportes",
    timestamps: true,
  }
);

// Relaciones
Alumno.hasMany(Reporte, { foreignKey: "alumno_id", as: "Reportes" });
Reporte.belongsTo(Alumno, { foreignKey: "alumno_id", as: "Alumno" });

Usuario.hasMany(Reporte, { foreignKey: "terapeuta_id", as: "ReportesCreados" });
Reporte.belongsTo(Usuario, { foreignKey: "terapeuta_id", as: "Terapeuta" });

export default Reporte;
