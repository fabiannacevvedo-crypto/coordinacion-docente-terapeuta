import { DataTypes } from "sequelize";
import { sequelize } from "../config/data.base.js";

const familiar = sequelize.define("familiar", {
  name: { type: DataTypes.STRING, allowNull: false },
  apellido: { type: DataTypes.STRING, allowNull: true },
  email: { type: DataTypes.STRING, allowNull: true },
  fecha_nacimiento: { type: DataTypes.DATEONLY, allowNull: false },
  edad: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
}, {
  tableName: "familiar",
  timestamps: true
});

export default familiar;
