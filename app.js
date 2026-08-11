import express from "express";
import cors from "cors";

import sequelize from "./backend/src/config/database.js";
import authRoutes from "./backend/src/routes/auth.js";
import verificarToken from "./backend/src/middleware/auth.js";


// ======================================
// CREAR APLICACIÓN EXPRESS
// ======================================

const app = express();


// ======================================
// MIDDLEWARES
// ======================================

app.use(cors());

app.use(express.json());


// ======================================
// CONEXIÓN CON MYSQL
// ======================================

sequelize.authenticate()
    .then(() => {
        console.log("✅ Conexión establecida con MySQL");
    })
    .catch(err => {
        console.error("❌ Error de conexión:", err);
    });


// ======================================
// SINCRONIZAR MODELOS CON MYSQL
// ======================================

sequelize.sync()
    .then(() => {
        console.log("✅ Modelos sincronizados");
    })
    .catch(err => {
        console.error("❌ Error al sincronizar:", err);
    });


// ======================================
// RUTAS DE AUTENTICACIÓN
// ======================================

app.use("/auth", authRoutes);


// ======================================
// RUTA PROTEGIDA / PERFIL
// ======================================

app.get("/perfil", verificarToken, (req, res) => {

    res.json({
        msg: "Acceso permitido",
        usuario: req.usuario
    });

});


// ======================================
// INICIAR SERVIDOR
// ======================================

app.listen(3001, () => {

    console.log(
        "Servidor corriendo en http://localhost:3001"
    );

});