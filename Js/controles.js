const session = CAREDENT.requireRole(["administrador", "recepcionista", "profesional"]);
if (session) {
  CAREDENT.initLayout("controles");
  let filtroEstado = "todos";
  const pacientes = CAREDENT.getPatients();

  function render() {
    const tbody = document.getElementById("tablaControles");
    const filtrados = pacientes.filter((p) => filtroEstado === "todos" || p.estado === filtroEstado);
    if (!filtrados.length) {
      tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state">No hay pacientes que coincidan con este filtro.</div></td></tr>`;
      return;
    }
    tbody.innerHTML = filtrados.map((p) => {
      const c = p.proximoControl;
      return `<tr><td class="cell-name">${p.nombre} ${p.apellidos}</td><td>${c ? CAREDENT.formatDate(c.fecha) : "Sin control"}</td><td>${c ? c.motivo : "No registrado"}</td><td>${CAREDENT.estadoBadgeHTML(p.estado)}</td><td style="text-align:right"><a class="btn btn--ghost btn--sm" href="paciente.html?id=${p.id}">Consultar paciente</a></td></tr>`;
    }).join("");
  }

  document.getElementById("filtros").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip"); if (!chip) return;
    filtroEstado = chip.dataset.estado;
    document.querySelectorAll("#filtros .chip").forEach((c) => c.classList.toggle("is-active", c === chip)); render();
  });
  render();
}
