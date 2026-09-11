const NET_QUESTIONS=[{"q": "¿En qué consiste un código rojo?", "options": ["Indica un asalto", "Indica que hay una emergencia por incendio en la unidad", "Indica que hay un asociado o cliente lesionado o existe una emergencia médica.", "Indica que un niño está perdido."], "answer": 1}, {"q": "¿Qué debe hacer el guardia al recibir el turno?", "options": ["Retirarse inmediatamente de su puesto", "Recibir las novedades y el equipo del turno, sin abandonar el puesto sin relevo", "Revisar únicamente el uniforme", "Esperar a que el supervisor le indique qué hacer"], "answer": 1}, {"q": "¿Qué está prohibido hacer con la información y datos personales de la compañía?", "options": ["Protegerlos", "Reportarlos a Seguridad Corporativa", "Tomar fotografías, grabar o difundir contenido en redes sociales sin autorización", "Mantenerlos confidenciales"], "answer": 2}, {"q": "Un asociado se presenta sin gafete. ¿Cuál es el procedimiento correcto?", "options": ["Permitirle el acceso sin identificación", "Prestarle el gafete de otro asociado", "Entregar un gafete provisional con chip contra INE o licencia vigente", "Solicitar únicamente su nombre"], "answer": 2}, {"q": "¿Qué documento NO se acepta para entregar un gafete provisional con chip?", "options": ["INE", "Licencia de conducir vigente", "Pasaporte", "Ninguno de los anteriores"], "answer": 2}, {"q": "¿Qué debe hacer el guardia si encuentra a un visitante sin acompañamiento?", "options": ["Permitirle continuar su recorrido", "Escoltarlo a recepción y notificar al asociado responsable", "Retirarlo inmediatamente del edificio", "Ignorarlo mientras no cometa una falta"], "answer": 1}, {"q": "¿Qué requisito debe cumplirse para el ingreso o salida de equipo o muestras de proveedor?", "options": ["Únicamente presentar identificación", "Contar con correo de autorización formal y orden de salida requisitada", "Tener autorización verbal del proveedor", "Registrar solamente el nombre del guardia"], "answer": 1}, {"q": "¿Cada cuánto tiempo debe realizarse el rondín completo en el interior de las oficinas Toreo?", "options": ["Cada 30 minutos", "Cada 45 minutos", "Cada 60 minutos", "Cada 2 horas"], "answer": 2}, {"q": "En caso de realizar trabajos de soldadura, ¿qué elementos son obligatorios?", "options": ["Casco azul y extintor de polvo químico", "Extintor CO₂ y vigía con casco rojo", "Únicamente guantes de seguridad", "Casco blanco y extintor de agua"], "answer": 1}, {"q": "Ante un siniestro como fuego, amenaza, sismo o intrusión, ¿qué debe hacer el guardia?", "options": ["Esperar a que llegue el supervisor", "Resolver la situación por cuenta propia", "Reportar inmediatamente al Centro de Monitoreo (Zona Cero) y al CAE Emergencias", "Informar únicamente a recepción"], "answer": 2}];

window.netExamFinished=false;
let netExamGraded=false,netParticipant=null,netPayload=null,netSaving=false;
const NET_API="https://capacitacion-production-3120.up.railway.app";
const NET_MODALIDAD=document.body.classList.contains("exam-only")?"PRESENCIAL":"E-LEARNING";
const retrySave=document.createElement("button");retrySave.type="button";retrySave.textContent="Reintentar guardado";retrySave.hidden=true;
document.querySelector("#net-exam").append(retrySave);
retrySave.addEventListener("click",()=>saveNetResult());
async function saveNetResult(){
 if(netSaving||!netPayload||window.netExamFinished)return;
 netSaving=true;retrySave.hidden=true;examMessage.textContent="Guardando calificación…";
 try{
  const response=await fetch(NET_API+"/api/portal/net-vet/resultados",{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify(netPayload)});
  const data=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(response.status===401?"Tu sesión terminó. Ingresa de nuevo al portal en otra pestaña y reintenta aquí.":data.mensaje||"No fue posible guardar el resultado.");
  if(!data.id)throw new Error("El servidor no confirmó el registro. Revisa tu historial antes de reintentar.");
  window.netExamFinished=true;
  examMessage.textContent=`Calificación guardada correctamente. Modalidad: ${NET_MODALIDAD}. Intento: ${data.intento}.`;
  document.querySelector('#exam-score').textContent=`${data.calificacion}% · ${data.aprobado?'Aprobado.':'No aprobado.'}`;
  document.dispatchEvent(new Event('net-exam-finished'));
 }catch(error){examMessage.textContent="Guardado sin confirmar: "+error.message;retrySave.hidden=false}
 finally{netSaving=false}
}
const examForm=document.querySelector('#net-exam-form'),beginExam=document.querySelector('#begin-exam'),examClock=document.querySelector('#exam-clock'),examMessage=document.querySelector('#exam-message');
let examDeadline=0,examInterval=null;
function escapeExam(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function gradeNetExam(answers){return NET_QUESTIONS.reduce((score,q,i)=>score+(answers[i]===q.answer?10:0),0)}
function finishNetExam(timedOut=false){
 if(netExamGraded)return;
 const data=new FormData(examForm),answers=NET_QUESTIONS.map((_,i)=>data.has('q'+i)?Number(data.get('q'+i)):null);
 if(!timedOut&&answers.includes(null)){examMessage.textContent='Responde las diez preguntas antes de finalizar.';return}
 netExamGraded=true;clearInterval(examInterval);
 const score=gradeNetExam(answers);
 examForm.querySelectorAll('input,button').forEach(control=>control.disabled=true);
 examClock.hidden=true;examMessage.textContent=timedOut?'El tiempo terminó. Se calificaron las respuestas seleccionadas.':'Evaluación finalizada.';
 const result=document.querySelector('#exam-result');result.hidden=false;
 document.querySelector('#exam-score').textContent=`${score}% · ${score/10} de 10 respuestas correctas. ${score>=80?'Aprobado.':'No aprobado.'}`;
 result.focus();result.scrollIntoView({block:'nearest'});
 netPayload={respuestas:answers,modalidad:NET_MODALIDAD,numero_empleado_sesion:netParticipant.numero_empleado};
 saveNetResult();
}
function tickNetExam(){const left=Math.max(0,Math.ceil((examDeadline-Date.now())/1000));examClock.textContent=String(Math.floor(left/60)).padStart(2,'0')+':'+String(left%60).padStart(2,'0');if(!left)finishNetExam(true)}
beginExam.addEventListener('click',async()=>{
 beginExam.disabled=true;examMessage.textContent="Validando sesión…";
 try{
  const response=await fetch(NET_API+"/api/portal/session",{credentials:"include",cache:"no-store"});
  const data=await response.json().catch(()=>({}));
  if(!response.ok||!data.autenticado||!data.participante)throw new Error("Ingresa al portal antes de iniciar la evaluación. Si ya ingresaste, revisa que el navegador permita la sesión entre ambos sitios.");
  const servicio=String(data.participante.servicio||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim().replace(/\s+/g," ").toUpperCase();
  if(!["WALMART NET","WALMART VET","NET","VET","WALMART NET Y VET","WALMART VET Y NET"].includes(servicio))throw new Error("Esta evaluación está disponible para NET y VET.");
  netParticipant=data.participante;examMessage.textContent="";
 }catch(error){examMessage.textContent=error.message;beginExam.disabled=false;return}

 beginExam.hidden=true;examForm.hidden=false;examClock.hidden=false;
 examForm.innerHTML=NET_QUESTIONS.map((q,i)=>`<fieldset><legend>${i+1}. ${escapeExam(q.q)}</legend>${q.options.map((option,j)=>`<label><input type="radio" name="q${i}" value="${j}" required><span>${'ABCD'[j]}) ${escapeExam(option)}</span></label>`).join('')}</fieldset>`).join('')+'<button type="submit">Finalizar evaluación</button>';
 examDeadline=Date.now()+15*60*1000;tickNetExam();examInterval=setInterval(tickNetExam,1000);
});
examForm.addEventListener('submit',e=>{e.preventDefault();finishNetExam(Date.now()>=examDeadline)});
document.addEventListener('visibilitychange',()=>{if(examDeadline&&!netExamGraded)tickNetExam()});
