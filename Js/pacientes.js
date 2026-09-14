const session = CAREDENT.requireRole(["administrador", "recepcionista", "profesional"]);
if (session) {
  CAREDENT.initLayout("pacientes");
  let pacientes = CAREDENT.getPatients();
  let filtroTexto = "";
  let filtroEstado = "todos";

  function render() {
    const tbody = document.getElementById("tablaPacientes");
    const texto = filtroTexto.trim().toLowerCase();
    const filtrados = pacientes.filter((p) => {
      const coincideTexto = !texto || `${p.nombre} ${p.apellidos}`.toLowerCase().includes(texto) || p.rut.toLowerCase().includes(texto);
      return coincideTexto && (filtroEstado === "todos" || p.estado === filtroEstado);
    });
    if (!filtrados.length) {
      tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state">No se encontraron pacientes con ese criterio de búsqueda.</div></td></tr>`;
      return;
    }
    tbody.innerHTML = filtrados.map((p) => `
      <tr>
        <td class="cell-name">${p.nombre} ${p.apellidos}</td><td>${p.rut}</td><td>${CAREDENT.formatDate(p.ultimaAtencion)}</td><td>${CAREDENT.estadoBadgeHTML(p.estado)}</td>
        <td style="text-align:right"><a class="btn btn--ghost btn--sm" href="paciente.html?id=${p.id}">Ver paciente</a>
        ${session.rol !== "administrador" ? `<a class="btn btn--ghost btn--sm" href="editar-paciente.html?id=${p.id}">Modificar</a><button class="btn btn--danger btn--sm" data-delete-patient="${p.id}" type="button">Eliminar</button>` : ""}</td>
      </tr>`).join("");
  }

  document.getElementById("buscador").addEventListener("input", (e) => { filtroTexto = e.target.value; render(); });
  document.getElementById("filtros").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip"); if (!chip) return;
    filtroEstado = chip.dataset.estado;
    document.querySelectorAll("#filtros .chip").forEach((c) => c.classList.toggle("is-active", c === chip)); render();
  });
  document.getElementById("tablaPacientes").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-delete-patient]"); if (!btn) return;
    if (!confirm("¿Eliminar este paciente? Esta acción se realiza solo en la demostración frontend.")) return;
    CAREDENT.deletePatient(btn.dataset.deletePatient); pacientes = CAREDENT.getPatients();
    CAREDENT.showToast("Paciente eliminado correctamente.", "ok"); render();
  });
  render();
}
