import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Jardin = sequelize.define(
  "Jardin",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    direccion: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    localidad: {
      type: DataTypes.STRING(100),
      defaultValue: "Formosa",
    },
    telefono: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    cantidad_aulas: {
      type: DataTypes.INTEGER,
      defaultValue: 6,
    }
  },
  {
    tableName: "jardines",
    timestamps: true,
  }
);

export default Jardin;
