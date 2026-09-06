CAREDENT.ensureSeedData();

  // Si ya existe una sesión activa, saltar directo al dashboard.
  if (CAREDENT.getSession()) {
    window.location.href = "pages/dashboard.html";
  }

  let rolSeleccionado = "administrador";
  const roleSelect = document.getElementById("roleSelect");
  roleSelect.addEventListener("click", (e) => {
    const chip = e.target.closest(".role-chip");
    if (!chip) return;
    rolSeleccionado = chip.dataset.role;
    roleSelect.querySelectorAll(".role-chip").forEach((c) => c.classList.toggle("is-active", c === chip));
  });

  const form = document.getElementById("loginForm");
  const msg = document.getElementById("loginMsg");
  CAREDENT.initFormValidation(form);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const valid = CAREDENT.validateForm(form);
    msg.className = "login-msg";
    if (!valid) {
      msg.textContent = "Completa usuario y contraseña para continuar.";
      msg.classList.add("is-visible", "is-error");
      return;
    }

    const usuario = document.getElementById("usuario").value;
    const clave = document.getElementById("clave").value;
    const result = CAREDENT.attemptLogin(usuario, clave, rolSeleccionado);

    if (!result.ok) {
      msg.textContent = result.error;
      msg.classList.add("is-visible", "is-error");
      return;
    }

    msg.textContent = "Sesión iniciada. Redirigiendo…";
    msg.classList.add("is-visible", "is-ok");
    setTimeout(() => {
      window.location.href = "pages/dashboard.html";
    }, 500);
  });
