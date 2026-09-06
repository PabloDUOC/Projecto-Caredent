CAREDENT.initLayout("dashboard");

  const pacientes = CAREDENT.getPatients();
  document.getElementById("kpiPacientes").textContent = pacientes.length;

  const conControl = pacientes.filter((p) => p.proximoControl);
  document.getElementById("kpiControles").textContent = conControl.length;

  const tratamientosEnCurso = pacientes.flatMap((p) => p.tratamientos).filter((t) => t.estado === "en-curso");
  document.getElementById("kpiTratamientos").textContent = tratamientosEnCurso.length;

  const ordenados = conControl.slice().sort((a, b) => a.proximoControl.fecha.localeCompare(b.proximoControl.fecha));
  if (ordenados.length) {
    document.getElementById("kpiProximo").textContent = CAREDENT.formatDate(ordenados[0].proximoControl.fecha);
    document.getElementById("kpiProximoSub").textContent = `${ordenados[0].nombre} ${ordenados[0].apellidos}`;
  } else {
    document.getElementById("kpiProximo").textContent = "Sin controles";
    document.getElementById("kpiProximoSub").textContent = "No hay controles agendados";
  }

  const tbody = document.getElementById("tablaProximos");
  if (!ordenados.length) {
    tbody.innerHTML = `<tr><td colspan="4"><div class="empty-state">No hay controles próximos registrados.</div></td></tr>`;
  } else {
    tbody.innerHTML = ordenados
      .slice(0, 5)
      .map(
        (p) => `
      <tr>
        <td class="cell-name"><a href="paciente.html?id=${p.id}">${p.nombre} ${p.apellidos}</a></td>
        <td>${CAREDENT.formatDate(p.proximoControl.fecha)}</td>
        <td>${p.proximoControl.motivo}</td>
        <td>${CAREDENT.estadoBadgeHTML(p.proximoControl.estado)}</td>
      </tr>`
      )
      .join("");
  }
