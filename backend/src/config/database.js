import { Sequelize } from "sequelize";
import mysql2 from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const DB_NAME = process.env.DB_NAME || "rednec_db";
const DB_USER = process.env.DB_USER || "root";
const DB_PASS = process.env.DB_PASS || "";
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = parseInt(process.env.DB_PORT, 10) || 3306;

/**
 * Asegura que la base de datos exista antes de conectar con Sequelize.
 */
export async function asegurarBaseDatos() {
  try {
    const conexion = await mysql2.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASS
    });
    await conexion.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await conexion.end();
  } catch (error) {
    console.warn("⚠️ Aviso al verificar base de datos MySQL inicial:", error.message);
  }
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "mysql",
  logging: false,
  define: {
    timestamps: true,
    underscored: true
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export default sequelize;
