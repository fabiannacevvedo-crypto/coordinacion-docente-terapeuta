// Importa Sequelize, una librería ORM para trabajar con bases de datos
import { Sequelize } from "sequelize";

// Crea una instancia de Sequelize y configura la conexión a MySQL
export const sequelize = new Sequelize(
  "docente", // Nombre de la base de datos
  "root",    // Usuario de MySQL
  "",        // Contraseña de MySQL
  {
    host: "localhost", // Dirección del servidor de base de datos
    dialect: "mysql"   // Tipo de base de datos utilizada
  }
);

// Función para probar e iniciar la conexión con la base de datos
export const startDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    console.log("✅ Se estableció la conexión con la base de datos");
  } catch (error) {
    console.log("❌ No se pudo conectar a la base de datos");
    console.log(error);
  }
};
