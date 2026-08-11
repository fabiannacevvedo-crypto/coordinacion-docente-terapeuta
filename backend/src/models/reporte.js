import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Usuario from "./Usuario.js";

const Reporte = sequelize.define("Reporte", {
  progreso: { type: DataTypes.INTEGER, allowNull: false },
  observaciones: { type: DataTypes.TEXT },
  estado: { type: DataTypes.ENUM("bueno", "regular", "atencion"), defaultValue: "regular" }
});

Usuario.hasMany(Reporte, { foreignKey: "alumnoId" });
Reporte.belongsTo(Usuario, { foreignKey: "alumnoId" });

export default Reporte;
