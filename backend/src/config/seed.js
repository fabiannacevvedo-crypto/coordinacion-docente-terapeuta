import bcrypt from "bcrypt";
import sequelize, { asegurarBaseDatos } from "./database.js";
import Usuario from "../models/usuario.js";
import Jardin from "../models/jardin.js";
import Sala from "../models/sala.js";
import DocenteSala from "../models/docente_sala.js";
import Alumno from "../models/alumno.js";
import Tarea from "../models/tarea.js";
import Asistencia from "../models/asistencia.js";
import Reporte from "../models/reporte.js";
import Contenido from "../models/contenido.js";
import Contacto from "../models/contacto.js";
import Comunicacion from "../models/comunicacion.js";

export async function sembrarDatos(forzar = false) {
  try {
    await asegurarBaseDatos();
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    console.log("🌱 Sembrando / actualizando datos de RED NEC...");

    // 1. Usuarios
    const docenteHash = await bcrypt.hash("Docente123!", 10);
    const terapeutaHash = await bcrypt.hash("Terapeuta123!", 10);
    const familiarHash = await bcrypt.hash("Familiar123!", 10);
    const adminHash = await bcrypt.hash("Admin123!", 10);

    const [docente] = await Usuario.findOrCreate({
      where: { email: "docente@rednec.org" },
      defaults: {
        nombre: "Lic. María López",
        email: "docente@rednec.org",
        password_hash: docenteHash,
        rol: "docente",
        matricula: "DOC-3941",
        telefono: "+54 370 411-2233"
      }
    });

    const [terapeuta] = await Usuario.findOrCreate({
      where: { email: "terapeuta@rednec.org" },
      defaults: {
        nombre: "Lic. Juan Pérez",
        email: "terapeuta@rednec.org",
        password_hash: terapeutaHash,
        rol: "terapeuta",
        matricula: "MP-8492",
        telefono: "+54 370 422-3344"
      }
    });

    await Usuario.findOrCreate({
      where: { email: "familiar@rednec.org" },
      defaults: {
        nombre: "Ana García",
        email: "familiar@rednec.org",
        password_hash: familiarHash,
        rol: "familiar",
        matricula: null,
        telefono: "+54 370 433-4455"
      }
    });

    await Usuario.findOrCreate({
      where: { email: "admin@rednec.org" },
      defaults: {
        nombre: "Coordinación RED NEC",
        email: "admin@rednec.org",
        password_hash: adminHash,
        rol: "admin",
        matricula: "ADM-001",
        telefono: "+54 370 400-0000"
      }
    });

    // 2. Jardines
    const [jardin1] = await Jardin.findOrCreate({
      where: { nombre: "Jardín de Infantes N° 1 'Rayito de Sol'" },
      defaults: {
        nombre: "Jardín de Infantes N° 1 'Rayito de Sol'",
        direccion: "Av. 25 de Mayo 450",
        localidad: "Formosa Capital",
        telefono: "+54 370 442-8811",
        cantidad_aulas: 8
      }
    });

    const [jardin2] = await Jardin.findOrCreate({
      where: { nombre: "Jardín de Infantes Inclusivo N° 14 'Pequeños Sabios'" },
      defaults: {
        nombre: "Jardín de Infantes Inclusivo N° 14 'Pequeños Sabios'",
        direccion: "Calle España 1240",
        localidad: "Formosa Capital",
        telefono: "+54 370 443-9922",
        cantidad_aulas: 6
      }
    });

    // 3. Salas Co-Gestionadas (Docente + Terapeuta)
    const [salaAmarilla] = await Sala.findOrCreate({
      where: { nombre: "Sala Amarilla - 4 Años" },
      defaults: {
        nombre: "Sala Amarilla - 4 Años",
        edad_grupo: "4 Años",
        color: "#eab308",
        turno: "mañana",
        capacidad: 18,
        jardin_id: jardin1.id,
        docente_titular_id: docente.id,
        terapeuta_asignado_id: terapeuta.id
      }
    });
    if (!salaAmarilla.terapeuta_asignado_id) {
      salaAmarilla.terapeuta_asignado_id = terapeuta.id;
      await salaAmarilla.save();
    }

    const [salaCeleste] = await Sala.findOrCreate({
      where: { nombre: "Sala Celeste - 5 Años Inclusiva" },
      defaults: {
        nombre: "Sala Celeste - 5 Años Inclusiva",
        edad_grupo: "5 Años",
        color: "#0284c7",
        turno: "tarde",
        capacidad: 20,
        jardin_id: jardin1.id,
        docente_titular_id: docente.id,
        terapeuta_asignado_id: terapeuta.id
      }
    });
    if (!salaCeleste.terapeuta_asignado_id) {
      salaCeleste.terapeuta_asignado_id = terapeuta.id;
      await salaCeleste.save();
    }

    const [salaVerde] = await Sala.findOrCreate({
      where: { nombre: "Sala Verde - 3 Años" },
      defaults: {
        nombre: "Sala Verde - 3 Años",
        edad_grupo: "3 Años",
        color: "#22c55e",
        turno: "mañana",
        capacidad: 15,
        jardin_id: jardin2.id,
        docente_titular_id: docente.id,
        terapeuta_asignado_id: terapeuta.id
      }
    });

    // 4. Docente Sala
    await DocenteSala.findOrCreate({
      where: { docente_id: docente.id, sala_id: salaAmarilla.id },
      defaults: { docente_id: docente.id, sala_id: salaAmarilla.id, rol_en_sala: "titular" }
    });

    // 5. Alumnos
    const [alumno1] = await Alumno.findOrCreate({
      where: { nombre: "Lucas", apellido: "Gómez" },
      defaults: {
        nombre: "Lucas",
        apellido: "Gómez",
        edad: 4,
        grado: "Sala Amarilla - 4 Años",
        diagnostico: "Desafíos en Integración Sensorial y Comunicación",
        tutor_nombre: "Ana García",
        tutor_contacto: "+54 370 433-4455",
        docente_id: docente.id,
        terapeuta_id: terapeuta.id,
        sala_id: salaAmarilla.id,
        jardin_id: jardin1.id
      }
    });

    const [alumno2] = await Alumno.findOrCreate({
      where: { nombre: "Sofía", apellido: "Benítez" },
      defaults: {
        nombre: "Sofía",
        apellido: "Benítez",
        edad: 4,
        grado: "Sala Amarilla - 4 Años",
        diagnostico: "Trastorno Específico del Lenguaje (TEL) y Socialización",
        tutor_nombre: "Carlos Benítez",
        tutor_contacto: "+54 370 455-6677",
        docente_id: docente.id,
        terapeuta_id: terapeuta.id,
        sala_id: salaAmarilla.id,
        jardin_id: jardin1.id
      }
    });

    // 6. Tareas Coordinadas Interdisciplinarias (Docente + Terapeuta)
    await Tarea.findOrCreate({
      where: { titulo: "Modelado con Plastilina Sensorial y Texturas" },
      defaults: {
        titulo: "Modelado con Plastilina Sensorial y Texturas",
        descripcion: "Trabajar la motricidad fina y prensión palmar en mesa de trabajo.",
        materia: "Expresión Plástica y Sensorial",
        duracion_minutos: 35,
        tipo: "interdisciplinaria",
        es_interdisciplinaria: true,
        objetivo_terapeutico: "Integración sensorial táctil: permitir pausas propioceptivas de 2 min y usar rodillos de madera adaptados.",
        sala_id: salaAmarilla.id,
        alumno_id: alumno1.id,
        docente_id: docente.id,
        terapeuta_id: terapeuta.id,
        creador_nombre: docente.nombre,
        terapeuta_nombre: terapeuta.nombre,
        completada: false
      }
    });

    await Tarea.findOrCreate({
      where: { titulo: "Ronda de Canciones con Pictogramas de Animales" },
      defaults: {
        titulo: "Ronda de Canciones con Pictogramas de Animales",
        descripcion: "Favorecer la pronunciación y el turno conversacional mediante SAAC.",
        materia: "Música y Lenguaje",
        duracion_minutos: 30,
        tipo: "interdisciplinaria",
        es_interdisciplinaria: true,
        objetivo_terapeutico: "Fonoaudiología: modelado de sonidos bilabiales y señalar el pictograma antes de cada estrofa.",
        sala_id: salaAmarilla.id,
        alumno_id: alumno2.id,
        docente_id: docente.id,
        terapeuta_id: terapeuta.id,
        creador_nombre: docente.nombre,
        terapeuta_nombre: terapeuta.nombre,
        completada: true
      }
    });

    // 7. Asistencia de hoy
    const fechaHoy = new Date().toISOString().split("T")[0];
    await Asistencia.findOrCreate({
      where: { alumno_id: alumno1.id, fecha: fechaHoy },
      defaults: {
        alumno_id: alumno1.id,
        sala_id: salaAmarilla.id,
        estado: "presente",
        fecha: fechaHoy,
        observacion: "Excelente jornada en sala amarilla coordinada."
      }
    });

    console.log("✅ Seed interdisciplinario completado exitosamente.");
  } catch (e) {
    console.error("❌ Error en seed:", e);
  }
}

if (process.argv[1]?.includes("seed.js")) {
  sembrarDatos(true).then(() => {
    console.log("Terminado.");
    process.exit(0);
  });
}
