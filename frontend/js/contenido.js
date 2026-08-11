// Consumir API de contenidos
fetch("http://localhost:3001/api/contenidos/listar")
  .then(res => res.json())
  .then(contenidos => {
    const contenedor = document.getElementById("contenidos");
    contenedor.innerHTML = contenidos.map(c => `
      <div class="card mb-3 p-3">
        <h5>${c.titulo}</h5>
        <p>${c.descripcion}</p>
        <small class="text-muted">Categoría: ${c.categoria}</small><br>
        <a href="${c.urlRecurso}" target="_blank" class="btn btn-info btn-sm mt-2">Ver recurso</a>
      </div>
    `).join("");
  })
  .catch(err => console.error("Error cargando contenidos:", err));
