const API_URL = "https://capacitacion-production-3120.up.railway.app";
const MODALIDAD = "E-LEARNING";
const tokenParams = new URLSearchParams(location.hash.slice(1));
const accessToken = String(tokenParams.get("token") || "").trim();
if (accessToken) {
  history.replaceState(null, "", location.pathname + "#portada");
}
let participant = null;
let savingResult = false;

const ATTEMPT_ID_KEY = "walmart_la_naranja_envio_id";
const ATTEMPT_ANSWERS_KEY = "walmart_la_naranja_respuestas";

function uuidV4() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, char => {
    const random = Math.floor(Math.random() * 16);
    const value = char === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

function getAttemptId(answers) {
  const serialized = JSON.stringify(answers);
  const savedAnswers = sessionStorage.getItem(ATTEMPT_ANSWERS_KEY);
  let id = sessionStorage.getItem(ATTEMPT_ID_KEY);

  if (!id || savedAnswers !== serialized) {
    id = uuidV4();
    sessionStorage.setItem(ATTEMPT_ID_KEY, id);
    sessionStorage.setItem(ATTEMPT_ANSWERS_KEY, serialized);
  }

  return id;
}

function clearAttemptId() {
  sessionStorage.removeItem(ATTEMPT_ID_KEY);
  sessionStorage.removeItem(ATTEMPT_ANSWERS_KEY);
}

function normalizeService(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .toUpperCase();
}

function allowedService(value) {
  return [
    "WALMART LA NARANJA",
    "LA NARANJA",
    "WALMART NARANJA"
  ].includes(normalizeService(value));
}

async function getParticipant() {
  if (participant) return participant;

  const response = await fetch(API_URL + "/api/portal/session", {
    credentials: "include",
    cache: "no-store",
    headers: accessToken
      ? { Authorization: "Bearer " + accessToken }
      : {}
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.autenticado || !data.participante) {
    throw new Error("Tu acceso no está activo. Vuelve al portal e ingresa nuevamente.");
  }

  if (!allowedService(data.participante.servicio)) {
    throw new Error("Este curso está disponible únicamente para Walmart La Naranja.");
  }

  participant = data.participante;
  return participant;
}

async function saveResult(answers) {
  if (savingResult) return null;
  savingResult = true;

  try {
    const currentParticipant = await getParticipant();
    const response = await fetch(API_URL + "/api/portal/la-naranja/resultados", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: "Bearer " + accessToken } : {})
      },
      body: JSON.stringify({
        envio_id: getAttemptId(answers),
        respuestas: answers,
        modalidad: MODALIDAD,
        numero_empleado_sesion: currentParticipant.numero_empleado
      })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(
        response.status === 401
          ? "Tu acceso venció. Vuelve al portal e ingresa otra vez."
          : data.mensaje || "No fue posible guardar la calificación."
      );
    }
    clearAttemptId();
    return data;
  } finally {
    savingResult = false;
  }
}

const slides = [
  {
    type:"hero",
    title:"Consignas Específicas",
    subtitle:"Walmart La Naranja",
    body:"Septiembre 2026"
  },
  {
    title:"Contenido",
    html:`
      <div class="grid">
        <div class="panel blue">
          <ul>
            <li>Responsabilidades del Guardia</li>
            <li>Horarios y Alarmado de Unidad</li>
            <li>Activación y Manejo de Alarmas</li>
            <li>Plano Táctico y Distribución</li>
            <li>Gama 1: Control de Accesos</li>
            <li>Gafetes y Control de Identidad</li>
          </ul>
        </div>
        <div class="panel accent">
          <ul>
            <li>Gama 2: Control Vehicular</li>
            <li>Gama 3: Salidas de Mercancía</li>
            <li>Gama 4: Monitoreo y Sistemas</li>
            <li>Gama 5: Rondines y Protocolo X1</li>
            <li>Consignas y Contactos Clave</li>
            <li>Evaluación</li>
          </ul>
        </div>
      </div>`
  },
  {
    title:"Responsabilidades del Guardia",
    html:`
      <div class="grid">
        <div class="panel blue">
          <h3>Disciplina y Relevo</h3>
          <p><strong>Presentación:</strong> 10 minutos antes con uniforme completo, limpio y firma de bitácora.</p>
          <p><strong>Recepción y Entrega:</strong> Chequeo minucioso de novedades, bitácoras y equipo para deslinde legal.</p>
          <p><strong>Revisión Corporal:</strong> Realizar cacheo y revisión de pertenencias al saliente frente a cámara de CCTV.</p>
          <p><strong>Lockers y Puesto:</strong> Áreas de trabajo y casilleros asignados deben permanecer impecables y ordenados.</p>
        </div>
        <div class="panel accent">
          <h3>Conducta y Código de Ética</h3>
          <p><strong>Trato y Servicio:</strong> Siempre cortés, respetuoso y amable; evitar fricciones o confrontaciones innecesarias.</p>
          <p><strong>Prohibición Estricta:</strong> Cero tolerancia al tabaco y bebidas alcohólicas dentro o fuera de las instalaciones.</p>
          <p><strong>Confidencialidad Total:</strong> Salvaguardar la privacidad de asociados, proveedores y secretos de montaje.</p>
          <p><strong>Reporte Inmediato:</strong> Informar toda anomalía al titular de Seguridad Corporativa.</p>
        </div>
      </div>`
  },
  {
    title:"Horarios y Alarmado de Unidad",
    html:`
      <div class="table-wrap">
        <table>
          <thead><tr><th>Día</th><th>Desalarmado</th><th>Alarmado</th><th>Notificación</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>Lunes a Viernes</td><td>06:00 hrs</td><td>19:30 hrs</td><td>CAE & Zona Cero (Monitoreo NET)</td><td>Operación normal</td></tr>
            <tr><td>Sábado</td><td>06:30 hrs</td><td>19:30 hrs</td><td>CAE & Zona Cero (aviso previo)</td><td>Cita previa</td></tr>
            <tr><td>Domingo</td><td>07:30 hrs</td><td>19:30 hrs</td><td>CAE & Zona Cero (aviso previo)</td><td>Inhábil / Correo LOR</td></tr>
            <tr><td>Días inhábiles</td><td>Según autorización LOR</td><td>19:30 hrs</td><td>Confirmación Seguridad Corporativa</td><td>Acceso restringido</td></tr>
          </tbody>
        </table>
      </div>
      <div class="callout"><strong>Nota crítica:</strong> Si CAE o Zona Cero no responden en 10 minutos al desalarmar o alarmar, debe asentarse obligatoriamente en el libro de novedades.</div>`
  },
  {
    title:"Activación y Manejo de Alarmas",
    html:`
      <div class="grid">
        <div class="panel blue">
          <h3>Panel Bosch — Intrusión</h3>
          <p><strong>Identificación:</strong> Ubicar el número de dispositivo o zona activada.</p>
          <p><strong>Desalarmar:</strong> Ingresar la clave autorizada para silenciar.</p>
          <p><strong>Inspección física:</strong> Recorrer y verificar el área involucrada.</p>
          <p><strong>Re-alarmado:</strong> Volver a armar el sistema y reportar a CAE y Zona Cero.</p>
        </div>
        <div class="panel accent">
          <h3>Panel Notifier — Incendio</h3>
          <p><strong>Silenciado:</strong> Oprimir de inmediato la tecla “Silence”.</p>
          <p><strong>Verificación:</strong> Confirmar si existe conato, detector sucio o falsa alarma.</p>
          <p><strong>Evidencia:</strong> Tomar fotografía con Timestamp Camera Free.</p>
          <p><strong>Reporte:</strong> Notificar al grupo “La Naranja LOR” y asentar en el parte.</p>
        </div>
      </div>`
  },
  {
    title:"Plano Táctico y Distribución",
    html:`
      <div class="panel blue">
        <h3>Puestos y Gamas Operativas</h3>
        <ul>
          <li><strong>Gama 1 (Recepción):</strong> Filtro peatonal, citas, EPP y entrega de gafetes.</li>
          <li><strong>Gama 2 (Vehicular):</strong> Portones exteriores y acceso de vehículos de asociados.</li>
          <li><strong>Gama 3 (Recibo LOR):</strong> Control de mercancía, folios y revisión corporal/cacheo.</li>
          <li><strong>Gama 4 (Paneles):</strong> Monitoreo de paneles de alarma, sismo y apoyo en andenes.</li>
          <li><strong>Gama 5 (Piso / Montajes):</strong> Rondines constantes, supervisión de proveedores y cero fotos.</li>
        </ul>
      </div>`
  },
  {
    title:"Gama 1: Control de Accesos",
    html:`
      <div class="grid">
        <div class="panel blue">
          <h3>Validación y Citas</h3>
          <p>Horario de 07:00 a 17:00 hrs. Verificar por videoportero que el visitante figure en la lista compartida por Mesa de Control. Sin cita no se autoriza el ingreso.</p>
        </div>
        <div class="panel blue">
          <h3>Validación de EPP</h3>
          <p>Para montaje: calzado con casquillo, faja lumbar y chaleco reflejante. Prohibido acceso con gorras o lentes oscuros.</p>
        </div>
        <div class="panel accent">
          <h3>Trabajos de Alto Riesgo</h3>
          <p>Alturas, soldadura o confinados requieren permiso, supervisión de mantenimiento, DC3 vigente, IMSS/SUA y alta médica.</p>
        </div>
        <div class="panel accent">
          <h3>Custodia de Documentos</h3>
          <p>Retener únicamente INE o licencia vigente. No pasaportes ni formas migratorias. Mochilas en lockers con ficha numérica.</p>
        </div>
      </div>`
  },
  {
    title:"Gafetes y Control de Identidad",
    html:`
      <div class="panel blue">
        <h3>Protocolo de Portación</h3>
        <p><strong>Portación obligatoria:</strong> Visible en todo momento para asociados, proveedores y visitas.</p>
        <p><strong>Gafete verde:</strong> Proveedor, previa entrega de identificación oficial y cumplimiento de EPP.</p>
        <p><strong>Gafete azul:</strong> Personal directo de Walmart México y Centroamérica.</p>
        <p><strong>Asociados sin gafete:</strong> Préstamo de gafete con chip reteniendo INE/licencia en libreta de control. Si no cuenta con INE, se entrega sin chip.</p>
      </div>`
  },
  {
    title:"Gama 2: Control Vehicular",
    html:`
      <div class="grid">
        <div class="panel blue">
          <h3>Seguridad de Portones</h3>
          <p>Portones 3, 4 y 6 con candado cerrado. Portones 1, 2 y 5 con pasador. Administrar llaves y candados durante el turno.</p>
        </div>
        <div class="panel blue">
          <h3>Estacionamiento</h3>
          <p>Uso exclusivo para asociados acreditados con gafete visible. Si viaja un proveedor, debe descender y registrarse a pie por Gama 1.</p>
        </div>
        <div class="panel accent">
          <h3>Carga y Descarga</h3>
          <p>Registrar unidad, placas y chofer. Al concluir maniobras, el vehículo debe retirarse. El guardia no controla mercancía de montaje.</p>
        </div>
        <div class="panel accent">
          <h3>Comunicación Operativa</h3>
          <p>Notificar vía radio a Gama 1 con copia a Gerencia LOR / Mesa de Control el ingreso vehicular y número de tripulantes.</p>
        </div>
      </div>`
  },
  {
    title:"Gama 3: Salidas de Mercancía",
    html:`
      <div class="table-wrap">
        <table>
          <thead><tr><th>Movimiento</th><th>Documentación</th><th>Autorizaciones</th><th>Acción</th></tr></thead>
          <tbody>
            <tr><td>Rechazo</td><td>Formato de Rechazo fechado</td><td>Personas involucradas de LOR</td><td>Validar folio físico contra producto</td></tr>
            <tr><td>Devolución</td><td>Formato Devolución + Carta recolección</td><td>Copia INE persona autorizada</td><td>Cotejar identidad del recolector</td></tr>
            <tr><td>Donación</td><td>Formato Donación + Correo Category</td><td>Gerencia LOR / Proveedor comprador</td><td>Fotos antes, durante y después</td></tr>
            <tr><td>Destrucción a CMA</td><td>Orden de salida + Copia gafete asociado</td><td>Firmas autorizadas</td><td>Contar tarimas y subir evidencia a chat</td></tr>
          </tbody>
        </table>
      </div>
      <div class="callout"><strong>Revisión corporal:</strong> Realizar revisión minuciosa a proveedores/promotores a la salida. Personal femenino debe realizarla obligatoriamente a las damas.</div>`
  },
  {
    title:"Gama 4: Monitoreo y Sistemas",
    html:`
      <div class="grid">
        <div class="panel blue">
          <h3>Sistemas de Alertamiento</h3>
          <p><strong>Alerta Sísmica:</strong> Monitoreo activo y verificación permanente.</p>
          <p><strong>Notifier:</strong> Atención de señales sonoras o fallas.</p>
          <p><strong>Bosch:</strong> Supervisión de contactos perimetrales y volumétricos.</p>
          <p><strong>Megáfono:</strong> Liderar desalojo ordenado si se confirma contingencia.</p>
        </div>
        <div class="panel accent">
          <h3>Soporte a Recibo y Andén</h3>
          <p><strong>Control de andén:</strong> Cerrar portón ante apertura de portones exteriores.</p>
          <p><strong>Basura:</strong> Revisar bolsas y contenedores de cartón compactado.</p>
          <p><strong>Salidas parciales:</strong> Requieren autorización previa de subgerencia LOR.</p>
          <p><strong>Difusión:</strong> Salidas parciales, donaciones y destrucción deben subirse al grupo de WhatsApp.</p>
        </div>
      </div>`
  },
  {
    title:"Gama 5: Rondines y Protocolo X1",
    html:`
      <div class="grid">
        <div class="panel blue">
          <h3>Detección de Fotografías (X1)</h3>
          <p><strong>Evidencia:</strong> Tomar evidencia fotográfica del infractor o de las tomas en su dispositivo.</p>
          <p><strong>Borrado:</strong> Solicitar con firmeza y respeto que elimine las imágenes del montaje.</p>
          <p><strong>Acompañamiento:</strong> Trasladar al infractor al área de espera de proveedores.</p>
          <p><strong>Escalamiento:</strong> Notificar al Jefe de Servicio y Seguridad Corporativa; acatar resolución LOR.</p>
        </div>
        <div class="panel accent">
          <h3>Rondines y Seguridad Física</h3>
          <p><strong>Primer recorrido:</strong> 07:00 a 07:20 hrs. Último recorrido general: 18:00 hrs.</p>
          <p><strong>Cuarto de Site:</strong> Mantener temperatura estable a 22 °C.</p>
          <p><strong>Cuarto de Bombas:</strong> Bombas eléctrica, diésel y cárcamo en modo Automático.</p>
          <p><strong>Rutas de emergencia:</strong> Extintores, hidrantes y salidas libres de obstáculos.</p>
        </div>
      </div>`
  },
  {
    title:"Consignas y Contactos Clave",
    html:`
      <div class="contact-grid">
        <div class="contact"><strong>CAE (Centro de Atención)</strong><span>5134 0055</span></div>
        <div class="contact"><strong>Monitoreo NET (Zona Cero)</strong><span>56 2349 5643</span></div>
      </div>
      <div class="callout">Toda evidencia fotográfica de incidencias, paneles y recorridos debe realizarse obligatoriamente con <strong>Timestamp Camera Free</strong>.</div>`
  },
  { type:"quiz" }
];

const quiz = [
  {q:"¿Con cuánto tiempo de anticipación debe presentarse el guardia antes de iniciar su turno?", opts:["5 minutos","10 minutos","15 minutos","20 minutos"], a:1},
  {q:"¿Qué debe realizarse durante la recepción y entrega del servicio?", opts:["Únicamente revisar el uniforme","Chequear novedades, bitácoras y equipo","Revisar solamente las llaves","Esperar instrucciones del siguiente turno"], a:1},
  {q:"De lunes a viernes, ¿a qué hora se debe desalarmar la unidad?", opts:["05:30 hrs.","06:00 hrs.","06:30 hrs.","07:00 hrs."], a:1},
  {q:"¿Qué se debe hacer si CAE o Zona Cero no responden en un lapso de 10 minutos al alarmar o desalarmar?", opts:["Retirarse del puesto","Reiniciar el panel","Asentar la incidencia en el libro de novedades","Esperar hasta el siguiente turno"], a:2},
  {q:"En caso de activación de una alarma de intrusión en el panel Bosch, ¿cuál es una de las primeras acciones?", opts:["Desconectar el panel","Ubicar el número de dispositivo o zona activada","Abandonar inmediatamente la unidad","Apagar todas las cámaras"], a:1},
  {q:"¿Qué aplicación debe utilizarse para tomar evidencia fotográfica de incidencias, paneles y recorridos?", opts:["WhatsApp","Google Fotos","Timestamp Camera Free","Cámara del celular sin aplicación"], a:2},
  {q:"¿Qué gafete corresponde a un proveedor?", opts:["Gafete rojo","Gafete azul","Gafete verde","Gafete amarillo"], a:2},
  {q:"¿Qué debe hacer el guardia al registrar una unidad de carga o descarga?", opts:["Registrar únicamente el nombre del proveedor","Registrar unidad, placas y chofer","Retener las llaves del vehículo","Revisar la mercancía de montaje"], a:1},
  {q:"¿Qué debe hacer el guardia ante la detección de una persona tomando fotografías del montaje (Protocolo X1)?", opts:["Ignorar la situación","Tomar evidencia, solicitar el borrado de imágenes y trasladar al infractor al área de espera","Permitir las fotografías si son pocas","Retirar personalmente el teléfono del infractor"], a:1},
  {q:"¿Qué debe verificarse durante los rondines en las rutas de emergencia?", opts:["Que los extintores, hidrantes y salidas estén libres de obstáculos","Que todas las puertas permanezcan abiertas","Que los proveedores estén fuera de la unidad","Que las cámaras estén apagadas"], a:0}
];

let current = 0;
const card = document.querySelector("#courseCard");
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");
const progressText = document.querySelector("#progressText");
const progressBar = document.querySelector("#progressBar");

function render(){
  const s = slides[current];
  progressText.textContent = `${current+1} / ${slides.length}`;
  progressBar.style.width = `${((current+1)/slides.length)*100}%`;
  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === slides.length-1;
  nextBtn.textContent = current === slides.length-2 ? "Ir a evaluación →" : "Siguiente →";

  if(s.type === "hero"){
    card.innerHTML = `
      <div class="hero">
        <div class="hero-badge">🛡️</div>
        <p class="eyebrow">HOPLON CAPACITACIÓN</p>
        <h2>${s.title}<br>${s.subtitle}</h2>
        <p class="date">${s.body}</p>
      </div>`;
    return;
  }

  if(s.type === "quiz"){
    renderQuiz();
    return;
  }

  card.innerHTML = `<p class="eyebrow">WALMART LA NARANJA</p><h2>${s.title}</h2>${s.html}`;
}

function renderQuiz(){
  const tpl = document.querySelector("#quizTemplate");
  card.innerHTML = "";
  card.appendChild(tpl.content.cloneNode(true));
  const form = card.querySelector("#quizForm");

  quiz.forEach((item, i) => {
    const wrap = document.createElement("section");
    wrap.className = "quiz-question";
    wrap.innerHTML = `<p>${i+1}. ${item.q}</p>` + item.opts.map((opt,j)=>`
      <label class="option">
        <input type="radio" name="q${i}" value="${j}"> ${String.fromCharCode(65+j)}) ${opt}
      </label>`).join("");
    form.appendChild(wrap);
  });

  card.querySelector("#gradeBtn").addEventListener("click", gradeQuiz);
}

async function gradeQuiz(){
  const answers = [];
  let correct = 0;

  quiz.forEach((item,i)=>{
    const selected = card.querySelector(`input[name="q${i}"]:checked`);
    const answer = selected ? Number(selected.value) : null;
    answers.push(answer);
    if(answer === item.a) correct++;
  });

  const result = card.querySelector("#quizResult");
  const gradeButton = card.querySelector("#gradeBtn");

  if (answers.includes(null)) {
    result.className = "result bad";
    result.textContent = "Responde las 10 preguntas antes de finalizar la evaluación.";
    return;
  }

  const localScore = correct * 10;
  const localPassed = localScore >= 80;
  result.className = `result ${localPassed ? "ok" : "bad"}`;
  result.innerHTML = localPassed
    ? `✅ APROBADO — ${localScore}/100 (${correct} de 10 correctas)<br><span class="small">Guardando calificación…</span>`
    : `❌ NO APROBADO — ${localScore}/100 (${correct} de 10 correctas).<br><span class="small">Guardando calificación…</span>`;

  gradeButton.disabled = true;

  try {
    const saved = await saveResult(answers);
    if (!saved) return;

    const serverScore = Number(saved.calificacion ?? localScore);
    const serverPassed = Boolean(saved.aprobado);
    const serverCorrect = Math.round(serverScore / 10);

    result.className = `result ${serverPassed ? "ok" : "bad"}`;
    result.innerHTML = serverPassed
      ? `✅ APROBADO — ${serverScore}/100 (${serverCorrect} de 10 correctas)<br><span class="small">Calificación guardada correctamente. Intento: ${saved.intento || "registrado"}.</span>`
      : `❌ NO APROBADO — ${serverScore}/100 (${serverCorrect} de 10 correctas).<br><span class="small">Calificación guardada correctamente. Intento: ${saved.intento || "registrado"}.</span>`;

    window.dispatchEvent(new CustomEvent("cursoFinalizado", {
      detail: {
        curso: "Consignas específicas — Walmart La Naranja",
        servicio: participant?.servicio || "WALMART LA NARANJA",
        calificacion: serverScore,
        aprobado: serverPassed,
        correctas: serverCorrect,
        total: 10
      }
    }));
  } catch (error) {
    result.innerHTML += `<br><span class="small">Guardado sin confirmar: ${error.message} Puedes volver a pulsar “Calificar evaluación” para reintentar.</span>`;
    gradeButton.disabled = false;
  }
}

prevBtn.addEventListener("click",()=>{
  if(current>0){ current--; render(); window.scrollTo({top:0,behavior:"smooth"}); }
});
nextBtn.addEventListener("click",()=>{
  if(current<slides.length-1){ current++; render(); window.scrollTo({top:0,behavior:"smooth"}); }
});

render();
