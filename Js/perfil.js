CAREDENT.initLayout("perfil");

  const session = CAREDENT.getSession();
  if (session) {
    document.getElementById("profileAvatar").textContent = session.nombre.split(" ").map(p => p[0]).slice(0,2).join("").toUpperCase();
    document.getElementById("profileName").textContent = session.nombre;
    const rolLabel = { administrador: "Administrador", recepcionista: "Recepcionista", profesional: "Profesional" }[session.rol] || session.rol;
    document.getElementById("profileRole").textContent = rolLabel;
    document.getElementById("profileUsuario").textContent = session.usuario;
    document.getElementById("profileRolCompleto").textContent = rolLabel;
    document.getElementById("profileInicio").textContent = new Date(session.inicio).toLocaleString("es-CL");
  }
