document.addEventListener("DOMContentLoaded", () => {
  const elementosAAmar = document.querySelectorAll(".animar-scroll");

  const observador = new IntersectionObserver(
    (entradas, observadorPropio) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("visible");

          observadorPropio.unobserve(entrada.target);
        }
      });
    },
    {
      threshold: 0.15,
    },
  );

  elementosAAmar.forEach((elemento) => {
    observador.observe(elemento);
  });
  const selectorRol = document.getElementById("reg-role");
const grupoMatricula = document.getElementById("grupo-matricula");
const inputMatricula = document.getElementById("reg-matricula");

selectorRol.addEventListener("change", () => {
  if (selectorRol.value === "terapeuta") {
    grupoMatricula.classList.remove("d-none");
    inputMatricula.required = true;
  } else {
    
    grupoMatricula.classList.add("d-none");
    inputMatricula.required = false;
    inputMatricula.value = "";
  }
});
});

