document.addEventListener("DOMContentLoaded", () => {
  // Inicializar EmailJS
  emailjs.init("aS90PMQRmjhZsWQU6"); // Public Key

  // Referencias
  const contactoLink = document.querySelector('a[href="#contacto"]');
  const modal = document.getElementById("contact-modal");
  const closeModal = document.getElementById("close-modal");
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const timeInput = document.getElementById("time");

  // Abrir modal al hacer clic en "Contacto"
  if (contactoLink) {
    contactoLink.addEventListener("click", (e) => {
      e.preventDefault();
      modal.classList.remove("hidden");
    });
  }

  // Cerrar modal con botón
  if (closeModal) {
    closeModal.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  }

  // Cerrar modal al hacer clic fuera
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.add("hidden");
      }
    });
  }

  // Enviar formulario con EmailJS
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      // Insertar fecha/hora actual en el campo oculto
      timeInput.value = new Date().toLocaleString();

      emailjs.sendForm("service_xoaa0x8", "template_0zfb912", this)

        .then(() => {
          status.textContent = "✅ Tu mensaje ha sido enviado con éxito.";
          status.classList.remove("hidden");
          status.classList.add("text-green-600");
          form.reset();
        }, (err) => {
          status.textContent = "❌ Ocurrió un error, inténtalo más tarde.";
          status.classList.remove("hidden");
          status.classList.add("text-red-600");
          console.error("Error:", err);
        });
    });
  }
});
