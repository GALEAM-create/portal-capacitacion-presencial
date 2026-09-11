const NET_QUESTIONS=[{"q": "¿En qué consiste un código blanco?", "options": ["Indica un asalto", "Indica que hay un asociado o cliente lesionado o existe una emergencia médica.", "Indica que hay una emergencia por incendio en la unidad", "Indica que un niño está perdido."], "answer": 1}, {"q": "¿Qué debe hacer el guardia si detecta una anomalía o conducta irregular?", "options": ["Esperar a que termine el turno", "Ignorarla si no representa un riesgo inmediato", "Reportarla de inmediato a Seguridad Corporativa", "Informarla únicamente a sus compañeros"], "answer": 2}, {"q": "¿Qué personas tienen prohibido el acceso al corporativo?", "options": ["Asociados con gafete", "Proveedores registrados", "Vendedores ambulantes, promotores y personas ajenas a la compañía", "Visitantes previamente anunciados"], "answer": 2}, {"q": "¿Qué debe hacer un asociado que no cuenta con gafete?", "options": ["Ingresar sin identificación", "Solicitar un gafete provisional con chip contra identificación oficial vigente", "Utilizar el gafete de otro asociado", "Esperar hasta el siguiente turno"], "answer": 1}, {"q": "¿Qué identificación NO es aceptada para proporcionar un gafete provisional?", "options": ["INE", "Licencia de conducir", "Pasaporte", "Identificación oficial vigente"], "answer": 2}, {"q": "Cuando un visitante ingresa al edificio, ¿quién es responsable de acompañarlo durante toda su estancia?", "options": ["El guardia", "Recepción", "El asociado que recibe al visitante", "El proveedor"], "answer": 2}, {"q": "¿Qué debe hacer el guardia si encuentra a un visitante sin acompañante?", "options": ["Permitirle continuar", "Abordarlo y conducirlo de inmediato a recepción", "Solicitarle que abandone el edificio", "Esperar a que aparezca el asociado"], "answer": 1}, {"q": "¿Qué requisito se establece para realizar trabajos de riesgo?", "options": ["Únicamente presentar una identificación", "Contar con EPP y los permisos especiales correspondientes", "Realizarlos solamente después de las 18:00 hrs.", "No requieren autorización si son trabajos menores"], "answer": 1}, {"q": "¿Qué debe hacer el guardia ante una emergencia detectada en el edificio?", "options": ["Resolverla por cuenta propia", "Informar inmediatamente al CMNET y al CAE", "Esperar instrucciones del siguiente turno", "Únicamente llamar a un compañero"], "answer": 1}, {"q": "Durante una visita de una autoridad, ¿cuál es la conducta correcta del elemento de seguridad?", "options": ["Negarse a proporcionar cualquier información", "Impedir el acceso hasta que termine la visita", "Mantener una actitud amable e informar inmediatamente al líder de Seguridad Corporativa", "Permitir el acceso sin informar a nadie"], "answer": 2}];

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
  const response=await fetch(NET_API+"/api/portal/diamante/resultados",{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify(netPayload)});
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
  if(!["WALMART DIAMANTE","DIAMANTE"].includes(servicio))throw new Error("Esta evaluación está disponible para Walmart Diamante.");
  netParticipant=data.participante;examMessage.textContent="";
 }catch(error){examMessage.textContent=error.message;beginExam.disabled=false;return}

 beginExam.hidden=true;examForm.hidden=false;examClock.hidden=false;
 examForm.innerHTML=NET_QUESTIONS.map((q,i)=>`<fieldset><legend>${i+1}. ${escapeExam(q.q)}</legend>${q.options.map((option,j)=>`<label><input type="radio" name="q${i}" value="${j}" required><span>${'ABCD'[j]}) ${escapeExam(option)}</span></label>`).join('')}</fieldset>`).join('')+'<button type="submit">Finalizar evaluación</button>';
 examDeadline=Date.now()+15*60*1000;tickNetExam();examInterval=setInterval(tickNetExam,1000);
});
examForm.addEventListener('submit',e=>{e.preventDefault();finishNetExam(Date.now()>=examDeadline)});
document.addEventListener('visibilitychange',()=>{if(examDeadline&&!netExamGraded)tickNetExam()});
