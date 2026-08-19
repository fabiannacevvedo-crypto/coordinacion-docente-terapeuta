import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/rednec_db";

let mongoConectado = false;

export async function conectarMongoDB() {
  if (process.env.ENABLE_MONGO === "false") {
    console.log("ℹ️ MongoDB deshabilitado por configuración (.env: ENABLE_MONGO=false)");
    return false;
  }

  try {
    // Timeout corto para no bloquear si MongoDB no está instalado/iniciado
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    mongoConectado = true;
    console.log("🍃 ✅ Conexión establecida con MongoDB (Modo Dual NoSQL Activo)");
    return true;
  } catch (error) {
    console.log("ℹ️ MongoDB no detectado en local (continuando en modo principal MySQL):", error.message);
    mongoConectado = false;
    return false;
  }
}

export function estadoMongoDB() {
  return mongoConectado;
}

// ==========================================
// ESQUEMAS MONGOOSE PARA MODO DUAL / AUDITORÍA
// ==========================================
const BitacoraMongoSchema = new mongoose.Schema({
  accion: { type: String, required: true },
  usuario: { type: String, required: true },
  rol: { type: String, required: true },
  detalles: { type: Object, default: {} },
  fecha: { type: Date, default: Date.now }
}, { collection: "bitacora_docente" });

export const BitacoraMongo = mongoose.models.BitacoraMongo || mongoose.model("BitacoraMongo", BitacoraMongoSchema);

export default mongoose;
