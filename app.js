import express from "express";
import sequelize from "./backend/src/config/database.js";
import authRoutes from "./backend/src/routes/auth.js";
import verificarToken from "./backend/src/middleware/auth.js";

const app = express();

app.use(express.json());

sequelize.authenticate()
    .then(() => console.log("✅ Conexión establecida con MySQL"))
    .catch(err => console.error("❌ Error de conexión:", err));

sequelize.sync()
    .then(() => console.log("✅ Modelos sincronizados"))
    .catch(err => console.error("❌ Error al sincronizar:", err));

app.use("/auth", authRoutes);

app.get("/perfil", verificarToken, (req, res) => {
    res.json({
        msg: "Acceso permitido",
        usuario: req.usuario
    });
});

app.listen(3001, () => {
    console.log("Servidor corriendo en http://localhost:3001");
});