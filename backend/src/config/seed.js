import Alumno from "../models/alumno.js";
import Tarea from "../models/tarea.js";
import Asistencia from "../models/asistencia.js";
import Comunicacion from "../models/comunicacion.js";
import Reporte from "../models/reporte.js";
import Contenido from "../models/contenido.js";

export async function seedInitialData() {
  try {
    const totalAlumnos = await Alumno.count();
    if (totalAlumnos === 0) {
      console.log("🌱 Sembrando datos iniciales de prueba para RED NEC...");

      const alumnos = await Alumno.bulkCreate([
        {
          nombre: "Mateo",
          apellido: "Benítez",
          edad: 4,
          sala_grado: "Sala Amarilla (4 años)",
          foto_url: "https://images.unsplash.com/photo-1543332164-6e82f355badc?w=200&auto=format&fit=crop&q=80",
          diagnostico: "Estimulación del lenguaje y socialización",
          observaciones_generales: "Muy participativo en juegos musicales y canciones infantiles.",
          tutor_nombre: "Valeria Benítez",
          tutor_contacto: "+54 9 3704 112233"
        },
        {
          nombre: "Sofía",
          apellido: "Rodríguez",
          edad: 5,
          sala_grado: "Sala Verde (5 años)",
          foto_url: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=200&auto=format&fit=crop&q=80",
          diagnostico: "Desarrollo motriz fino y coordinación visomotora",
          observaciones_generales: "Muestra gran interés en actividades con plastilina y dibujo.",
          tutor_nombre: "Carlos Rodríguez",
          tutor_contacto: "+54 9 3704 445566"
        },
        {
          nombre: "Lucas",
          apellido: "Martínez",
          edad: 4,
          sala_grado: "Sala Amarilla (4 años)",
          foto_url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=200&auto=format&fit=crop&q=80",
          diagnostico: "Integración sensorial y atención sostenida",
          observaciones_generales: "Responde muy bien a consignas visuales y pausas activas.",
          tutor_nombre: "Luciana Gómez",
          tutor_contacto: "+54 9 3704 778899"
        },
        {
          nombre: "Valentina",
          apellido: "Pérez",
          edad: 5,
          sala_grado: "Sala Verde (5 años)",
          foto_url: "https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=200&auto=format&fit=crop&q=80",
          diagnostico: "Fortalecimiento de autonomía y rutinas diarias",
          observaciones_generales: "Compañera alegre, ayuda en el orden y guardado de materiales.",
          tutor_nombre: "Mariana Pérez",
          tutor_contacto: "+54 9 3704 123456"
        }
      ]);

      const hoy = new Date().toISOString().split("T")[0];

      // Asistencias iniciales
      await Asistencia.bulkCreate([
        { alumnoId: alumnos[0].id, fecha: hoy, estado: "presente", observacion: "Llegó a horario con entusiasmo" },
        { alumnoId: alumnos[1].id, fecha: hoy, estado: "presente", observacion: "Participó en todas las actividades" },
        { alumnoId: alumnos[2].id, fecha: hoy, estado: "tarde", observacion: "Ingresó a las 9:15 hs con aviso" },
        { alumnoId: alumnos[3].id, fecha: hoy, estado: "presente", observacion: "Presente en sala verde" }
      ]);

      // Tareas iniciales (Docente y Terapéutica)
      await Tarea.bulkCreate([
        {
          titulo: "Collage con texturas de la naturaleza",
          descripcion: "Recolectar hojas y ramitas secas para pegar en cartulina trabajando prensión palmar.",
          tipo: "docente",
          area: "Plástica y Expresión",
          fecha_limite: hoy,
          completada: false,
          alumnoId: alumnos[0].id,
          creador_nombre: "Seño Laura"
        },
        {
          titulo: "Juego de soplado y burbujas mágicas",
          descripcion: "Ejercicio orofacial con sorbete para estimular control de respiración y vocalización.",
          tipo: "terapeutica",
          area: "Fonoaudiología",
          fecha_limite: hoy,
          completada: true,
          alumnoId: alumnos[0].id,
          creador_nombre: "Lic. Martín (Terapeuta)"
        },
        {
          titulo: "Circuito de psicomotricidad con aros",
          descripcion: "Saltos bipodales y marcha sobre cinta en el suelo para coordinación y equilibrio.",
          tipo: "terapeutica",
          area: "Psicomotricidad",
          fecha_limite: hoy,
          completada: false,
          alumnoId: alumnos[1].id,
          creador_nombre: "Lic. Andrea (Terapeuta Ocupacional)"
        },
        {
          titulo: "Narración con títeres de dedo",
          descripcion: "Escuchar el cuento de los animales e identificar qué sonido hace cada uno.",
          tipo: "docente",
          area: "Lenguaje y Literatura",
          fecha_limite: hoy,
          completada: true,
          alumnoId: alumnos[2].id,
          creador_nombre: "Seño Mariana"
        }
      ]);

      // Comunicaciones / Saludos iniciales
      await Comunicacion.bulkCreate([
        {
          remitente_nombre: "Seño Laura",
          remitente_rol: "docente",
          tipo: "saludo",
          titulo: "¡Hola familias de Sala Amarilla! ☀️",
          mensaje: "Hoy tuvimos una jornada hermosa trabajando con canciones y rondas de bienvenida. ¡Los peques estuvieron súper alegres!",
          alumnoId: null
        },
        {
          remitente_nombre: "Lic. Martín (Fonoaudiología)",
          remitente_rol: "terapeuta",
          tipo: "sugerencia_terapeutica",
          titulo: "Sugerencia semanal para el hogar 🎈",
          mensaje: "Recomendamos jugar 10 minutitos al día nombrando objetos de colores en casa. Esto complementa excelente lo trabajado en sala.",
          alumnoId: alumnos[0].id
        },
        {
          remitente_nombre: "Equipo Directivo RED NEC",
          remitente_rol: "institucional",
          tipo: "aviso_importante",
          titulo: "Reunión de coordinación interdisciplinaria 📋",
          mensaje: "Este viernes a las 17 hs tendremos nuestro espacio mensual de articulación docente-terapéutica.",
          alumnoId: null
        }
      ]);

      // Reportes iniciales
      await Reporte.bulkCreate([
        { alumnoId: alumnos[0].id, progreso: 85, estado: "bueno", observaciones: "Gran avance en vocalización y respuesta a dinámicas lúdicas." },
        { alumnoId: alumnos[1].id, progreso: 70, estado: "regular", observaciones: "Buen desempeño con plastilina, requiere afianzar agarre en pinza." },
        { alumnoId: alumnos[2].id, progreso: 60, estado: "atencion", observaciones: "Presenta dispersión en actividades largas, se sugieren pausas activas." },
        { alumnoId: alumnos[3].id, progreso: 90, estado: "bueno", observaciones: "Excelente autonomía y colaboración en las rutinas de la sala." }
      ]);

      console.log("✅ Datos de prueba de alumnos, tareas, asistencias y reportes creados.");
    }

    // Sembrar contenidos si está vacío
    const totalContenidos = await Contenido.count();
    if (totalContenidos === 0) {
      await Contenido.bulkCreate([
        {
          titulo: "Guía de Estimulación Temprana y Motricidad Fina",
          descripcion: "Estrategias lúdicas para aplicar tanto en el aula de nivel inicial como en el hogar.",
          categoria: "Psicomotricidad",
          urlRecurso: "https://www.unicef.org"
        },
        {
          titulo: "Actividades de Comunicación Aumentativa y Fonoaudiología",
          descripcion: "Fichas descargables y juegos orofaciales para potenciar el desarrollo del lenguaje.",
          categoria: "Fonoaudiología",
          urlRecurso: "https://www.educ.ar"
        },
        {
          titulo: "Pautas de Articulación y Acuerdos Docente-Familia",
          descripcion: "Cuadernillo orientativo para fortalecer la continuidad de hábitos y rutinas escolares.",
          categoria: "Institucional",
          urlRecurso: "https://www.argentina.gob.ar/educacion"
        }
      ]);
      console.log("✅ Contenidos educativos iniciales creados.");
    }
  } catch (error) {
    console.error("⚠️ Nota sobre seed:", error.message);
  }
}
