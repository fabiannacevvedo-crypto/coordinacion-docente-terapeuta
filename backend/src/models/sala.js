import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Jardin from "./jardin.js";
import Usuario from "./usuario.js";

const Sala = sequelize.define(
  "Sala",
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
    edad_grupo: {
      type: DataTypes.STRING(50),
      defaultValue: "4 Años",
    },
    color: {
      type: DataTypes.STRING(50),
      defaultValue: "#eab308", // Amarillo
    },
    turno: {
      type: DataTypes.ENUM("mañana", "tarde", "jornada_completa"),
      defaultValue: "mañana",
    },
    capacidad: {
      type: DataTypes.INTEGER,
      defaultValue: 20,
    },
    jardin_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    docente_titular_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  },
  {
    tableName: "salas",
    timestamps: true,
  }
);

// Relaciones
Jardin.hasMany(Sala, { foreignKey: "jardin_id", as: "Salas" });
Sala.belongsTo(Jardin, { foreignKey: "jardin_id", as: "Jardin" });

Usuario.hasMany(Sala, { foreignKey: "docente_titular_id", as: "SalasTitular" });
Sala.belongsTo(Usuario, { foreignKey: "docente_titular_id", as: "DocenteTitular" });

export default Sala;
