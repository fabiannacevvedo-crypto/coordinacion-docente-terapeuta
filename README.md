# RED NEC - Coordinación Docente-Terapeuta-Familia

Plataforma Web Integral de articulación interdisciplinaria y seguimiento pedagógico-terapéutico para el **Nivel Inicial**. Permite la coordinación activa entre docentes de sala, terapeutas externos y familias con actualización de datos en tiempo real.

---

## 🌟 Módulos y Funcionalidades

### 1. 👩‍🏫 Portal Docente (`/docente`)
- **Galería de Alumnos Registrados:** Fichas completas con fotos de perfil, sala/grado, edad, diagnóstico/área de enfoque pedagógico, observaciones y contacto de tutores.
- **Asignación de Actividades & Tareas:**
  - *Generales:* Para toda la sala.
  - *Particulares:* Asignadas específicamente a un estudiante.
  - Áreas diferenciadas (*Lenguaje, Psicomotricidad, Expresión Plástica, Fonoaudiología, Hábitos y Autonomía*).
  - Control de estado (completada / pendiente) y eliminación.
- **Registro de Nuevos Alumnos:** Alta directa de estudiantes con validación de datos.
- **Mural de Comunicaciones:** Publicación y visualización de saludos diarios, avisos institucionales y sugerencias.

### 2. 📊 Módulo de Seguimiento & Reportes (`/seguimiento`)
- **Generador de Reportes de Alumno:**
  - Selector dinámico de alumnos con carga automática de fotos e información de sala.
  - Carga de imágenes/fotos de evidencia con **previsualización en vivo**.
  - **Slider de Progreso interactivo (0% - 100%)** con indicador visual dinámico.
  - Selector de estado (*Progreso Favorable, En Proceso, Requiere Atención*).
  - Descripción detallada y observaciones clínico-pedagógicas.
  - Guardado directo en MySQL (`reportes`) con sincronización en tiempo real.
- **Analíticas Visuales con Chart.js:**
  - Gráfico de distribución de estados (Donut).
  - Gráfico de barras de evolución de progreso individual por estudiante.
- **Feed Histórico:** Tarjetas interactivas con filtros rápidos y buscador en vivo.

### 3. ℹ️ Información Institucional & Recursos (`/informacion`)
- Marco pedagógico y objetivos de inclusión en el nivel inicial.
- **Biblioteca Dinámica de Contenidos:** Recursos descargables, cuadernillos y guías prácticas consumidos desde `/api/contenidos/listar`.

### 4. 📞 Contacto Institucional (`/contacto`)
- Formulario de contacto directo con validación y confirmación en pantalla.
- Canales de atención institucional de RED NEC Formosa.

### 5. 🔐 Autenticación & Perfiles (`/login` o `/html/index.html`)
- Registro e inicio de sesión por rol (*Docente, Terapeuta, Familiar*).
- Validación de matrícula profesional para terapeutas.
- Panel de sesión activa con acceso directo a las áreas de trabajo.

---

## 🛠️ Tecnologías Utilizadas

- **Backend:** Node.js (v18+) + Express v5.
- **Base de Datos:** MySQL + Sequelize ORM (sincronización automática de modelos).
- **Frontend:** HTML5 Semántico, CSS3 Moderno (*Design System con Glassmorphism y Google Fonts*), JavaScript Vanilla ES6+, Bootstrap v5.3.8 y Chart.js.
- **Control de Versiones:** Git & GitHub.

---

## 🚀 Puesta en Marcha en Local

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar servidor en modo desarrollo (con recarga en tiempo real):**
   ```bash
   npm run dev
   ```

3. **Abrir en el navegador:**
   - 🏠 **Inicio:** [http://localhost:3001/](http://localhost:3001/)
   - 👩‍🏫 **Portal Docente:** [http://localhost:3001/docente](http://localhost:3001/docente)
   - 📊 **Seguimiento:** [http://localhost:3001/seguimiento](http://localhost:3001/seguimiento)
   - ℹ️ **Información:** [http://localhost:3001/informacion](http://localhost:3001/informacion)
   - 📞 **Contacto:** [http://localhost:3001/contacto](http://localhost:3001/contacto)
   - 🔐 **Acceso:** [http://localhost:3001/login](http://localhost:3001/login)
