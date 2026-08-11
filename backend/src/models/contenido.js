import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Contenido = sequelize.define("Contenido", {
  titulo: { type: DataTypes.STRING, allowNull: false },
  descripcion: { type: DataTypes.TEXT },
  categoria: { type: DataTypes.STRING },
  urlRecurso: { type: DataTypes.STRING }
});

export default Contenido;
