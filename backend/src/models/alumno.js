import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Sala from "./sala.js";
import Jardin from "./jardin.js";

const Alumno = sequelize.define(
  "Alumno",
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
    apellido: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    edad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 4,
    },
    diagnostico: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "Seguimiento Interdisciplinario",
    },
    grado: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "Sala de 4 Años",
    },
    sala_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    jardin_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    tutor_nombre: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    tutor_contacto: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    docente_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    terapeuta_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    }
  },
  {
    tableName: "alumnos",
    timestamps: true,
  }
);

Sala.hasMany(Alumno, { foreignKey: "sala_id", as: "Alumnos" });
Alumno.belongsTo(Sala, { foreignKey: "sala_id", as: "Sala" });

Jardin.hasMany(Alumno, { foreignKey: "jardin_id", as: "Alumnos" });
Alumno.belongsTo(Jardin, { foreignKey: "jardin_id", as: "Jardin" });

export default Alumno;
