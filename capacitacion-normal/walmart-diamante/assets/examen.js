const DIAMANTE_QUESTIONS=[
{q:"¿En qué consiste un código blanco?",options:["Indica un asalto","Indica que hay un asociado o cliente lesionado o existe una emergencia médica.","Indica que hay una emergencia por incendio en la unidad","Indica que un niño está perdido."],answer:1},
{q:"¿Qué debe hacer el guardia si detecta una anomalía o conducta irregular?",options:["Esperar a que termine el turno","Ignorarla si no representa un riesgo inmediato","Reportarla de inmediato a Seguridad Corporativa","Informarla únicamente a sus compañeros"],answer:2},
{q:"¿Qué personas tienen prohibido el acceso al corporativo?",options:["Asociados con gafete","Proveedores registrados","Vendedores ambulantes, promotores y personas ajenas a la compañía","Visitantes previamente anunciados"],answer:2},
{q:"¿Qué debe hacer un asociado que no cuenta con gafete?",options:["Ingresar sin identificación","Solicitar un gafete provisional con chip contra identificación oficial vigente","Utilizar el gafete de otro asociado","Esperar hasta el siguiente turno"],answer:1},
{q:"¿Qué identificación NO es aceptada para proporcionar un gafete provisional?",options:["INE","Licencia de conducir","Pasaporte","Identificación oficial vigente"],answer:2},
{q:"Cuando un visitante ingresa al edificio, ¿quién es responsable de acompañarlo durante toda su estancia?",options:["El guardia","Recepción","El asociado que recibe al visitante","El proveedor"],answer:2},
{q:"¿Qué debe hacer el guardia si encuentra a un visitante sin acompañante?",options:["Permitirle continuar","Abordarlo y conducirlo de inmediato a recepción","Solicitarle que abandone el edificio","Esperar a que aparezca el asociado"],answer:1},
{q:"¿Qué requisito se establece para realizar trabajos de riesgo?",options:["Únicamente presentar una identificación","Contar con EPP y los permisos especiales correspondientes","Realizarlos solamente después de las 18:00 hrs.","No requieren autorización si son trabajos menores"],answer:1},
{q:"¿Qué debe hacer el guardia ante una emergencia detectada en el edificio?",options:["Resolverla por cuenta propia","Informar inmediatamente al CMNET y al CAE","Esperar instrucciones del siguiente turno","Únicamente llamar a un compañero"],answer:1},
{q:"Durante una visita de una autoridad, ¿cuál es la conducta correcta del elemento de seguridad?",options:["Negarse a proporcionar cualquier información","Impedir el acceso hasta que termine la visita","Mantener una actitud amable e informar inmediatamente al líder de Seguridad Corporativa","Permitir el acceso sin informar a nadie"],answer:2}
];
const API_URL="https://capacitacion-production-3120.up.railway.app";
const MODALIDAD="E-LEARNING";
let participant=null,payload=null,saving=false,graded=false,deadline=0,timer=null;
const form=document.querySelector('#diamante-exam-form'),begin=document.querySelector('#begin-exam'),clock=document.querySelector('#exam-clock'),message=document.querySelector('#exam-message'),result=document.querySelector('#exam-result'),score=document.querySelector('#exam-score'),retry=document.querySelector('#retry-save');
function esc(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function norm(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().replace(/\s+/g,' ').toUpperCase()}
function allowed(v){return ['WALMART DIAMANTE','DIAMANTE'].includes(norm(v))}
async function save(){
 if(saving||!payload||window.diamanteExamFinished)return;
 saving=true;retry.hidden=true;message.textContent='Guardando calificación…';
 try{
  const r=await fetch(API_URL+'/api/portal/diamante/resultados',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
  const d=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error(r.status===401?'Tu sesión terminó. Vuelve a ingresar al portal y reintenta.':d.mensaje||'No fue posible guardar el resultado.');
  window.diamanteExamFinished=true;
  message.textContent=`Calificación guardada correctamente. Intento: ${d.intento||'registrado'}.`;
  score.textContent=`${d.calificacion}% · ${d.aprobado?'Aprobado.':'No aprobado.'}`;
  document.dispatchEvent(new Event('diamante-exam-finished'));
 }catch(e){message.textContent='Guardado sin confirmar: '+e.message;retry.hidden=false}
 finally{saving=false}
}
function grade(answers){return DIAMANTE_QUESTIONS.reduce((n,q,i)=>n+(answers[i]===q.answer?10:0),0)}
function finish(timedOut=false){
 if(graded)return;
 const fd=new FormData(form),answers=DIAMANTE_QUESTIONS.map((_,i)=>fd.has('q'+i)?Number(fd.get('q'+i)):null);
 if(!timedOut&&answers.includes(null)){message.textContent='Responde las diez preguntas antes de finalizar.';return}
 graded=true;clearInterval(timer);clock.hidden=true;form.querySelectorAll('input,button').forEach(c=>c.disabled=true);
 const local=grade(answers);result.hidden=false;score.textContent=`${local}% · ${local/10} de 10 respuestas correctas. ${local>=80?'Aprobado.':'No aprobado.'}`;
 message.textContent=timedOut?'El tiempo terminó. Se calificaron las respuestas seleccionadas.':'Evaluación finalizada.';
 result.focus();result.scrollIntoView({block:'nearest'});
 payload={respuestas:answers,modalidad:MODALIDAD,numero_empleado_sesion:participant.numero_empleado};
 save();
}
function tick(){const left=Math.max(0,Math.ceil((deadline-Date.now())/1000));clock.textContent=String(Math.floor(left/60)).padStart(2,'0')+':'+String(left%60).padStart(2,'0');if(!left)finish(true)}
begin.addEventListener('click',async()=>{
 begin.disabled=true;message.textContent='Validando sesión…';
 try{
  const r=await fetch(API_URL+'/api/portal/session',{credentials:'include',cache:'no-store'}),d=await r.json().catch(()=>({}));
  if(!r.ok||!d.autenticado||!d.participante)throw new Error('Ingresa al portal antes de iniciar la evaluación.');
  if(!allowed(d.participante.servicio))throw new Error('Esta evaluación está disponible únicamente para WALMART DIAMANTE.');
  participant=d.participante;
 }catch(e){message.textContent=e.message;begin.disabled=false;return}
 begin.hidden=true;form.hidden=false;clock.hidden=false;message.textContent=`Participante: ${participant.nombre}.`;
 form.innerHTML=DIAMANTE_QUESTIONS.map((q,i)=>`<fieldset><legend>${i+1}. ${esc(q.q)}</legend>${q.options.map((o,j)=>`<label><input type="radio" name="q${i}" value="${j}" required><span>${'ABCD'[j]}) ${esc(o)}</span></label>`).join('')}</fieldset>`).join('')+'<button type="submit">Finalizar evaluación</button>';
 deadline=Date.now()+15*60*1000;tick();timer=setInterval(tick,1000);
});
form.addEventListener('submit',e=>{e.preventDefault();finish(Date.now()>=deadline)});
retry.addEventListener('click',()=>save());
document.addEventListener('visibilitychange',()=>{if(deadline&&!graded)tick()});
