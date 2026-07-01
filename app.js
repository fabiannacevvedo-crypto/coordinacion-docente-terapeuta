// Importa el framework Express para crear el servidor
import express from "express";

// Importa la función que inicia la conexión con la base de datos
// import { startDB } from "./config/data.base.js";

// Exporta el modelo Docente para que pueda ser utilizado en otros archivos
// import docente from "./models/docente.models.js";

// Crea una instancia de la aplicación Express
const app = express();

// Define el puerto donde se ejecutará el servidor
const PORT = 3001;

// Middleware que permite recibir y procesar datos JSON
app.use(express.json());

// Ruta principal (GET /)
// Cuando se acceda a http://localhost:3001/
// responderá con un mensaje en formato JSON
app.get("/", (req, res) => {
    return res.json({
        message: "Servidor todo listo"
    });
});

// Inicia el servidor y escucha en el puerto definido
app.listen(PORT, async () => {

    // Conecta con la base de datos antes de comenzar a trabajar
    //await startDB();

    // Muestra un mensaje en la consola indicando que el servidor está funcionando
    console.log(
        `Servidor corriendo en el puerto ${PORT} http://localhost:${PORT}`
    );
});