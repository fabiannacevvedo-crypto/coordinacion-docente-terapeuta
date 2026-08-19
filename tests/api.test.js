import test from "node:test";
import assert from "node:assert/strict";
import app from "../app.js";

let server;
let baseUrl;
const testPort = 3099;

test.before(async () => {
  await new Promise((resolve) => {
    server = app.listen(testPort, () => {
      baseUrl = `http://localhost:${testPort}`;
      resolve();
    });
  });
});

test.after(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("API Health Check responde 200 OK con info Dual DB", async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.status, "OK");
  assert.ok(data.mysql);
});

test("Jardines y Salas: Listado y Creación", async () => {
  const resJardines = await fetch(`${baseUrl}/api/jardines`);
  assert.equal(resJardines.status, 200);
  const jardines = await resJardines.json();
  assert.ok(Array.isArray(jardines));

  const resSalas = await fetch(`${baseUrl}/api/salas`);
  assert.equal(resSalas.status, 200);
  const salas = await resSalas.json();
  assert.ok(Array.isArray(salas));

  // Crear sala
  const resCrearSala = await fetch(`${baseUrl}/api/salas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nombre: "Sala Naranja Test - 4 Años",
      edad_grupo: "4 Años",
      color: "#f97316",
      turno: "tarde",
      capacidad: 15,
      jardin_id: jardines[0]?.id || 1
    })
  });
  assert.equal(resCrearSala.status, 201);
});

test("Tareas: Creación con materia y duración en minutos", async () => {
  const resCrear = await fetch(`${baseUrl}/api/tareas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      titulo: "Taller de Pintura Dactilar",
      descripcion: "Exploración de colores primarios con dedos",
      materia: "Expresión Plástica",
      duracion_minutos: 40,
      tipo: "docente"
    })
  });
  assert.equal(resCrear.status, 201);
  const data = await resCrear.json();
  assert.equal(data.duracion_minutos, 40);
  assert.equal(data.materia, "Expresión Plástica");
});

test("Asistencia: Registro y Consulta por fecha", async () => {
  const fechaHoy = new Date().toISOString().split("T")[0];
  const resPost = await fetch(`${baseUrl}/api/asistencias`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      alumno_id: 1,
      estado: "presente",
      observacion: "Asistencia verificada en test",
      fecha: fechaHoy
    })
  });
  assert.equal(resPost.status, 201);

  const resGet = await fetch(`${baseUrl}/api/asistencias/fecha?fecha=${fechaHoy}`);
  assert.equal(resGet.status, 200);
  const asistencias = await resGet.json();
  assert.ok(Array.isArray(asistencias));
});
