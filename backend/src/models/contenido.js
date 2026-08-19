import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Contenido = sequelize.define(
  "Contenido",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    categoria: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "General",
    },
    urlRecurso: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: "url_recurso",
    },
    autor: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "Equipo RED NEC",
    },
    icono: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "bi-file-earmark-text",
    }
  },
  {
    tableName: "contenidos",
    timestamps: true,
  }
);

export default Contenido;
