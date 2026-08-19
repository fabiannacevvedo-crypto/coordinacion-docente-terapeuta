import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Comunicacion = sequelize.define("Comunicacion", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  remitente: { type: DataTypes.STRING(100), allowNull: false },
  destinatario: { type: DataTypes.STRING(100), allowNull: false },
  rol_remitente: { type: DataTypes.STRING(50), defaultValue: "docente" },
  mensaje: { type: DataTypes.TEXT, allowNull: false },
  alumno_nombre: { type: DataTypes.STRING(100), allowNull: true },
  leido: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { tableName: "comunicaciones", timestamps: true });

export default Comunicacion;
