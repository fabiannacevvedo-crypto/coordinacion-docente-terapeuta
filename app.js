// Importa el framework Express para crear el servidor
import express from "express";

// Importa la función que inicia la conexión con la base de datos
import { startDB } from "./backend/src/config/data.base.js";

// Importa los modelos Docente, Familiar y Terapeuta
import docente from "./backend/src/models/docente.models.js";
import familiar from "./backend/src/models/familiar.models.js";
import terapeuta from "./backend/src/models/terapeuta.models.js";

// Crea una instancia de la aplicación Express
const app = express();

// Define el puerto donde se ejecutará el servidor
const PORT = 3001;

// Middleware que permite recibir y procesar datos JSON
app.use(express.json());

// Ruta principal (GET /)
app.get("/", (req, res) => {
  return res.json({
    message: "Servidor todo listo"
  });
});

// Inicia el servidor y escucha en el puerto definido
app.listen(PORT, async () => {
  // Conecta con la base de datos antes de comenzar a trabajar
  await startDB();

  // Muestra un mensaje en la consola indicando que el servidor está funcionando
  console.log(`Servidor corriendo en el puerto ${PORT} http://localhost:${PORT}`);
});
