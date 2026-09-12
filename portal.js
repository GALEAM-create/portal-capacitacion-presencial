const API = (
  window.PORTAL_CONFIG?.apiBase || ""
).replace(/\/$/, "");

const loginView =
  document.querySelector("#loginView");

const dashboard =
  document.querySelector("#dashboardView");

const form =
  document.querySelector("#loginForm");

const message =
  document.querySelector("#loginMessage");

const button =
  document.querySelector("#loginButton");

const diamanteCourse =
  document.querySelector("#diamanteCourse");

const pericentroCourse =
  document.querySelector("#pericentroCourse");

const pericentroLink =
  document.querySelector("#pericentroLink");

const conflictosCourse =
  document.querySelector("#conflictosCourse");

function normalizeService(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .toUpperCase();
}

function isDiamanteService(value) {
  return [
    "WALMART DIAMANTE",
    "DIAMANTE"
  ].includes(normalizeService(value));
}

function isPericentroService(value) {
  return [
    "WALMART PERICENTRO",
    "PERICENTRO"
  ].includes(normalizeService(value));
}

function participantExamUrl(path, participant) {
  const url = new URL(
    path,
    document.baseURI
  );

  url.searchParams.set(
    "nombre",
    participant.nombre || ""
  );

  url.searchParams.set(
    "numero_empleado",
    participant.numero_empleado || ""
  );

  url.searchParams.set(
    "servicio",
    participant.servicio || ""
  );

  return url.href;
}

function showParticipant(participant) {
  const servicio = normalizeService(
    participant.servicio
  );

  const esPericentro =
    isPericentroService(servicio);

  const netVetExam =
    document.querySelector("#netVetExam");

  const esNetVet = [
    "WALMART NET",
    "WALMART VET",
    "NET",
    "VET",
    "WALMART NET Y VET",
    "WALMART VET Y NET"
  ].includes(servicio);

  if (netVetExam) {
    netVetExam.hidden = !esNetVet;
  }

  if (diamanteCourse) {
    diamanteCourse.hidden =
      !isDiamanteService(servicio);
  }

  if (pericentroCourse) {
    pericentroCourse.hidden =
      !esPericentro;
  }

  if (conflictosCourse) {
    conflictosCourse.hidden =
      esPericentro;
  }

  if (
    pericentroLink &&
    esPericentro
  ) {
    pericentroLink.href =
      participantExamUrl(
        "evaluaciones/walmart-pericentro/",
        participant
      );
  }

  document.querySelector(
    "#welcomeName"
  ).textContent =
    `Bienvenido, ${
      participant.nombre.split(" ")[0]
    }`;

  document.querySelector(
    "#employeeNumber"
  ).textContent =
    `Empleado: ${
      participant.numero_empleado
    }`;

  document.querySelector(
    "#serviceName"
  ).textContent =
    `Servicio: ${
      participant.servicio ||
      "Sin asignar"
    }`;

  loginView.style.display = "none";
  dashboard.style.display = "block";
}

async function session() {
  const response = await fetch(
    `${API}/api/portal/session`,
    {
      credentials: "include",
      cache: "no-store"
    }
  );

  if (!response.ok) {
    return;
  }

  const data = await response.json();

  if (
    data.autenticado &&
    data.participante
  ) {
    showParticipant(
      data.participante
    );
  }
}

form.addEventListener(
  "submit",
  async event => {
    event.preventDefault();

    message.textContent = "";
    button.disabled = true;
    button.textContent =
      "Verificando...";

    try {
      const response = await fetch(
        `${API}/api/portal/login`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            nombre:
              form.nombre.value.trim(),
            numero_empleado:
              form.numero_empleado.value.trim()
          })
        }
      );

      const data =
        await response
          .json()
          .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.mensaje ||
          "No fue posible ingresar."
        );
      }

      showParticipant(
        data.participante
      );
    } catch (error) {
      message.textContent =
        error.message;
    } finally {
      button.disabled = false;
      button.textContent =
        "Ingresar";
    }
  }
);

document.querySelector(
  "#logoutButton"
).addEventListener(
  "click",
  async () => {
    await fetch(
      `${API}/api/portal/logout`,
      {
        method: "POST",
        credentials: "include"
      }
    ).catch(() => {});

    location.reload();
  }
);

session().catch(() => {});
