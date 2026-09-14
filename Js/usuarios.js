const session = CAREDENT.requireRole("administrador");
if (session) {
  CAREDENT.initLayout("usuarios");
  const form = document.getElementById("formUsuario");
  const buscador = document.getElementById("buscadorUsuarios");
  CAREDENT.initFormValidation(form);

  function rolLabel(rol) {
    return rol === "profesional" ? "Médico / Profesional" : rol === "recepcionista" ? "Recepcionista" : "Administrador";
  }

  function render() {
    const texto = buscador.value.trim().toLowerCase();
    const usuarios = CAREDENT.getUsers().filter((u) =>
      !texto || `${u.nombre} ${u.usuario} ${u.rol}`.toLowerCase().includes(texto)
    );
    const tbody = document.getElementById("tablaUsuarios");
    tbody.innerHTML = usuarios.length ? usuarios.map((u) => `
      <tr><td class="cell-name">${u.nombre}</td><td>${u.usuario}</td><td>${rolLabel(u.rol)}</td>
      <td style="text-align:right">${u.id === session.userId ? '<span class="text-muted">Sesión actual</span>' : '<button class="btn btn--danger btn--sm" data-delete-user="'+u.id+'" type="button">Eliminar</button>'}</td></tr>
    `).join("") : `<tr><td colspan="4"><div class="empty-state">No se encontraron usuarios.</div></td></tr>`;

    renderPapelera();
  }

  function renderPapelera() {
    const tbodyPapelera = document.getElementById("tablaUsuariosEliminados");
    if (!tbodyPapelera) return;
    const eliminados = CAREDENT.getDeletedUsers();
    tbodyPapelera.innerHTML = eliminados.length ? eliminados.map((u) => `
      <tr><td class="cell-name">${u.nombre}</td><td>${u.usuario}</td><td>${rolLabel(u.rol)}</td>
      <td>${u.eliminadoEl ? new Date(u.eliminadoEl).toLocaleString("es-CL") : "—"}</td>
      <td style="text-align:right">
        <button class="btn btn--ghost btn--sm" data-restore-user="${u.id}" type="button">Restaurar</button>
        <button class="btn btn--danger btn--sm" data-purge-user="${u.id}" type="button">Eliminar definitivamente</button>
      </td></tr>
    `).join("") : `<tr><td colspan="5"><div class="empty-state">No hay usuarios eliminados.</div></td></tr>`;
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
    if (!confirm("¿Eliminar este usuario? Quedará guardado temporalmente en la papelera.")) return;
    CAREDENT.deleteUser(btn.dataset.deleteUser);
    CAREDENT.showToast("Usuario eliminado. Puedes restaurarlo desde la papelera.", "ok"); render();
  });

  const tablaPapelera = document.getElementById("tablaUsuariosEliminados");
  if (tablaPapelera) {
    tablaPapelera.addEventListener("click", (e) => {
      const restoreBtn = e.target.closest("[data-restore-user]");
      if (restoreBtn) {
        const restaurado = CAREDENT.restoreUser(restoreBtn.dataset.restoreUser);
        if (restaurado) {
          CAREDENT.showToast("Usuario restaurado correctamente.", "ok");
        } else {
          CAREDENT.showToast("No se pudo restaurar: ya existe un usuario con ese nombre.", "danger");
        }
        render();
        return;
      }
      const purgeBtn = e.target.closest("[data-purge-user]");
      if (purgeBtn) {
        if (!confirm("¿Eliminar definitivamente este usuario? Esta acción no se puede deshacer.")) return;
        CAREDENT.permanentlyDeleteUser(purgeBtn.dataset.purgeUser);
        CAREDENT.showToast("Usuario eliminado definitivamente.", "ok");
        render();
      }
    });
  }

  render();
}
