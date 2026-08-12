import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Usuario from "./Usuario.js";

const Reporte = sequelize.define("Reporte", {
  progreso: { type: DataTypes.INTEGER, allowNull: false },
  observaciones: { type: DataTypes.TEXT },
  estado: { type: DataTypes.ENUM("bueno", "regular", "atencion"), defaultValue: "regular" }
}, {
  tableName: "reportes"
});

// Relaciones
Usuario.hasMany(Reporte, { foreignKey: "alumnoId", as: "ReportesAlumno" });
Usuario.hasMany(Reporte, { foreignKey: "terapeutaId", as: "ReportesTerapeuta" });
Reporte.belongsTo(Usuario, { foreignKey: "alumnoId", as: "Alumno" });
Reporte.belongsTo(Usuario, { foreignKey: "terapeutaId", as: "Terapeuta" });

export default Reporte;
