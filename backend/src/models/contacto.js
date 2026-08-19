import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Contacto = sequelize.define(
  "Contacto",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    telefono: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    mensaje: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    leido: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  },
  {
    tableName: "contactos",
    timestamps: true,
  }
);

export default Contacto;
