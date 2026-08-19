# 🤝 RED NEC | Plataforma de Coordinación Docente - Terapeuta - Familia

> **Nexo Educativo Colaborativo (RED NEC)** es una solución integral y profesional diseñada para optimizar la articulación interdisciplinaria en procesos de educación inclusiva, seguimiento terapéutico y acompañamiento familiar en tiempo real.

---

## 📌 Tabla de Contenidos
- [Características Principales](#-características-principales)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Ecosistema de Roles](#-ecosistema-de-roles)
- [Cuentas Demo de Prueba Rápida](#-cuentas-demo-de-prueba-rápida)
- [Instalación y Puesta en Marcha](#-instalación-y-puesta-en-marcha)
- [API RESTful - Endpoints](#-api-restful---endpoints)
- [Suite de Pruebas Automatizadas](#-suite-de-pruebas-automatizadas)
- [Historial de Desarrollo y Metodología SCRUM](#-historial-de-desarrollo-y-metodología-scrum)
- [Guía de Comandos Git](#-guía-de-comandos-git)

---

## 🚀 Características Principales

- **Dashboard y Analíticas en Tiempo Real:** Métricas interactivas de alumnos activos, porcentajes de progreso y estados mediante gráficos dinámicos con Chart.js (Doughnut y Líneas de evolución).
- **Control de Acceso por Roles (RBAC):** Autenticación robusta basada en **JWT (JSON Web Tokens)** y contraseñas cifradas con **Bcrypt**.
- **Gestión de Reportes Interdisciplinarios:** Creación, filtrado en tiempo real, actualización y eliminación de observaciones pedagógicas y terapéuticas.
- **Acceso Demo en 1 Clic:** Botones de prueba instantánea para evaluar la plataforma como Terapeuta, Docente o Familiar sin necesidad de tipeo manual.
- **Repositorio de Recursos y Guías:** Biblioteca digital para compartir materiales de adecuación curricular, rutinas visuales, pautas sensoriales y SAAC.
- **Canal de Contacto Institucional:** Formulario conectado al backend para solicitudes y consultas de escuelas y centros terapéuticos.
- **Diseño Responsive & Listo para Impresión:** Adaptado para smartphones, tablets y pantallas de escritorio, con estilos de impresión para reportes físicos o PDF.

---

## 🏗 Arquitectura del Sistema

```text
coordinacion-docente-terapeuta/
├── app.js                          # Servidor principal Express y configuración
├── package.json                    # Dependencias y scripts de ejecución
├── .env.example                    # Plantilla de variables de entorno
├── backend/
│   └── src/
│       ├── config/
│       │   ├── database.js         # Conexión Sequelize y auto-creación MySQL
│       │   └── seed.js             # Sembrador de datos iniciales y casos demo
│       ├── controllers/
│       │   ├── auth.controllers.js  # Controladores de autenticación y perfil
│       │   ├── reporte.controller.js# Controladores CRUD y métricas de reportes
│       │   ├── contenido.controller.js # Biblioteca de recursos educativos
│       │   └── contacto.controller.js  # Gestión de mensajes institucionales
│       ├── middleware/
│       │   └── auth.js             # Verificación y decodificación de JWT
│       ├── models/
│       │   ├── usuario.js          # Modelo de usuarios y credenciales
│       │   ├── alumno.js           # Modelo de alumnos y diagnósticos
│       │   ├── reporte.js          # Modelo de reportes y relaciones
│       │   ├── contenido.js        # Modelo de recursos y materiales
│       │   ├── contacto.js         # Modelo de mensajes de contacto
│       │   └── role.js             # Modelo de roles
│       └── routes/
│           ├── auth.js             # Rutas /api/auth
│           ├── reporte.js          # Rutas /api/reportes
│           ├── contenido.js        # Rutas /api/contenidos
│           ├── contacto.js         # Rutas /api/contacto
│           └── terapeuta.js        # Rutas especializadas /api/terapeutas
├── frontend/
│   ├── assets/img/                 # Recursos gráficos e imágenes del proyecto
│   ├── css/                        # Estilos CSS modulares y responsivos
│   ├── html/
│   │   └── index.html              # Portal de Login, Registro y Demo (1 Clic)
│   ├── js/
│   │   ├── session-nav.js          # Sincronización global de sesión en navbar
│   │   ├── seguimiento.js          # Lógica del dashboard y analíticas
│   │   ├── contenido.js            # Filtros dinámicos de recursos
│   │   ├── auth.js                 # Métodos reutilizables de autenticación
│   │   └── api.js                  # Manejo de alertas y peticiones
│   └── pages/
│       ├── index.html              # Página Principal / Landing Comercial
│       ├── informacion.html        # Información Institucional y Biblioteca
│       ├── seguimiento.html        # Panel de Seguimiento de Alumnos
│       └── contacto.html           # Formulario y canales de contacto
└── tests/
    └── api.test.js                 # Suite de pruebas automatizadas (Node test runner)
```

---

## 👥 Ecosistema de Roles

| Rol | Descripción | Capacidades Principales |
|---|---|---|
| **Docente** | Profesional educativo en aula | Registrar adecuaciones curriculares, avances académicos y dinámicas de socialización. |
| **Terapeuta** | Terapeuta Ocupacional, Fonoaudiólogo, Psicólogo | Pautas de integración sensorial, lenguaje, matriculación profesional y reportes clínicos. |
| **Familiar / Tutor** | Padre, madre o tutor responsable | Visualización continua de evolución, sugerencias para el hogar y rutinas visuales. |
| **Administrador** | Coordinación institucional | Auditoría de reportes, altas de alumnos y gestión general de la red. |

---

## 🧪 Cuentas Demo de Prueba Rápida

La base de datos incluye cuentas precargadas para probar la plataforma inmediatamente:

| Rol | Correo Electrónico | Contraseña | Matrícula |
|---|---|---|---|
| **Terapeuta** | `terapeuta@rednec.org` | `Terapeuta123!` | MP-8492 |
| **Docente** | `docente@rednec.org` | `Docente123!` | DOC-3941 |
| **Familiar** | `familiar@rednec.org` | `Familiar123!` | - |
| **Admin** | `admin@rednec.org` | `Admin123!` | ADM-001 |

> 💡 *Nota:* En la pantalla de login (`/frontend/html/index.html`) puedes hacer clic directamente en cualquiera de los botones de **Acceso Demo (1 Clic)** sin escribir la contraseña.

---

## ⚙️ Instalación y Puesta en Marcha

### 1. Clonar el repositorio y acceder
```bash
git clone https://github.com/fabiannacevvedo-crypto/coordinacion-docente-terapeuta.git
cd coordinacion-docente-terapeuta
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea tu archivo `.env` basado en `.env.example`:
```env
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_NAME=rednec_db
DB_USER=root
DB_PASS=
JWT_SECRET=rednec_secret_token_key_2026_super_secure
```

### 4. Sembrar datos de prueba iniciales (opcional pero recomendado)
```bash
npm run seed
```

### 5. Iniciar la aplicación
```bash
npm start
# O para modo desarrollo con recarga automática:
npm run dev
```

### 6. Acceso Web
- **Página Principal:** [http://localhost:3001/](http://localhost:3001/)
- **Panel de Seguimiento:** [http://localhost:3001/frontend/pages/seguimiento.html](http://localhost:3001/frontend/pages/seguimiento.html)
- **Portal de Acceso / Login:** [http://localhost:3001/frontend/html/index.html](http://localhost:3001/frontend/html/index.html)
- **Biblioteca de Recursos:** [http://localhost:3001/frontend/pages/informacion.html](http://localhost:3001/frontend/pages/informacion.html)
- **Contacto Institucional:** [http://localhost:3001/frontend/pages/contacto.html](http://localhost:3001/frontend/pages/contacto.html)

---

## 📡 API RESTful - Endpoints

### Autenticación (`/api/auth`)
- `POST /api/auth/register` : Registrar nuevo usuario.
- `POST /api/auth/login` : Iniciar sesión y obtener JWT.
- `POST /api/auth/demo-login` : Inicio de sesión rápido para evaluación demo.
- `GET  /api/auth/perfil` : Obtener datos del usuario autenticado (requiere `Authorization: Bearer <token>`).
- `GET  /api/auth/alumnos` : Listado de alumnos para selectores.

### Reportes de Seguimiento (`/api/reportes`)
- `GET    /api/reportes/listar` : Listar reportes con soporte de filtros (`?alumno_id=`, `?estado=`, `?busqueda=`).
- `GET    /api/reportes/estadisticas` : Obtener métricas agregadas (totales, porcentajes por estado y área).
- `GET    /api/reportes/:id` : Obtener detalle de un reporte.
- `POST   /api/reportes/crear` : Crear nuevo reporte.
- `PUT    /api/reportes/:id` : Actualizar reporte existente.
- `DELETE /api/reportes/:id` : Eliminar reporte.

### Recursos & Contenidos (`/api/contenidos`)
- `GET    /api/contenidos/listar` : Listar recursos (filtrable por `?categoria=`).
- `POST   /api/contenidos/crear` : Publicar nuevo recurso.
- `DELETE /api/contenidos/:id` : Eliminar recurso.

### Contacto Institucional (`/api/contacto`)
- `POST /api/contacto` : Enviar mensaje institucional desde el formulario.
- `GET  /api/contacto/listar` : Listar mensajes recibidos.

---

## 🧪 Suite de Pruebas Automatizadas

El proyecto cuenta con una suite de pruebas automatizadas que valida la integridad de todos los servicios API:

```bash
npm test
```

**Resultados de la suite:**
- ✔ Health Check responde 200 OK
- ✔ Autenticación: Registro de usuario y validación
- ✔ Autenticación: Login Demo por rol
- ✔ Autenticación: Verificación de JWT en Perfil
- ✔ Alumnos: Consulta y vinculación
- ✔ Reportes: Creación, listado y cálculo de estadísticas
- ✔ Reportes: Eliminación segura
- ✔ Contenidos: Publicación y lectura
- ✔ Contacto: Persistencia de mensajes

---

## 📈 Historial de Desarrollo y Metodología SCRUM

- **Tablero Jira:** [fabiann.atlassian.net/jira/software/projects/SCRUM/boards/1](https://fabiann.atlassian.net/jira/software/projects/SCRUM/boards/1)

### Evolución por Sprints:
1. **Sprint 1 (Junio 2026):** Estructura base modular, maquetación HTML5/CSS3 con Bootstrap 5 y diseño de las vistas principales (Inicio, Información, Seguimiento, Contacto).
2. **Sprint 2 (Julio 2026):** Integración de componentes interactivos, botones de autenticación, diseño visual de tarjetas y unificación de ramas (`dev-info`, `dev-seguimiento`, `dev-contacto`).
3. **Sprint 3 (Agosto 2026):** Migración del backend a Node.js + Express + Sequelize ORM (MySQL), implementación de seguridad con JWT y Bcrypt, modelado de reportes vinculados a terapeutas y alumnos.
4. **Sprint 4 (Consolidación Comercial - Actual):** Cero cabos sueltos, normalización de URLs relativas, sembrado de datos de demostración realistas, dashboard interactivo con Chart.js, navegación unificada persistente y suite de pruebas automatizadas al 100%.

---

## 💻 Guía de Comandos Git

Para abrir el proyecto en VS Code y subir los cambios a GitHub:

```bash
# 1. Abrir el proyecto en Visual Studio Code
code .

# 2. Agregar todos los cambios realizados
git add -A

# 3. Crear el commit de consolidación profesional
git commit -m "feat(core): plataforma 100% funcional y profesional lista para produccion con seeders, dashboard interactivo, navegacion unificada y tests"

# 4. Enviar los cambios al repositorio remoto
git push origin main
```

---
**RED NEC** – *Construyendo puentes para una educación inclusiva y coordinada.*
