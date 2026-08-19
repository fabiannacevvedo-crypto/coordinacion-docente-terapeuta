import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Docente = sequelize.define("docente", {
  name: { type: DataTypes.STRING, allowNull: false },
  apellido: { type: DataTypes.STRING, allowNull: true },
  email: { type: DataTypes.STRING, allowNull: true },
  fecha_nacimiento: { type: DataTypes.DATEONLY, allowNull: true },
  edad: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  cargo: { type: DataTypes.STRING, allowNull: true }
}, {
  tableName: "docente",
  timestamps: true
});

export default Docente;