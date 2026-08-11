import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "rednec_db",   // Nombre de la base
  process.env.DB_USER || "root",       // Usuario
  process.env.DB_PASS || "",           // Contraseña
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    logging: false, // desactiva logs SQL en consola
    define: {
      timestamps: true,   // agrega createdAt y updatedAt automáticamente
      underscored: true,  // usa snake_case en columnas
    },
    pool: {
      max: 5,     // máximo de conexiones simultáneas
      min: 0,     // mínimo de conexiones
      acquire: 30000, // tiempo máximo para intentar conectar
      idle: 10000     // tiempo máximo que una conexión puede estar inactiva
    }
  }
);

export default sequelize;
