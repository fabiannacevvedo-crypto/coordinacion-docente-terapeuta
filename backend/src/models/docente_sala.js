import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Usuario from "./usuario.js";
import Sala from "./sala.js";

const DocenteSala = sequelize.define(
  "DocenteSala",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    docente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sala_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rol_en_sala: {
      type: DataTypes.STRING(50),
      defaultValue: "titular", // titular, auxiliar, terapeuta_apoyo
    }
  },
  {
    tableName: "docente_salas",
    timestamps: true,
  }
);

// Relaciones N a M
Usuario.belongsToMany(Sala, { through: DocenteSala, foreignKey: "docente_id", as: "SalasAsignadas" });
Sala.belongsToMany(Usuario, { through: DocenteSala, foreignKey: "sala_id", as: "DocentesAsignados" });

export default DocenteSala;
