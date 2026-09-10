const A='assets/';
const nav=(n,prev,next)=>`<nav class="page-nav" aria-label="Navegación del curso"><a href="#${prev}">← Anterior</a><span class="page-number">${String(n).padStart(2,'0')} / 19</span>${next?`<a href="#${next}">Siguiente →</a>`:'<a href="#portada">Inicio ↑</a>'}</nav>`;
const diamond=(src,alt)=>`<div class="visual-stack"><div class="rhombus"><img src="${A+src}" alt="${alt}"></div></div>`;
const page=(n,title,content,visual,extra='')=>`<section class="lesson-page ${extra}" id="cuartilla-${n}" aria-labelledby="titulo-${n}"><header class="lesson-head"><h2 id="titulo-${n}">${title}</h2></header><div class="lesson-grid"><div class="lesson-content">${content}</div>${visual}</div>${nav(n,n===3?'contenido':`cuartilla-${n-1}`,n===19?'':`cuartilla-${n+1}`)}</section>`;

const pages=[];
pages.push(page(3,'Responsabilidades del Guardia',`
  <div class="cards three">
    <article class="card"><h3>Puntualidad y equipo</h3><p>Presentarse <strong>10 minutos antes</strong> con uniforme limpio y completo. Recibir las novedades del turno saliente, verificar los radios y resguardar los gafetes con chip para el piso 12.</p></article>
    <article class="card"><h3>Vigilancia continua</h3><p>Permanecer alerta en el puesto sin abandonarlo sin relevo previo. Reportar inmediatamente cualquier anomalía o conducta irregular a Seguridad Corporativa.</p></article>
    <article class="card"><h3>Ética y discreción</h3><p>Mantener un trato cordial y profesional con asociados y proveedores. Cumplir el Código de Ética y guardar absoluta confidencialidad sobre la información de la empresa.</p></article>
  </div>`,diamond('responsabilidades.png','Personal de seguridad y equipo de trabajo')));

pages.push(page(4,'Normas de Conducta y Control',`
  <div class="cards">
    <article class="card"><h3>Acceso restringido</h3><p>Queda estrictamente prohibido el acceso a vendedores ambulantes, promotores y personas ajenas a la compañía.</p></article>
    <article class="card"><h3>Cero armas y sustancias</h3><p>Impedir el ingreso de armas de fuego, objetos punzocortantes o personas en estado inconveniente o bajo el influjo de sustancias.</p></article>
    <article class="card"><h3>Uso responsable de medios</h3><p>Prohibido fumar, escuchar música o distraerse con el celular. Las llamadas personales deberán ser breves y sin altavoz.</p></article>
    <article class="card"><h3>Revisión corporal frente a CCTV</h3><p>El guardia entrante realizará la revisión corporal y de pertenencias del personal saliente frente a la cámara de CCTV.</p></article>
    <article class="card"><h3>Artículos olvidados</h3><p>Revisar detalladamente mochilas o carteras olvidadas en los pisos 11 y 12 frente a quien las entrega y registrar formalmente la entrega.</p></article>
  </div>`,diamond('conducta-control.png','Tecnología de seguridad y control')));

pages.push(page(5,'Identificación de Personal',`
  <ul class="clean-list">
    <li><strong>Portación obligatoria:</strong> Todo asociado deberá portar el gafete visible a la altura del pecho para ingresar y transitar.</li>
    <li><strong>Sin gafete:</strong> Entregar un gafete provisional con chip contra una identificación oficial vigente: INE o licencia de conducir. <em>No se acepta pasaporte.</em></li>
    <li><strong>Sin identificación:</strong> Validar el número de asociado y la determinante con Credencialización, extensión <strong>11764</strong>, y entregar un gafete sin chip.</li>
    <li><strong>Falla en lectora:</strong> Verificar con Recepción y Credencialización si el gafete está desmagnetizado o desactivado.</li>
    <li><strong>Asociados foráneos:</strong> Registrar el ingreso en la carpeta “Asociados de Operadoras”.</li>
  </ul>`,diamond('identificacion-personal.png','Asociado con gafete visible')));

pages.push(page(6,'Control de Visitas y Proveedores',`
  <div class="cards">
    <article class="card"><h3>Visitantes — gafete naranja</h3><p><strong>Recepción y espera:</strong> anunciarse y esperar al asociado en la sala.</p><p><strong>Acompañamiento:</strong> el asociado debe recibirlo y acompañarlo hasta su salida.</p><p><strong>Intervención HOPLON:</strong> conducir inmediatamente a Recepción a cualquier visitante sin acompañante.</p></article>
    <article class="card"><h3>Proveedores y vendors — gafete verde</h3><p><strong>Registro:</strong> intercambiar el gafete por identificación oficial de la empresa representada.</p><p><strong>Vendors con correo:</strong> registrar inicio y término de jornada.</p><p><strong>Equipos:</strong> registrar herramientas y equipos de cómputo en el libro de proveedores.</p></article>
  </div>`,`<div class="double-visual"><div class="rhombus"><img src="${A}personal-hoplon.png" alt="Personal HOPLON"></div><div class="rhombus"><img src="${A}gafetes-visita.png" alt="Colores de gafetes para visitantes y proveedores"></div></div>`));

pages.push(page(7,'Verificación del Instituto Nacional de Migración',`
  <p>Las visitas del Instituto Nacional de Migración pueden realizarse sin previo aviso. Toda persona que reciba o tenga contacto con sus delegados deberá mostrar una <strong>excelente actitud de cooperación</strong> y brindar un trato de extrema cortesía.</p>
  <div class="directory">
    <article class="contact-block"><h3>Carlos Fonseca</h3><p>Global Mobility México</p><p><a href="tel:+525552830100">55 5283 0100</a>, ext. 11718<br><a href="tel:+525580221044">55 8022 1044</a><br><a href="mailto:Carlos.Fonseca@walmart.com">Carlos.Fonseca@walmart.com</a></p></article>
    <article class="contact-block"><h3>María Fernanda Garro</h3><p>Contacto alterno</p><p><a href="tel:+525552830100">55 5283 0100</a>, ext. 14920<br><a href="mailto:Maria.Garro@walmart.com">Maria.Garro@walmart.com</a></p></article>
  </div>`,`<div class="double-visual"><div class="rhombus"><img src="${A}uniformes-inm.png" alt="Uniformes de personal del INM"></div><div class="rhombus"><img src="${A}monitoreo.png" alt="Centro de monitoreo"></div></div>`));

pages.push(page(8,'Acceso de Menores al Edificio',`
  <h3 class="split-label">Procedimiento de ingreso</h3><ul class="clean-list">
    <li><strong>Autorización:</strong> El asociado debe solicitar aprobación a su director o subdirector y remitirla previamente a Seguridad Oficinas.</li>
    <li><strong>Supervisión continua:</strong> El asociado es responsable de la integridad del menor y no debe perderlo de vista.</li>
    <li><strong>Reglas de convivencia:</strong> Prohibido ingresar juguetes ruidosos —pelotas, patines o autos de control remoto— y correr en pasillos o comedor.</li>
    <li><strong>Emergencias:</strong> En una contingencia, el asociado seguirá las indicaciones del brigadista y se responsabilizará del menor.</li>
  </ul>`,diamond('menores.png','Menores dentro de un espacio de trabajo')));

pages.push(page(9,'Trabajos de Riesgo y Valores',`
  <div class="cards">
    <article class="card"><h3>Mantenimiento y contratistas</h3><p><strong>EPP completo:</strong> según la actividad.</p><p><strong>Seguridad social:</strong> copia vigente del AFIL-06 del IMSS.</p><p><strong>Permisos:</strong> para alturas, trabajos eléctricos, químicos o espacios confinados.</p><p><strong>Trabajos en caliente:</strong> casco rojo y extintor de CO₂ en el sitio.</p></article>
    <article class="card"><h3>Valores y cajeros — Cometra</h3><p><strong>Horario:</strong> lunes a viernes, 08:00–17:00. Prohibido en fines de semana e inhábiles.</p><p><strong>Cotejo:</strong> identificación contra catálogo vigente de firmas.</p><p><strong>Registro:</strong> nombre, firma, número económico, placas y horario.</p><p><strong>Unidades oficiales:</strong> no autorizar acceso sin validación.</p></article>
  </div>`,`<div class="double-visual"><div class="rhombus"><img src="${A}mantenimiento.png" alt="Personal de mantenimiento con equipo de protección"></div><div class="rhombus"><img src="${A}cajero.png" alt="Operación en cajero automático"></div></div>`));

pages.push(page(10,'Rondines y Ciclo de Alarmado',`
  <div class="timeline">
    <article class="event"><h3>21:00–05:45</h3><p>Rondines nocturnos continuos. Reporte cada dos horas a Toreo NET.</p></article>
    <article class="event"><h3>23:00</h3><p>Alarmar la oficina tras el relevo de Compras Monitoreo. Comprobar cero zonas en bypass.</p></article>
    <article class="event"><h3>Cierre perimetral</h3><p>Asegurar salidas de emergencia, terraza y candados de seguridad en laptops.</p></article>
    <article class="event"><h3>05:00</h3><p>Desalarmado general L–V; 07:00 en fines de semana. Reportar apertura a CMNET y CAE.</p></article>
  </div>`,`<div></div>`));

pages.push(page(11,'Directorio Rápido y Emergencias',`
  <div class="directory">
    <article class="contact-block"><h3>Centro de Atención de Emergencias</h3><p><strong>Línea gratuita:</strong> <a href="tel:8006277375">800 627 7375</a><br><strong>Teléfono:</strong> <a href="tel:+525551340055">55 5134 0055</a><br><strong>WhatsApp:</strong> <a href="https://wa.me/525543502291">55 4350 2291</a><br><strong>Marcación rápida:</strong> #604<br><strong>Conmutador Toreo:</strong> ext. 66055<br><strong>Correo:</strong> <a href="mailto:caeemergencias@email.wal-mart.com">caeemergencias@email.wal-mart.com</a></p></article>
    <article class="contact-block"><h3>Centro de Contacto Legal</h3><p>Visitas de autoridades y requerimientos legales:</p><p><a href="tel:+525551340062">55 5134 0062</a><br><strong>Opción 5</strong></p></article>
  </div>`,`<div class="double-visual"><div class="rhombus"><img src="${A}directorio-reportes.png" alt="Reportes y directorio"></div><div class="rhombus"><img src="${A}contacto-legal.png" alt="Equipo revisando información"></div></div>`));

pages.push(page(12,'Visita de Autoridades',`
  <p class="alert-note">Ante la visita de una autoridad fiscal u oficial, el elemento deberá mantener un trato amable e informar inmediatamente al líder de Seguridad Corporativa. Si ya no se encuentra personal disponible, deberá comunicarse con el <strong>CAE Legal</strong> para recibir indicaciones sobre cómo proceder.</p>
  <ol class="steps"><li>Recibir a la autoridad con amabilidad.</li><li>Informar al líder de Seguridad Corporativa.</li><li>Si no hay personal disponible, llamar al CAE Legal.</li><li>Esperar indicaciones antes de proceder.</li></ol>`,diamond('autoridad.png','Atención a una visita de autoridad')));

pages.push(page(13,'Escalamiento e Infraestructura',`
  <ul class="clean-list">
    <li><strong>Soporte crítico 24/7/365:</strong> Centro de Cómputo Operaciones (CCO) y Guardia Data Center Toreo NET.</li>
    <li><strong>Sistemas cubiertos:</strong> aire de precisión, CCTV, control de accesos y sistema contra incendios.</li>
    <li><strong>Planta de emergencia:</strong> ante un corte deberá encender en menos de 30 segundos. Si falla, reportar inmediatamente y no manipular el equipo.</li>
    <li><strong>Monitoreo Toreo NET:</strong> <a href="tel:+525553877961">55 5387 7961</a> / <a href="tel:+525526296000">55 2629 6000</a>, ext. 11061 / <a href="tel:+525543774656">55 4377 4656</a>.</li>
  </ul>`,`<div class="double-visual"><div class="rhombus"><img src="${A}infraestructura-equipo.png" alt="Equipo de soporte"></div><div class="rhombus"><img src="${A}infraestructura-reportes.png" alt="Monitoreo y reportes"></div></div>`));

pages.push(page(14,'Emergencias',`
  <p>Una vez detectada una emergencia, informar inmediatamente al Centro de Monitoreo Toreo NET (CMNET) y al Centro de Atención de Emergencias (CAE). Se considera emergencia cualquier condición anormal que ponga en riesgo a las personas o instalaciones.</p>
  <ul class="clean-list emergency-list"><li>Fuego o conato de incendio.</li><li>Amenaza telefónica.</li><li>Amenaza de bomba.</li><li>Sustracción de propiedad sin autorización.</li><li>Explosión.</li><li>Sabotaje.</li><li>Presencia de personas extrañas.</li><li>Robo.</li><li>Disturbios públicos.</li><li>Desastres naturales, como sismos.</li><li>Accidentes laborales.</li></ul>`,`<div class="double-visual"><div class="rhombus"><img src="${A}emergencias-equipo.png" alt="Equipo atendiendo una emergencia"></div><div class="rhombus"><img src="${A}emergencias-reporte.png" alt="Información para emergencias"></div></div>`));

pages.push(`<section class="lesson-page" id="cuartilla-15" aria-labelledby="titulo-15"><div class="poster-layout"><h2 class="poster-title" id="titulo-15">Códigos de emergencia</h2><button class="poster-button" data-full="${A}codigos-1.png" aria-label="Ampliar primera infografía de códigos de emergencia"><img src="${A}codigos-1.png" alt="Códigos rojo, naranja, blanco y negro"></button></div>${nav(15,'cuartilla-14','cuartilla-16')}</section>`);
pages.push(`<section class="lesson-page" id="cuartilla-16" aria-labelledby="titulo-16"><div class="poster-layout"><button class="poster-button" data-full="${A}codigos-2.png" aria-label="Ampliar segunda infografía de códigos de emergencia"><img src="${A}codigos-2.png" alt="Códigos gris, ámbar, café, azul, verde, violeta, oro y Adam"></button>${diamond('elemento-seguridad.png','Elemento de seguridad')}</div>${nav(16,'cuartilla-15','cuartilla-17')}</section>`);
pages.push(`<section class="lesson-page transition" id="cuartilla-17" aria-labelledby="titulo-17"><h2 id="titulo-17">Actividad<br>práctica</h2>${nav(17,'cuartilla-16','cuartilla-18')}</section>`);

const questions=[
  ['¿En qué consiste un código blanco?',['Indica un asalto','Indica que hay un asociado o cliente lesionado o existe una emergencia médica.','Indica que hay una emergencia por incendio en la unidad','Indica que un niño está perdido.'],1],
  ['¿Qué debe hacer el guardia si detecta una anomalía o conducta irregular?',['Esperar a que termine el turno','Ignorarla si no representa un riesgo inmediato','Reportarla de inmediato a Seguridad Corporativa','Informarla únicamente a sus compañeros'],2],
  ['¿Qué personas tienen prohibido el acceso al corporativo?',['Asociados con gafete','Proveedores registrados','Vendedores ambulantes, promotores y personas ajenas a la compañía','Visitantes previamente anunciados'],2],
  ['¿Qué debe hacer un asociado que no cuenta con gafete?',['Ingresar sin identificación','Solicitar un gafete provisional con chip contra identificación oficial vigente','Utilizar el gafete de otro asociado','Esperar hasta el siguiente turno'],1],
  ['¿Qué identificación NO es aceptada para proporcionar un gafete provisional?',['INE','Licencia de conducir','Pasaporte','Identificación oficial vigente'],2],
  ['Cuando un visitante ingresa al edificio, ¿quién es responsable de acompañarlo durante toda su estancia?',['El guardia','Recepción','El asociado que recibe al visitante','El proveedor'],2],
  ['¿Qué debe hacer el guardia si encuentra a un visitante sin acompañante?',['Permitirle continuar','Abordarlo y conducirlo de inmediato a recepción','Solicitarle que abandone el edificio','Esperar a que aparezca el asociado'],1],
  ['¿Qué requisito se establece para realizar trabajos de riesgo?',['Únicamente presentar una identificación','Contar con EPP y los permisos especiales correspondientes','Realizarlos solamente después de las 18:00 hrs.','No requieren autorización si son trabajos menores'],1],
  ['¿Qué debe hacer el guardia ante una emergencia detectada en el edificio?',['Resolverla por cuenta propia','Informar inmediatamente al CMNET y al CAE','Esperar instrucciones del siguiente turno','Únicamente llamar a un compañero'],1],
  ['Durante una visita de una autoridad, ¿cuál es la conducta correcta del elemento de seguridad?',['Negarse a proporcionar cualquier información','Impedir el acceso hasta que termine la visita','Mantener una actitud amable e informar inmediatamente al líder de Seguridad Corporativa','Permitir el acceso sin informar a nadie'],2]
];
const letters=['A','B','C','D'];
const quiz=questions.map((question,index)=>`<fieldset class="question"><legend>${index+1}. ${question[0]}</legend><div class="options">${question[1].map((option,optionIndex)=>`<label><input type="radio" name="q${index}" value="${optionIndex}" required><span><strong>${letters[optionIndex]})</strong> ${option}</span></label>`).join('')}</div></fieldset>`).join('');
pages.push(`<section class="lesson-page quiz-page" id="cuartilla-18" aria-labelledby="titulo-18"><header class="lesson-head"><h2 id="titulo-18">Evaluación</h2></header><div class="quiz-intro"><p>Contesta las 10 preguntas. Dispones de 15 minutos.</p><div class="timer" id="timer" aria-live="polite">15:00</div></div><form id="quiz-form">${quiz}<button class="submit-quiz" type="submit">Finalizar evaluación</button><p class="quiz-result" id="quiz-result" aria-live="polite"></p></form>${nav(18,'cuartilla-17','cuartilla-19')}</section>`);
pages.push(`<section class="lesson-page thanks-page" id="cuartilla-19" aria-labelledby="titulo-19"><div class="thanks-copy"><h2 id="titulo-19">Gracias</h2><blockquote>“El éxito es la suma de pequeños esfuerzos, repetidos día tras día.”</blockquote><cite>Robert Collier</cite></div>${diamond('cierre.png','Elemento de seguridad')}${nav(19,'cuartilla-18','')}</section>`);

document.querySelector('#course-pages').innerHTML=pages.join('');

const viewer=document.querySelector('#image-viewer');
document.addEventListener('click',e=>{const button=e.target.closest('.poster-button');if(!button)return;viewer.querySelector('img').src=button.dataset.full;viewer.querySelector('img').alt=button.querySelector('img').alt;viewer.showModal();});
viewer.querySelector('button').addEventListener('click',()=>viewer.close());
viewer.addEventListener('click',e=>{if(e.target===viewer)viewer.close();});

let remaining=15*60;
let quizTimer=null;
const timer=document.querySelector('#timer');
const startQuizTimer=()=>{
  if(quizTimer||remaining<=0)return;
  quizTimer=setInterval(()=>{
    remaining=Math.max(0,remaining-1);
    timer.textContent=`${String(Math.floor(remaining/60)).padStart(2,'0')}:${String(remaining%60).padStart(2,'0')}`;
    if(!remaining){clearInterval(quizTimer);quizTimer=null;timer.textContent='Tiempo terminado';}
  },1000);
};
document.querySelector('#quiz-form').addEventListener('submit',event=>{
  event.preventDefault();
  let score=0;
  questions.forEach((question,index)=>{
    const selected=event.currentTarget.querySelector(`[name="q${index}"]:checked`);
    if(selected&&Number(selected.value)===question[2])score++;
  });
  if(quizTimer){clearInterval(quizTimer);quizTimer=null;}
  const quizPage=document.querySelector('#cuartilla-18');
  const result=document.querySelector('#quiz-result');
  quizPage.classList.add('quiz-complete');
  result.textContent=`Resultado: ${score} de 10 respuestas correctas (${score*10}/100).`;
  result.style.color=score>=8?'#176b42':'#a33131';
  result.scrollIntoView({behavior:'smooth',block:'center'});
});

// Una sola cuartilla visible. El desplazamiento sirve únicamente para leer
// contenido largo dentro de la cuartilla actual; el cambio de página se hace
// desde los botones Anterior/Siguiente o con el historial del navegador.
const courseSections=[...document.querySelectorAll('.cover,.contents-page,.lesson-page')];
const validSection=id=>courseSections.find(section=>section.id===id);
const showSection=()=>{
  const requested=decodeURIComponent(location.hash.slice(1));
  const active=validSection(requested)||document.querySelector('#portada');
  courseSections.forEach(section=>{section.hidden=section!==active;});
  document.body.classList.add('course-paged');
  document.title=`${active.querySelector('h1,h2')?.textContent.trim()||'Consignas específicas'} | Walmart Diamante`;
  if(active.id==='cuartilla-18')startQuizTimer();
  window.scrollTo({top:0,left:0,behavior:'auto'});
};
window.addEventListener('hashchange',showSection);
showSection();

// Navegación táctil en móvil: deslizar a la izquierda avanza y deslizar
// a la derecha regresa. Los movimientos verticales siguen desplazando el
// contenido de la cuartilla sin activar un cambio accidental.
let touchStartX=0;
let touchStartY=0;
let touchStartedOnControl=false;

document.addEventListener('touchstart',event=>{
  if(!matchMedia('(max-width: 760px)').matches||event.touches.length!==1)return;
  touchStartedOnControl=Boolean(event.target.closest('a,button,input,label,dialog'));
  touchStartX=event.touches[0].clientX;
  touchStartY=event.touches[0].clientY;
},{passive:true});

document.addEventListener('touchend',event=>{
  if(!matchMedia('(max-width: 760px)').matches||touchStartedOnControl||!event.changedTouches.length)return;
  const deltaX=event.changedTouches[0].clientX-touchStartX;
  const deltaY=event.changedTouches[0].clientY-touchStartY;
  if(Math.abs(deltaX)<60||Math.abs(deltaX)<=Math.abs(deltaY)*1.25)return;

  const activeIndex=courseSections.findIndex(section=>!section.hidden);
  const current=courseSections[activeIndex];
  if(deltaX<0&&current?.id==='cuartilla-18'&&!current.classList.contains('quiz-complete'))return;
  const destination=deltaX<0
    ? courseSections[activeIndex+1]
    : courseSections[activeIndex-1];
  if(destination)location.hash=destination.id;
},{passive:true});
