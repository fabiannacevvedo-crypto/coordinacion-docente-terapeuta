import jwt from "jsonwebtoken";

function verificarToken(req, res, next) {
    const header = req.headers["authorization"];

    if (!header) {
        return res.status(403).json({
            msg: "Token requerido"
        });
    }

    const token = header.split(" ")[1];

    try {
        const decoded = jwt.verify(token, "clave_secreta");

        req.usuario = decoded;

        next();
    } catch (err) {
        res.status(401).json({
            msg: "Token inválido"
        });
    }
}

export default verificarToken;