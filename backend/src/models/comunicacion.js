import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Alumno from "./alumno.js";

const Comunicacion = sequelize.define("Comunicacion", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  remitente_nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  remitente_rol: {
    type: DataTypes.ENUM("docente", "terapeuta", "familiar", "institucional"),
    defaultValue: "docente",
  },
  tipo: {
    type: DataTypes.ENUM("saludo", "nota_diaria", "aviso_importante", "sugerencia_terapeutica"),
    defaultValue: "saludo",
  },
  titulo: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  mensaje: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  alumnoId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }
}, {
  tableName: "comunicaciones",
  timestamps: true,
});

Alumno.hasMany(Comunicacion, { foreignKey: "alumnoId", as: "comunicaciones" });
Comunicacion.belongsTo(Alumno, { foreignKey: "alumnoId", as: "alumno" });

export default Comunicacion;
