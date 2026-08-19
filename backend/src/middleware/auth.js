import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "rednec_super_secret_jwt_key_2026";

/**
 * Middleware para validar que el usuario posea un token JWT válido.
 */
export function verificarToken(req, res, next) {
  const authHeader = req.headers["authorization"] || req.headers["x-access-token"];

  if (!authHeader) {
    return res.status(401).json({
      msg: "Token no proporcionado. Debes iniciar sesión."
    });
  }

  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      msg: "Token inválido o expirado. Vuelve a iniciar sesión."
    });
  }
}

/**
 * Middleware opcional: si hay token lo decodifica, pero no bloquea la petición si no lo hay.
 */
export function verificarTokenOpcional(req, res, next) {
  const authHeader = req.headers["authorization"] || req.headers["x-access-token"];
  if (!authHeader) {
    return next();
  }
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded;
  } catch (e) {
    // Ignorar si es inválido
  }
  next();
}

export default verificarToken;
