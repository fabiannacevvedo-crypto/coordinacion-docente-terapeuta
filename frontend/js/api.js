document.addEventListener("DOMContentLoaded", () => {
  /* === LÓGICA 1: ANIMACIÓN SCROLL === */
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
    { threshold: 0.15 }
  );

  elementosAAmar.forEach((elemento) => {
    observador.observe(elemento);
  });

  /* === LÓGICA 2: COMPORTAMIENTO ROL/MATRÍCULA === */
  const selectorRol = document.getElementById("reg-role");
  const grupoMatricula = document.getElementById("grupo-matricula");
  const inputMatricula = document.getElementById("reg-matricula");

  if (selectorRol && grupoMatricula && inputMatricula) {
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
  }

  /* === AUXILIAR: FUNCIÓN PARA MOSTRAR ALERTAS DE BOOTSTRAP === */
  const mostrarAlertaBootstrap = (mensaje, tipo) => {
    const contenedor = document.getElementById("contenedor-alertas");
    if (!contenedor) return;

    const alerta = document.createElement("div");
    alerta.className = `alert alert-${tipo} alert-dismissible fade show shadow`;
    alerta.role = "alert";
    alerta.innerHTML = `
      <div>${mensaje}</div>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    contenedor.appendChild(alerta);

    setTimeout(() => {
      alerta.classList.remove("show");
      setTimeout(() => alerta.remove(), 150);
    }, 4000);
  };

  /* === LÓGICA 3: ENVÍO DE FORMULARIO DE REGISTRO === */
  const formRegister = document.getElementById("form-register");

  if (formRegister) {
    formRegister.addEventListener("submit", async (e) => {
      e.preventDefault(); 

      const datosUsuario = {
        rol: document.getElementById("reg-role")?.value || "familiar",
        nombre: document.getElementById("reg-name")?.value || "",
        email: document.getElementById("reg-email")?.value || "",
        contrasena: document.getElementById("reg-password")?.value || "",
        matricula: document.getElementById("reg-matricula")?.value || null 
      };

      try {
        const respuesta = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rol: datosUsuario.rol,
            nombre: datosUsuario.nombre,
            email: datosUsuario.email,
            password: datosUsuario.contrasena,
            matricula: datosUsuario.matricula
          })
        });

        const resultado = await respuesta.json();

        if (respuesta.ok) {
          mostrarAlertaBootstrap(resultado.msg || "¡Registro exitoso! Ya podés iniciar sesión.", "success");
          formRegister.reset();
          
          const modalRegistroEl = document.getElementById('modal-register');
          if (modalRegistroEl && typeof bootstrap !== 'undefined') {
            const modalBootstrap = bootstrap.Modal.getInstance(modalRegistroEl);
            if (modalBootstrap) {
              setTimeout(() => modalBootstrap.hide(), 1500);
            }
          }
        } else {
          mostrarAlertaBootstrap(`Error: ${resultado.msg || resultado.mensaje || 'No se pudo registrar.'}`, "danger");
        }

      } catch (error) {
        console.error("Error en la conexión:", error);
        mostrarAlertaBootstrap("Hubo un problema al conectar con el servidor.", "danger");
      }
    });
  }
});
