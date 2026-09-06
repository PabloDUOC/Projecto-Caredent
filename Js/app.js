/* ==========================================================================
   Caredent — Proyecto académico
   JavaScript general: datos de prueba, sesión simulada, navegación,
   búsqueda/filtros, pestañas, validación de formularios y mensajes.

   IMPORTANTE: este proyecto es solo Frontend. No existe backend ni base
   de datos real. localStorage se usa únicamente para simular persistencia
   entre páginas durante la demostración.
   ========================================================================== */

const CAREDENT = (() => {

  const STORAGE_KEYS = {
    patients: "caredent_pacientes",
    users: "caredent_usuarios",
    session: "caredent_sesion",
  };

  /* ------------------------------------------------------------------
     1. Datos de prueba (ficticios)
     ------------------------------------------------------------------ */

  function seedPatients() {
    return [
      {
        id: 1,
        nombre: "Juan",
        apellidos: "Pérez Soto",
        rut: "12.345.678-9",
        fechaNacimiento: "1990-05-14",
        telefono: "+56 9 1234 5678",
        correo: "juan.perez@ejemplo.cl",
        direccion: "Av. Siempre Viva 123, Santiago",
        estado: "activo",
        ultimaAtencion: "2026-08-20",
        antecedentes: {
          medicos: "Hipertensión controlada con medicamento. Sin alergias a anestesia.",
          odontologicos: "Tratamiento de conducto en pieza 36 (2022). Uso de placa de descarga nocturna.",
          alergias: "Penicilina.",
        },
        fichaClinica: {
          grupoSanguineo: "O+",
          fechaCreacion: "2024-02-10",
          observaciones: "Paciente colaborador. Buena higiene oral. Control de placa cada 6 meses.",
        },
        diagnosticos: [
          { fecha: "2026-08-20", descripcion: "Caries interproximal en pieza 26.", profesional: "Dra. Camila Rivas" },
          { fecha: "2026-03-02", descripcion: "Gingivitis leve generalizada.", profesional: "Dra. Camila Rivas" },
        ],
        tratamientos: [
          { id: "T-101", nombre: "Obturación pieza 26", estado: "en-curso", fechaInicio: "2026-08-20", profesional: "Dra. Camila Rivas", descripcion: "Restauración con resina compuesta, sesión única." },
          { id: "T-098", nombre: "Destartraje y pulido", estado: "finalizado", fechaInicio: "2026-03-02", profesional: "Dra. Camila Rivas", descripcion: "Profilaxis completa, control de placa bacteriana." },
        ],
        atenciones: [
          { fecha: "2026-08-20", motivo: "Control y obturación", profesional: "Dra. Camila Rivas", notas: "Paciente refiere sensibilidad leve al frío. Se indica pasta desensibilizante." },
          { fecha: "2026-03-02", motivo: "Destartraje", profesional: "Dra. Camila Rivas", notas: "Buena tolerancia al procedimiento. Se refuerza técnica de cepillado." },
        ],
        seguimiento: [
          { fecha: "2026-03-02", titulo: "Ingreso y diagnóstico inicial", descripcion: "Se registran antecedentes y se detecta gingivitis leve.", futuro: false },
          { fecha: "2026-03-02", titulo: "Destartraje y pulido", descripcion: "Tratamiento finalizado sin complicaciones.", futuro: false },
          { fecha: "2026-08-20", titulo: "Nueva caries detectada", descripcion: "Diagnóstico de caries en pieza 26, inicio de obturación.", futuro: false },
          { fecha: "2026-09-15", titulo: "Control de obturación", descripcion: "Revisar adaptación marginal y sensibilidad.", futuro: true },
        ],
        proximoControl: { fecha: "2026-09-15", motivo: "Control de obturación pieza 26", estado: "pendiente" },
      },
      {
        id: 2,
        nombre: "María",
        apellidos: "Soto Vidal",
        rut: "15.678.234-2",
        fechaNacimiento: "1985-11-02",
        telefono: "+56 9 8765 4321",
        correo: "maria.soto@ejemplo.cl",
        direccion: "Los Álamos 456, Providencia",
        estado: "en-tratamiento",
        ultimaAtencion: "2026-08-28",
        antecedentes: {
          medicos: "Sin antecedentes mórbidos relevantes.",
          odontologicos: "Ortodoncia en la adolescencia. Bruxismo nocturno.",
          alergias: "Sin alergias conocidas.",
        },
        fichaClinica: {
          grupoSanguineo: "A+",
          fechaCreacion: "2023-07-19",
          observaciones: "Usuaria de férula de relajación por bruxismo. Requiere seguimiento periodontal.",
        },
        diagnosticos: [
          { fecha: "2026-08-28", descripcion: "Periodontitis moderada, sector posterior inferior.", profesional: "Dr. Ignacio Fuentes" },
        ],
        tratamientos: [
          { id: "T-110", nombre: "Tratamiento periodontal", estado: "en-curso", fechaInicio: "2026-08-28", profesional: "Dr. Ignacio Fuentes", descripcion: "Raspaje y alisado radicular por cuadrantes, 4 sesiones planificadas." },
        ],
        atenciones: [
          { fecha: "2026-08-28", motivo: "Evaluación periodontal", profesional: "Dr. Ignacio Fuentes", notas: "Se realiza periodontograma. Inicio de plan de tratamiento por cuadrantes." },
          { fecha: "2026-05-10", motivo: "Control general", profesional: "Dr. Ignacio Fuentes", notas: "Sin hallazgos relevantes. Se refuerza uso de férula nocturna." },
        ],
        seguimiento: [
          { fecha: "2026-05-10", titulo: "Control general", descripcion: "Evaluación de rutina, uso correcto de férula.", futuro: false },
          { fecha: "2026-08-28", titulo: "Diagnóstico periodontal", descripcion: "Se detecta periodontitis moderada, inicia tratamiento por cuadrantes.", futuro: false },
          { fecha: "2026-09-10", titulo: "Raspaje cuadrante 2", descripcion: "Continuación del tratamiento periodontal.", futuro: true },
        ],
        proximoControl: { fecha: "2026-09-10", motivo: "Raspaje y alisado, cuadrante 2", estado: "pendiente" },
      },
      {
        id: 3,
        nombre: "Pedro",
        apellidos: "González Muñoz",
        rut: "9.876.543-1",
        fechaNacimiento: "1998-01-27",
        telefono: "+56 9 5544 3322",
        correo: "pedro.gonzalez@ejemplo.cl",
        direccion: "Camino Real 789, Ñuñoa",
        estado: "activo",
        ultimaAtencion: "2026-07-05",
        antecedentes: {
          medicos: "Asma leve, uso de inhalador ocasional.",
          odontologicos: "Extracción de terceros molares (2020).",
          alergias: "Sin alergias conocidas.",
        },
        fichaClinica: {
          grupoSanguineo: "B+",
          fechaCreacion: "2022-09-01",
          observaciones: "Paciente sin controles hace más de un mes, se recomienda contactar.",
        },
        diagnosticos: [
          { fecha: "2026-07-05", descripcion: "Sin hallazgos patológicos activos.", profesional: "Dra. Camila Rivas" },
        ],
        tratamientos: [
          { id: "T-087", nombre: "Blanqueamiento dental", estado: "finalizado", fechaInicio: "2026-07-05", profesional: "Dra. Camila Rivas", descripcion: "Blanqueamiento en consulta, sesión única." },
        ],
        atenciones: [
          { fecha: "2026-07-05", motivo: "Blanqueamiento y control", profesional: "Dra. Camila Rivas", notas: "Procedimiento sin incidentes. Se indican cuidados post-blanqueamiento." },
        ],
        seguimiento: [
          { fecha: "2026-07-05", titulo: "Blanqueamiento dental", descripcion: "Procedimiento realizado sin complicaciones.", futuro: false },
        ],
        proximoControl: null,
      },
      {
        id: 4,
        nombre: "Camila",
        apellidos: "Rojas Espinoza",
        rut: "18.234.567-5",
        fechaNacimiento: "2001-09-30",
        telefono: "+56 9 2233 4455",
        correo: "camila.rojas@ejemplo.cl",
        direccion: "Pasaje Las Rosas 22, La Florida",
        estado: "pendiente",
        ultimaAtencion: "2026-06-12",
        antecedentes: {
          medicos: "Sin antecedentes relevantes.",
          odontologicos: "Primera consulta en la clínica.",
          alergias: "Alergia al látex.",
        },
        fichaClinica: {
          grupoSanguineo: "O-",
          fechaCreacion: "2026-06-12",
          observaciones: "Ficha recién creada, pendiente completar antecedentes familiares.",
        },
        diagnosticos: [
          { fecha: "2026-06-12", descripcion: "Caries múltiples en piezas posteriores, evaluación en curso.", profesional: "Dr. Ignacio Fuentes" },
        ],
        tratamientos: [
          { id: "T-105", nombre: "Plan de obturaciones múltiples", estado: "pendiente", fechaInicio: "2026-09-05", profesional: "Dr. Ignacio Fuentes", descripcion: "Plan de 3 sesiones para tratar caries detectadas." },
        ],
        atenciones: [
          { fecha: "2026-06-12", motivo: "Primera consulta", profesional: "Dr. Ignacio Fuentes", notas: "Evaluación inicial, se solicitan radiografías bite-wing." },
        ],
        seguimiento: [
          { fecha: "2026-06-12", titulo: "Primera consulta", descripcion: "Evaluación inicial y solicitud de radiografías.", futuro: false },
          { fecha: "2026-09-05", titulo: "Inicio plan de obturaciones", descripcion: "Primera sesión del plan de tratamiento.", futuro: true },
        ],
        proximoControl: { fecha: "2026-09-05", motivo: "Inicio plan de obturaciones", estado: "pendiente" },
      },
      {
        id: 5,
        nombre: "Diego",
        apellidos: "Fuentes Araya",
        rut: "14.111.222-8",
        fechaNacimiento: "1979-04-18",
        telefono: "+56 9 6677 8899",
        correo: "diego.fuentes@ejemplo.cl",
        direccion: "El Bosque 310, Macul",
        estado: "inactivo",
        ultimaAtencion: "2025-11-30",
        antecedentes: {
          medicos: "Diabetes tipo 2, controlada.",
          odontologicos: "Uso de prótesis parcial removible superior.",
          alergias: "Sin alergias conocidas.",
        },
        fichaClinica: {
          grupoSanguineo: "AB+",
          fechaCreacion: "2021-03-15",
          observaciones: "Paciente sin controles hace más de 6 meses.",
        },
        diagnosticos: [
          { fecha: "2025-11-30", descripcion: "Desadaptación leve de prótesis removible.", profesional: "Dra. Camila Rivas" },
        ],
        tratamientos: [
          { id: "T-064", nombre: "Ajuste de prótesis removible", estado: "finalizado", fechaInicio: "2025-11-30", profesional: "Dra. Camila Rivas", descripcion: "Rebase y ajuste oclusal de prótesis." },
        ],
        atenciones: [
          { fecha: "2025-11-30", motivo: "Ajuste de prótesis", profesional: "Dra. Camila Rivas", notas: "Se realiza rebase. Paciente indica mejor adaptación." },
        ],
        seguimiento: [
          { fecha: "2025-11-30", titulo: "Ajuste de prótesis", descripcion: "Procedimiento realizado, se recomienda control en 6 meses.", futuro: false },
        ],
        proximoControl: null,
      },
    ];
  }

  const USUARIOS_INICIALES = [
    { id: 1, usuario: "admin", clave: "admin123", rol: "administrador", nombre: "Sofía Herrera" },
    { id: 2, usuario: "recepcion", clave: "recepcion123", rol: "recepcionista", nombre: "Valentina Muñoz" },
    { id: 3, usuario: "profesional", clave: "profesional123", rol: "profesional", nombre: "Dra. Camila Rivas" },
  ];

  function ensureSeedData() {
    if (!localStorage.getItem(STORAGE_KEYS.patients)) {
      localStorage.setItem(STORAGE_KEYS.patients, JSON.stringify(seedPatients()));
    }
    if (!localStorage.getItem(STORAGE_KEYS.users)) {
      localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(USUARIOS_INICIALES));
    }
  }

  function getPatients() {
    ensureSeedData();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.patients)) || [];
    } catch (e) {
      return [];
    }
  }

  function savePatients(list) {
    localStorage.setItem(STORAGE_KEYS.patients, JSON.stringify(list));
  }

  function getPatientById(id) {
    return getPatients().find((p) => String(p.id) === String(id));
  }

  function addPatient(patient) {
    const list = getPatients();
    const nextId = list.length ? Math.max(...list.map((p) => p.id)) + 1 : 1;
    const nuevo = Object.assign(
      {
        id: nextId,
        estado: "pendiente",
        ultimaAtencion: "—",
        antecedentes: { medicos: "Por registrar.", odontologicos: "Por registrar.", alergias: "Por registrar." },
        fichaClinica: { grupoSanguineo: "Por registrar", fechaCreacion: todayISO(), observaciones: "Ficha creada al momento del registro." },
        diagnosticos: [],
        tratamientos: [],
        atenciones: [],
        seguimiento: [{ fecha: todayISO(), titulo: "Ingreso al sistema", descripcion: "Paciente registrado en Caredent.", futuro: false }],
        proximoControl: null,
      },
      patient
    );
    list.unshift(nuevo);
    savePatients(list);
    return nuevo;
  }

  function updatePatient(id, changes) {
    const list = getPatients();
    const index = list.findIndex((p) => String(p.id) === String(id));
    if (index === -1) return null;
    list[index] = { ...list[index], ...changes };
    savePatients(list);
    return list[index];
  }

  function deletePatient(id) {
    const list = getPatients();
    const next = list.filter((p) => String(p.id) !== String(id));
    if (next.length === list.length) return false;
    savePatients(next);
    return true;
  }

  function getUsers() {
    ensureSeedData();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.users)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveUsers(list) {
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(list));
  }

  function addUser(user) {
    const list = getUsers();
    const nextId = list.length ? Math.max(...list.map((u) => u.id)) + 1 : 1;
    const nuevo = { id: nextId, ...user };
    list.push(nuevo);
    saveUsers(list);
    return nuevo;
  }

  function deleteUser(id) {
    const session = getSession();
    if (session && String(session.userId) === String(id)) return false;
    const list = getUsers();
    const next = list.filter((u) => String(u.id) !== String(id));
    if (next.length === list.length) return false;
    saveUsers(next);
    return true;
  }

  function requireRole(roles) {
    const session = requireSession();
    if (!session) return null;
    const allowed = Array.isArray(roles) ? roles : [roles];
    if (!allowed.includes(session.rol)) {
      window.location.href = pathTo("dashboard.html");
      return null;
    }
    return session;
  }

  function todayISO() {
    return new Date().toISOString().slice(0, 10);
  }

  function formatDate(iso) {
    if (!iso || iso === "—") return "—";
    const [y, m, d] = iso.split("-");
    if (!y || !m || !d) return iso;
    return `${d}-${m}-${y}`;
  }

  /* ------------------------------------------------------------------
     2. Estados: etiquetas y clases de badge
     ------------------------------------------------------------------ */

  const ESTADOS = {
    "activo": { label: "Activo", badge: "badge--ok" },
    "en-tratamiento": { label: "En tratamiento", badge: "badge--warn" },
    "pendiente": { label: "Pendiente", badge: "badge--warn" },
    "inactivo": { label: "Inactivo", badge: "badge--muted" },
    "en-curso": { label: "En curso", badge: "badge--warn" },
    "finalizado": { label: "Finalizado", badge: "badge--ok" },
    "confirmado": { label: "Confirmado", badge: "badge--ok" },
  };

  function estadoBadgeHTML(estado) {
    const e = ESTADOS[estado] || { label: estado, badge: "badge--muted" };
    return `<span class="badge ${e.badge}">${e.label}</span>`;
  }

  /* ------------------------------------------------------------------
     3. Sesión simulada (login)
     ------------------------------------------------------------------ */

  const ROL_LABEL = {
    administrador: "Administrador",
    recepcionista: "Recepcionista",
    profesional: "Profesional",
  };

  function attemptLogin(usuario, clave, rolSeleccionado) {
    const match = getUsers().find(
      (u) => u.usuario === usuario.trim().toLowerCase() && u.clave === clave
    );
    if (!match) return { ok: false, error: "Usuario o contraseña incorrectos." };
    if (rolSeleccionado && match.rol !== rolSeleccionado) {
      return { ok: false, error: `Ese usuario corresponde al rol "${ROL_LABEL[match.rol]}".` };
    }
    const session = { userId: match.id, usuario: match.usuario, rol: match.rol, nombre: match.nombre, inicio: Date.now() };
    localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
    return { ok: true, session };
  }

  function getSession() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.session));
    } catch (e) {
      return null;
    }
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEYS.session);
    window.location.href = pathTo("index.html");
  }

  function requireSession() {
    const session = getSession();
    if (!session) {
      window.location.href = pathTo("index.html");
      return null;
    }
    return session;
  }

  // Resuelve una ruta relativa a la raíz del proyecto según la ubicación actual.
  function pathTo(target) {
    const inPages = window.location.pathname.includes("/pages/");
    if (target === "index.html") return inPages ? "../index.html" : "index.html";
    return inPages ? target : `pages/${target}`;
  }

  /* ------------------------------------------------------------------
     4. Layout: sidebar activo + usuario en topbar
     ------------------------------------------------------------------ */

  function initLayout(activeKey) {
    const session = requireSession();
    if (!session) return;

    document.querySelectorAll("[data-nav]").forEach((link) => {
      link.classList.toggle("is-active", link.dataset.nav === activeKey);
      const requiredRoles = link.dataset.role ? link.dataset.role.split(",") : null;
      if (requiredRoles && !requiredRoles.includes(session.rol)) {
        link.style.display = "none";
      }
    });

    document.querySelectorAll("[data-role]").forEach((el) => {
      const requiredRoles = el.dataset.role.split(",");
      if (!requiredRoles.includes(session.rol)) el.style.display = "none";
    });

    const pillName = document.querySelector("[data-user-name]");
    const pillRole = document.querySelector("[data-user-role]");
    const avatar = document.querySelector("[data-user-avatar]");
    if (pillName) pillName.textContent = session.nombre;
    if (pillRole) pillRole.textContent = ROL_LABEL[session.rol] || session.rol;
    if (avatar) avatar.textContent = initials(session.nombre);

    document.querySelectorAll("[data-logout]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        logout();
      });
    });
  }

  function initials(nombre) {
    return nombre
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0])
      .join("")
      .toUpperCase();
  }

  /* ------------------------------------------------------------------
     5. Pestañas genéricas (paciente.html)
     ------------------------------------------------------------------ */

  function initTabs(root = document) {
    const tabButtons = root.querySelectorAll(".tab-btn");
    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.tab;
        root.querySelectorAll(".tab-btn").forEach((b) => b.classList.toggle("is-active", b === btn));
        root.querySelectorAll(".tab-panel").forEach((panel) => {
          panel.classList.toggle("is-active", panel.dataset.tabPanel === target);
        });
      });
    });
  }

  /* ------------------------------------------------------------------
     6. Toasts / mensajes de confirmación
     ------------------------------------------------------------------ */

  function showToast(message, type = "ok") {
    let toast = document.querySelector(".toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.className = `toast toast--${type} is-visible`;
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove("is-visible"), 3200);
  }

  /* ------------------------------------------------------------------
     7. Validación de formularios
     ------------------------------------------------------------------ */

  function validateField(input) {
    const field = input.closest(".field");
    if (!field) return true;
    let valid = true;
    const value = input.value.trim();

    if (input.hasAttribute("required") && !value) valid = false;
    if (valid && input.type === "email" && value) {
      valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
    if (valid && input.dataset.pattern === "rut" && value) {
      valid = /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/.test(value);
    }
    if (valid && input.dataset.pattern === "phone" && value) {
      valid = /^\+?\d[\d\s]{6,}$/.test(value);
    }

    field.classList.toggle("has-error", !valid);
    return valid;
  }

  function initFormValidation(form) {
    if (!form) return;
    form.querySelectorAll("input, select, textarea").forEach((input) => {
      input.addEventListener("blur", () => validateField(input));
    });
  }

  function validateForm(form) {
    let allValid = true;
    form.querySelectorAll("input, select, textarea").forEach((input) => {
      if (!validateField(input)) allValid = false;
    });
    return allValid;
  }

  return {
    STORAGE_KEYS,
    ensureSeedData,
    getPatients,
    savePatients,
    getPatientById,
    addPatient,
    updatePatient,
    deletePatient,
    getUsers,
    saveUsers,
    addUser,
    deleteUser,
    requireRole,
    todayISO,
    formatDate,
    ESTADOS,
    estadoBadgeHTML,
    attemptLogin,
    getSession,
    logout,
    requireSession,
    pathTo,
    initLayout,
    initTabs,
    showToast,
    initFormValidation,
    validateField,
    validateForm,
  };
})();
