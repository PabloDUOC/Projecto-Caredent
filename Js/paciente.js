const session = CAREDENT.requireRole(["administrador", "recepcionista", "profesional"]);
if (session) {
  CAREDENT.initLayout("pacientes");
  CAREDENT.initTabs();
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  let p = CAREDENT.getPatientById(id);

  if (!p) {
    document.getElementById("notFound").style.display = "block";
  } else {
    document.getElementById("pacienteWrap").style.display = "block";
    const nombreCompleto = `${p.nombre} ${p.apellidos}`;
    document.getElementById("topTitle").textContent = nombreCompleto;
    document.title = `Caredent — ${nombreCompleto}`;

    if (session.rol === "administrador") {
      document.getElementById("btnEditarPaciente").style.display = "none";
      document.getElementById("btnEliminarPaciente").style.display = "none";
      document.querySelectorAll("[data-clinical-action]").forEach((b) => b.style.display = "none");
    } else {
      document.getElementById("btnEditarPaciente").href = `editar-paciente.html?id=${p.id}`;
    }

    function render() {
      p = CAREDENT.getPatientById(id);
      if (!p) { window.location.href = "pacientes.html"; return; }
      const nombre = `${p.nombre} ${p.apellidos}`;
      document.getElementById("topTitle").textContent = nombre;
      document.getElementById("phAvatar").textContent = (p.nombre[0] + p.apellidos[0]).toUpperCase();
      document.getElementById("phNombre").textContent = nombre;
      document.getElementById("phRut").textContent = p.rut;
      document.getElementById("phTelefono").textContent = p.telefono;
      document.getElementById("phEstado").innerHTML = CAREDENT.estadoBadgeHTML(p.estado);
      const edad = calcularEdad(p.fechaNacimiento);
      document.getElementById("phEdad").textContent = edad ? `${edad} años` : "Edad no disponible";
      document.getElementById("infoNombre").textContent = nombre;
      document.getElementById("infoRut").textContent = p.rut;
      document.getElementById("infoNacimiento").textContent = CAREDENT.formatDate(p.fechaNacimiento);
      document.getElementById("infoTelefono").textContent = p.telefono;
      document.getElementById("infoCorreo").textContent = p.correo;
      document.getElementById("infoDireccion").textContent = p.direccion || "—";
      document.getElementById("infoUltima").textContent = CAREDENT.formatDate(p.ultimaAtencion);
      document.getElementById("infoEstado").innerHTML = CAREDENT.estadoBadgeHTML(p.estado);
      document.getElementById("fichaGrupo").textContent = p.fichaClinica.grupoSanguineo;
      document.getElementById("fichaFecha").textContent = CAREDENT.formatDate(p.fichaClinica.fechaCreacion);
      document.getElementById("fichaObs").textContent = p.fichaClinica.observaciones;
      document.getElementById("fichaMedicos").textContent = p.antecedentes.medicos;
      document.getElementById("fichaOdonto").textContent = p.antecedentes.odontologicos;
      document.getElementById("fichaAlergias").textContent = p.antecedentes.alergias;

      const diagWrap = document.getElementById("listaDiagnosticos");
      diagWrap.innerHTML = p.diagnosticos.length ? p.diagnosticos.map((d, i) => `<div class="record-card"><div class="record-card__head"><div class="record-card__title">${d.descripcion}</div><div class="record-card__date">${CAREDENT.formatDate(d.fecha)}</div></div><div class="record-card__body">Registrado por ${d.profesional}.${session.rol === "profesional" ? ` <button class="btn btn--danger btn--sm" data-delete-diagnostico="${i}" type="button">Eliminar</button>` : ""}</div></div>`).join("") : `<div class="empty-state">Aún no se han registrado diagnósticos para este paciente.</div>`;

      const tratWrap = document.getElementById("listaTratamientos");
      tratWrap.innerHTML = p.tratamientos.length ? p.tratamientos.map((t, i) => `<div class="record-card"><div class="record-card__head"><div class="record-card__title">${t.nombre} <span class="cell-sub">· ${t.id}</span></div>${CAREDENT.estadoBadgeHTML(t.estado)}</div><div class="record-card__body">${t.descripcion}<br><span class="cell-sub">Inicio: ${CAREDENT.formatDate(t.fechaInicio)} · Profesional: ${t.profesional}</span><br>${session.rol === "profesional" ? `<button class="btn btn--ghost btn--sm" data-edit-treatment="${i}" type="button">Modificar</button> <button class="btn btn--danger btn--sm" data-delete-treatment="${i}" type="button">Eliminar</button>` : ""}</div></div>`).join("") : `<div class="empty-state">Aún no se han registrado tratamientos para este paciente.</div>`;

      const atenWrap = document.getElementById("listaAtenciones");
      atenWrap.innerHTML = p.atenciones.length ? p.atenciones.map(a => `<div class="record-card"><div class="record-card__head"><div class="record-card__title">${a.motivo}</div><div class="record-card__date">${CAREDENT.formatDate(a.fecha)}</div></div><div class="record-card__body">${a.notas}<br><span class="cell-sub">Atendido por ${a.profesional}</span></div></div>`).join("") : `<div class="empty-state">Aún no se han registrado atenciones para este paciente.</div>`;
      const timelineWrap = document.getElementById("timelineSeguimiento");
      timelineWrap.innerHTML = p.seguimiento.length ? p.seguimiento.map(s => `<div class="timeline-item ${s.futuro ? "is-future" : ""}"><div class="timeline-item__date">${CAREDENT.formatDate(s.fecha)}${s.futuro ? " · Programado" : ""}</div><div class="timeline-item__title">${s.titulo}</div><div class="timeline-item__body">${s.descripcion}</div></div>`).join("") : `<div class="empty-state">Sin evolución registrada todavía.</div>`;
      const proximoWrap = document.getElementById("cardProximoControl");
      proximoWrap.innerHTML = p.proximoControl ? `<div class="record-card__head"><div class="record-card__title">${p.proximoControl.motivo}</div>${CAREDENT.estadoBadgeHTML(p.proximoControl.estado)}</div><div class="record-card__body">Fecha programada: ${CAREDENT.formatDate(p.proximoControl.fecha)} ${session.rol === "profesional" ? `<br><button class="btn btn--ghost btn--sm" data-edit-control type="button">Modificar</button> <button class="btn btn--danger btn--sm" data-delete-control type="button">Eliminar</button>` : ""}</div>` : `<div class="text-muted">No hay un próximo control agendado para este paciente.</div>`;
    }

    document.getElementById("btnEliminarPaciente").addEventListener("click", () => {
      if (!confirm("¿Eliminar definitivamente este paciente de la demostración frontend?")) return;
      CAREDENT.deletePatient(id); CAREDENT.showToast("Paciente eliminado correctamente.", "ok");
      setTimeout(() => window.location.href = "pacientes.html", 500);
    });

    document.addEventListener("click", (e) => {
      if (session.rol !== "profesional") return;
      const delT = e.target.closest("[data-delete-treatment]");
      if (delT) { if (!confirm("¿Eliminar este tratamiento?")) return; p.tratamientos.splice(Number(delT.dataset.deleteTreatment), 1); CAREDENT.updatePatient(id,{tratamientos:p.tratamientos}); render(); CAREDENT.showToast("Tratamiento eliminado."); return; }
      const editT = e.target.closest("[data-edit-treatment]");
      if (editT) { const t=p.tratamientos[Number(editT.dataset.editTreatment)]; const nombre=prompt("Nombre del tratamiento",t.nombre); if(!nombre) return; const estado=prompt("Estado: pendiente, en-curso o finalizado",t.estado)||t.estado; t.nombre=nombre; t.estado=estado; CAREDENT.updatePatient(id,{tratamientos:p.tratamientos}); render(); CAREDENT.showToast("Tratamiento modificado."); return; }
      if (e.target.closest("[data-delete-diagnostico]")) { const i=Number(e.target.closest("[data-delete-diagnostico]").dataset.deleteDiagnostico); if(!confirm("¿Eliminar este diagnóstico?")) return; p.diagnosticos.splice(i,1); CAREDENT.updatePatient(id,{diagnosticos:p.diagnosticos}); render(); return; }
      if (e.target.closest("[data-delete-control]")) { if(!confirm("¿Eliminar el próximo control?")) return; p.proximoControl=null; p.seguimiento=p.seguimiento.filter(s=>!s.futuro); CAREDENT.updatePatient(id,{proximoControl:null,seguimiento:p.seguimiento}); render(); CAREDENT.showToast("Control eliminado."); return; }
      if (e.target.closest("[data-edit-control]")) { const fecha=prompt("Fecha del próximo control (AAAA-MM-DD)",p.proximoControl.fecha); if(!fecha) return; const motivo=prompt("Motivo",p.proximoControl.motivo)||p.proximoControl.motivo; p.proximoControl={...p.proximoControl,fecha,motivo}; const futuro=p.seguimiento.find(s=>s.futuro); if(futuro){futuro.fecha=fecha;futuro.titulo=motivo;} CAREDENT.updatePatient(id,{proximoControl:p.proximoControl,seguimiento:p.seguimiento}); render(); CAREDENT.showToast("Control modificado."); return; }
    });

    document.querySelector('[data-clinical-action="nuevo-tratamiento"]').addEventListener("click", () => {
      const nombre=prompt("Nombre del tratamiento"); if(!nombre) return; const descripcion=prompt("Descripción")||"Tratamiento registrado en la demostración."; const estado=prompt("Estado: pendiente, en-curso o finalizado","pendiente")||"pendiente";
      p.tratamientos.push({id:`T-${Date.now().toString().slice(-4)}`,nombre,estado,fechaInicio:CAREDENT.todayISO(),profesional:session.nombre,descripcion});
      CAREDENT.updatePatient(id,{tratamientos:p.tratamientos}); render(); CAREDENT.showToast("Tratamiento registrado.");
    });
    document.querySelector('[data-clinical-action="nuevo-control"]').addEventListener("click", () => {
      const fecha=prompt("Fecha del próximo control (AAAA-MM-DD)"); if(!fecha) return; const motivo=prompt("Motivo del control")||"Control de seguimiento";
      p.proximoControl={fecha,motivo,estado:"pendiente"}; p.seguimiento=(p.seguimiento||[]).filter(s=>!s.futuro); p.seguimiento.push({fecha,titulo:motivo,descripcion:"Control programado.",futuro:true});
      CAREDENT.updatePatient(id,{proximoControl:p.proximoControl,seguimiento:p.seguimiento}); render(); CAREDENT.showToast("Próximo control registrado.");
    });
    render();
  }

  function calcularEdad(fechaISO) { if (!fechaISO) return null; const nacimiento=new Date(fechaISO); if(isNaN(nacimiento)) return null; const hoy=new Date(); let edad=hoy.getFullYear()-nacimiento.getFullYear(); const m=hoy.getMonth()-nacimiento.getMonth(); if(m<0||(m===0&&hoy.getDate()<nacimiento.getDate())) edad--; return edad; }
}
