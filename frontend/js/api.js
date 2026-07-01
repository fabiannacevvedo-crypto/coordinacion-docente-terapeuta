// 1. Esperamos a que todo el HTML de la página esté cargado
document.addEventListener("DOMContentLoaded", () => {
  // 2. Buscamos TODOS los elementos que tengan la clase 'animar-scroll'
  const elementosAAmar = document.querySelectorAll(".animar-scroll");

  // 3. Creamos el "Observador" (el encargado de espiar el scroll)
  const observador = new IntersectionObserver(
    (entradas, observadorPropio) => {
      // Este código se ejecuta cada vez que un elemento entra o sale de la pantalla
      entradas.forEach((entrada) => {
        // ¿El elemento ya es visible en la pantalla?
        if (entrada.isIntersecting) {
          // Le sumamos una clase de CSS que lo va a hacer aparecer
          entrada.target.classList.add("visible");

          // Como ya apareció, le decimos al observador que deje de espiarlo (así no se repite la animación)
          observadorPropio.unobserve(entrada.target);
        }
      });
    },
    {
      // Configuramos para que la animación se dispare cuando se vea un 15% del elemento
      threshold: 0.15,
    },
  );

  // 4. Le decimos al observador que empiece a espiar a cada una de las tarjetas
  elementosAAmar.forEach((elemento) => {
    observador.observe(elemento);
  });
});

// 1. Enganchamos el selector de roles y el grupo de la matrícula
const selectorRol = document.getElementById("reg-role");
const grupoMatricula = document.getElementById("grupo-matricula");
const inputMatricula = document.getElementById("reg-matricula");

// 2. Escuchamos cuando el usuario cambie de opción (evento 'change')
selectorRol.addEventListener("change", () => {
  // ¿La opción seleccionada es 'terapeuta'?
  if (selectorRol.value === "terapeuta") {
    // Mostramos el campo sacando la clase 'd-none' de Bootstrap
    grupoMatricula.classList.remove("d-none");
    // Hacemos que sea obligatorio rellenarlo
    inputMatricula.required = true;
  } else {
    // Si elige otra cosa, lo volvemos a ocultar
    grupoMatricula.classList.add("d-none");
    // Ya no es obligatorio
    inputMatricula.required = false;
    // Limpiamos lo que haya escrito por si acaso
    inputMatricula.value = "";
  }
});
