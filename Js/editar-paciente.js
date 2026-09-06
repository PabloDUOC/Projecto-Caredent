const session = CAREDENT.requireRole(["recepcionista", "profesional"]);
if (session) {
  const id = new URLSearchParams(window.location.search).get("id");
  const paciente = CAREDENT.getPatientById(id);
  const form = document.getElementById("formEditarPaciente");
  const msg = document.getElementById("editMsg");

  if (!paciente) {
    msg.textContent = "Paciente no encontrado.";
    msg.classList.add("is-visible", "is-error");
    form.querySelectorAll("input, select, button").forEach((el) => el.disabled = true);
  } else {
    ["nombre", "apellidos", "rut", "fechaNacimiento", "telefono", "correo", "direccion", "estado"].forEach((idCampo) => {
      document.getElementById(idCampo).value = paciente[idCampo] || "";
    });
    grupoSanguineo.value = paciente.fichaClinica?.grupoSanguineo || "Por registrar";
    alergias.value = paciente.antecedentes?.alergias || "";
    antecedentesMedicos.value = paciente.antecedentes?.medicos || "";
    antecedentesOdonto.value = paciente.antecedentes?.odontologicos || "";
    CAREDENT.initFormValidation(form);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!CAREDENT.validateForm(form)) {
        CAREDENT.showToast("Revisa los campos marcados en rojo.", "danger");
        return;
      }
      CAREDENT.updatePatient(id, {
        nombre: nombre.value.trim(), apellidos: apellidos.value.trim(), rut: rut.value.trim(),
        fechaNacimiento: fechaNacimiento.value, telefono: telefono.value.trim(), correo: correo.value.trim(),
        direccion: direccion.value.trim() || "Por registrar", estado: estado.value,
        antecedentes: { medicos: antecedentesMedicos.value.trim() || "Por registrar.", odontologicos: antecedentesOdonto.value.trim() || "Por registrar.", alergias: alergias.value.trim() || "Sin alergias conocidas." },
        fichaClinica: { ...(paciente.fichaClinica || {}), grupoSanguineo: grupoSanguineo.value },
      });
      CAREDENT.showToast("Información del paciente actualizada correctamente.", "ok");
      setTimeout(() => window.location.href = `paciente.html?id=${id}`, 700);
    });
  }
}
