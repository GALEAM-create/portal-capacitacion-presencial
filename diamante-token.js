(function () {
  "use strict";

  const api = String(
    window.PORTAL_CONFIG?.apiBase || ""
  ).replace(/\/$/, "");
  const course = document.querySelector(
    "#diamanteCourse"
  );
  const link = document.querySelector(
    "#diamanteLink"
  );
  let preparing = false;
  let ready = false;

  if (!api || !course || !link) {
    return;
  }

  async function prepare() {
    if (
      preparing ||
      ready ||
      course.hidden
    ) {
      return;
    }

    preparing = true;
    link.setAttribute("aria-disabled", "true");
    link.textContent = "Preparando evaluación…";

    try {
      const response = await fetch(
        `${api}/api/portal/evaluacion-token`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            curso_slug:
              "consignas-walmart-diamante"
          })
        }
      );
      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok || !data.token) {
        throw new Error(
          data.mensaje ||
          "No fue posible preparar la evaluación."
        );
      }

      const url = new URL(
        "evaluaciones/walmart-diamante/",
        document.baseURI
      );
      url.hash =
        `token=${encodeURIComponent(data.token)}`;
      link.href = url.href;
      link.removeAttribute("aria-disabled");
      link.textContent = "Iniciar evaluación";
      ready = true;
    } catch (error) {
      link.textContent =
        "Vuelve a ingresar para continuar";
    } finally {
      preparing = false;
    }
  }

  const observer = new MutationObserver(prepare);
  observer.observe(course, {
    attributes: true,
    attributeFilter: ["hidden"]
  });
  prepare();
})();
