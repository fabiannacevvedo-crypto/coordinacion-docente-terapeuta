import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "clave_secreta_rednec";

function verificarToken(req, res, next) {
  const header = req.headers["authorization"];

  if (!header) {
    return res.status(403).json({
      msg: "Token requerido. Debes iniciar sesión."
    });
  }

  const partes = header.split(" ");
  const token = partes.length === 2 ? partes[1] : partes[0];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      msg: "Token inválido o expirado. Vuelve a iniciar sesión."
    });
  }
}

export default verificarToken;