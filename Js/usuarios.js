const session = CAREDENT.requireRole("administrador");
if (session) {
  const form = document.getElementById("formUsuario");
  const buscador = document.getElementById("buscadorUsuarios");
  CAREDENT.initFormValidation(form);

  function render() {
    const texto = buscador.value.trim().toLowerCase();
    const usuarios = CAREDENT.getUsers().filter((u) =>
      !texto || `${u.nombre} ${u.usuario} ${u.rol}`.toLowerCase().includes(texto)
    );
    const tbody = document.getElementById("tablaUsuarios");
    tbody.innerHTML = usuarios.length ? usuarios.map((u) => `
      <tr><td class="cell-name">${u.nombre}</td><td>${u.usuario}</td><td>${u.rol === "profesional" ? "Médico / Profesional" : u.rol === "recepcionista" ? "Recepcionista" : "Administrador"}</td>
      <td style="text-align:right">${u.id === session.userId ? '<span class="text-muted">Sesión actual</span>' : '<button class="btn btn--danger btn--sm" data-delete-user="'+u.id+'" type="button">Eliminar</button>'}</td></tr>
    `).join("") : `<tr><td colspan="4"><div class="empty-state">No se encontraron usuarios.</div></td></tr>`;
  }

  buscador.addEventListener("input", render);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!CAREDENT.validateForm(form)) { CAREDENT.showToast("Completa correctamente los campos.", "danger"); return; }
    const usuario = document.getElementById("usuario").value.trim().toLowerCase();
    if (CAREDENT.getUsers().some((u) => u.usuario.toLowerCase() === usuario)) {
      CAREDENT.showToast("Ese nombre de usuario ya existe.", "danger"); return;
    }
    CAREDENT.addUser({ nombre: nombreUsuario.value.trim(), usuario, clave: clave.value, rol: rol.value });
    form.reset(); CAREDENT.showToast("Usuario agregado correctamente.", "ok"); render();
  });

  document.getElementById("tablaUsuarios").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-delete-user]");
    if (!btn) return;
    if (!confirm("¿Eliminar este usuario?")) return;
    CAREDENT.deleteUser(btn.dataset.deleteUser);
    CAREDENT.showToast("Usuario eliminado.", "ok"); render();
  });
  render();
}
