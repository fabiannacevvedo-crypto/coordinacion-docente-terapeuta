import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        const existe = await Usuario.findOne({
            where: { email }
        });

        if (existe) {
            return res.status(400).json({
                msg: "Email ya registrado"
            });
        }

        const hash = await bcrypt.hash(password, 10);

        const nuevo = await Usuario.create({
            nombre,
            email,
            password_hash: hash
        });

        res.json({
            msg: "Usuario registrado",
            usuario: nuevo
        });
    } catch (err) {
        res.status(500).json({
            msg: "Error en registro",
            error: err.message
        });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const usuario = await Usuario.findOne({
            where: { email }
        });

        if (!usuario) {
            return res.status(400).json({
                msg: "Usuario no encontrado"
            });
        }

        const valido = await bcrypt.compare(
            password,
            usuario.password_hash
        );

        if (!valido) {
            return res.status(401).json({
                msg: "Contraseña incorrecta"
            });
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                email: usuario.email
            },
            "clave_secreta",
            {
                expiresIn: "1h"
            }
        );

        res.json({
            msg: "Login exitoso",
            token
        });
    } catch (err) {
        res.status(500).json({
            msg: "Error en login",
            error: err.message
        });
    }
});

export default router;