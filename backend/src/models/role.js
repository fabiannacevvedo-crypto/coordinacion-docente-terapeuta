import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Role = sequelize.define("Role", {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  tableName: "roles",
  timestamps: false
});

export default Role;
