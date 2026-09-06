const session = CAREDENT.requireRole(["recepcionista", "profesional"]);
if (session) {
CAREDENT.initLayout("pacientes");

  const form = document.getElementById("formPaciente");
  CAREDENT.initFormValidation(form);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const valid = CAREDENT.validateForm(form);
    if (!valid) {
      CAREDENT.showToast("Revisa los campos marcados en rojo.", "danger");
      return;
    }

    const motivo = document.getElementById("motivoConsulta").value.trim();

    const nuevo = CAREDENT.addPatient({
      nombre: document.getElementById("nombre").value.trim(),
      apellidos: document.getElementById("apellidos").value.trim(),
      rut: document.getElementById("rut").value.trim(),
      fechaNacimiento: document.getElementById("fechaNacimiento").value,
      telefono: document.getElementById("telefono").value.trim(),
      correo: document.getElementById("correo").value.trim(),
      direccion: document.getElementById("direccion").value.trim() || "Por registrar",
      antecedentes: {
        medicos: document.getElementById("antecedentesMedicos").value.trim() || "Por registrar.",
        odontologicos: document.getElementById("antecedentesOdonto").value.trim() || "Por registrar.",
        alergias: document.getElementById("alergias").value.trim() || "Sin alergias conocidas.",
      },
      fichaClinica: {
        grupoSanguineo: document.getElementById("grupoSanguineo").value,
        fechaCreacion: CAREDENT.todayISO(),
        observaciones: "Ficha creada al momento del registro.",
      },
      atenciones: motivo
        ? [{ fecha: CAREDENT.todayISO(), motivo: "Primera consulta", profesional: "Por asignar", notas: motivo }]
        : [],
    });

    CAREDENT.showToast(`Paciente ${nuevo.nombre} ${nuevo.apellidos} registrado correctamente.`, "ok");
    form.reset();
    setTimeout(() => {
      window.location.href = `paciente.html?id=${nuevo.id}`;
    }, 900);
  });

}
