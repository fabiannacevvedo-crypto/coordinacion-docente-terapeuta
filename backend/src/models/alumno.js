import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Alumno = sequelize.define("Alumno", {
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
  },
  sala_grado: {
    type: DataTypes.STRING(50),
    defaultValue: "Sala Celeste (4 años)",
  },
  foto_url: {
    type: DataTypes.STRING(255),
    defaultValue: "https://images.unsplash.com/photo-1543332164-6e82f355badc?w=150&auto=format&fit=crop&q=80",
  },
  diagnostico: {
    type: DataTypes.STRING(255),
    defaultValue: "Seguimiento pedagógico y psicomotriz",
  },
  observaciones_generales: {
    type: DataTypes.TEXT,
    defaultValue: "Excelente interacción en dinámicas grupales, estimulando motricidad fina.",
  },
  tutor_nombre: {
    type: DataTypes.STRING(100),
    defaultValue: "Familia",
  },
  tutor_contacto: {
    type: DataTypes.STRING(100),
    defaultValue: "+54 9 3704 000000",
  }
}, {
  tableName: "alumnos",
  timestamps: true,
});

export default Alumno;
