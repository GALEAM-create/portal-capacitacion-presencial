(function(){
  'use strict';
  const COURSE_NAME='Consignas específicas — Walmart Central de Documentos';
  const PASSING_SCORE=80;
  const API_BASE=String(window.PORTAL_CONFIG?.apiBase||localStorage.getItem('apiBase')||'').replace(/\/$/,'');
  const screens=[...document.querySelectorAll('.screen')];
  const progressBar=document.querySelector('#progressBar');
  const pageLabel=document.querySelector('#pageLabel');
  const prevButton=document.querySelector('#prevButton');
  const nextButton=document.querySelector('#nextButton');
  const courseNav=document.querySelector('.course-nav');
  let current=0;

  const questions=[
    {q:'¿Con cuánto tiempo de anticipación debe llegar el guardia para iniciar su turno?',o:['5 minutos','10 minutos','15 minutos','20 minutos'],a:1},
    {q:'¿Qué debe realizar el guardia durante el relevo?',o:['Únicamente entregar las llaves','Entregar y recibir formalmente novedades y equipos resguardados','Retirarse inmediatamente al terminar su horario','Esperar a que otro guardia revise la bitácora'],a:1},
    {q:'¿Qué debe hacer el guardia respecto al gafete de los asociados?',o:['Permitir que sea utilizado por cualquier persona','Verificar que sea visible y esté colocado al pecho','Retirarlo al ingresar a las instalaciones','Guardarlo durante toda la jornada'],a:1},
    {q:'¿Qué está prohibido retirar del área de vales sin la autorización correspondiente?',o:['Únicamente bolsas','Únicamente cajas','Bolsas y cajas sin firma del personal autorizado','Cualquier objeto personal del asociado'],a:2},
    {q:'Para prestar un gafete provisional con chip, ¿qué identificación debe entregar el usuario?',o:['Pasaporte vigente','Credencial escolar','INE o licencia vigente','Cualquier identificación con fotografía'],a:2},
    {q:'¿Qué debe hacer el guardia si un asociado presenta una falla en la lectura de su gafete?',o:['Permitirle el acceso sin validación','Retener el gafete','Canalizarlo a Recursos Humanos','Solicitarle que utilice el gafete de otro asociado'],a:2},
    {q:'¿Qué requisito se establece para los proveedores de mantenimiento?',o:['Presentarse sin previo aviso','Contar con correo programado a Facilities y canalización con mantenimiento','Presentar únicamente una identificación','Ingresar directamente al área de trabajo'],a:1},
    {q:'¿En cuánto tiempo debe operar la planta de emergencia después de un corte de luz?',o:['10 segundos','20 segundos','30 segundos','60 segundos'],a:2},
    {q:'Ante fuego, explosión, robo, amenaza, sismo o intrusión, ¿qué debe hacer el guardia?',o:['Esperar instrucciones del siguiente turno','Notificar inmediatamente al Centro de Atención de Emergencias','Abandonar el puesto','Informar únicamente mediante la bitácora'],a:1},
    {q:'¿Qué debe hacer el guardia durante la revisión de un artículo olvidado?',o:['Entregarlo sin registro','Guardarlo hasta finalizar el turno','Revisarlo frente a la persona y CCTV, registrarlo y solicitar firma','Desecharlo si no se identifica al propietario'],a:2}
  ];

  const quizForm=document.querySelector('#quizForm');
  quizForm.innerHTML=questions.map((item,i)=>`<fieldset class="quiz-card"><legend>${i+1}. ${item.q}</legend>${item.o.map((option,j)=>`<label class="option"><input type="radio" name="q${i}" value="${j}"><span>${String.fromCharCode(65+j)}) ${option}</span></label>`).join('')}</fieldset>`).join('');

  function show(index,pushHash=true){
    current=Math.max(0,Math.min(index,screens.length-1));
    screens.forEach((s,i)=>s.classList.toggle('active',i===current));
    const name=screens[current].dataset.screen;
    pageLabel.textContent=current===0?'Portada':current===screens.length-1?'Resultado':`Página ${current} de ${screens.length-2}`;
    progressBar.style.width=`${Math.round((current/(screens.length-1))*100)}%`;
    prevButton.hidden=current===0||current===screens.length-1;
    nextButton.hidden=current===0||current>=screens.length-2;
    courseNav.hidden=current===screens.length-1;
    if(pushHash) history.replaceState(null,'',`#${name}`);
    window.scrollTo({top:0,behavior:'smooth'});
    document.querySelector('#course').focus({preventScroll:true});
  }
  function next(){show(current+1)}
  function previous(){show(current-1)}
  document.querySelectorAll('[data-next]').forEach(b=>b.addEventListener('click',next));
  nextButton.addEventListener('click',next); prevButton.addEventListener('click',previous);
  document.addEventListener('keydown',e=>{if(e.key==='ArrowRight'&&!nextButton.hidden)next();if(e.key==='ArrowLeft'&&!prevButton.hidden)previous()});

  function portalUser(){
    const params=new URLSearchParams(location.search);
    const sources=[params,localStorage,sessionStorage];
    const get=(...keys)=>{for(const source of sources){for(const key of keys){const v=source.getItem?source.getItem(key):source.get(key);if(v)return v}}return ''};
    return {nombre:get('nombre','nombreCompleto','empleadoNombre','userName'),numero_empleado:get('numero_empleado','numeroEmpleado','empleado','employeeNumber'),servicio:get('servicio','service','empleadoServicio')};
  }
  async function saveResult(score){
    const user=portalUser();
    const payload={curso:COURSE_NAME,calificacion:score,puntaje:score,aprobado:score>=PASSING_SCORE,nombre:user.nombre,numero_empleado:user.numero_empleado,servicio:user.servicio||'WALMART CENTRAL DE DOCUMENTOS',fecha:new Date().toISOString()};
    try{
      const response=await fetch(`${API_BASE}/api/resultados`,{method:'POST',headers:{'Content-Type':'application/json'},credentials:'include',body:JSON.stringify(payload)});
      if(!response.ok)throw new Error(`HTTP ${response.status}`);
      localStorage.setItem('ultimoResultadoCentralDocumentos',JSON.stringify(payload));
    }catch(error){
      console.error('No fue posible guardar el resultado:',error);
      localStorage.setItem('resultadoPendienteCentralDocumentos',JSON.stringify(payload));
    }
  }
  document.querySelector('#gradeButton').addEventListener('click',async()=>{
    const answers=questions.map((_,i)=>quizForm.querySelector(`input[name="q${i}"]:checked`));
    const unanswered=answers.filter(x=>!x).length;
    const message=document.querySelector('#quizMessage');
    if(unanswered){message.textContent=`Faltan ${unanswered} ${unanswered===1?'pregunta':'preguntas'} por contestar.`;return}
    message.textContent='';
    const correct=answers.reduce((sum,input,i)=>sum+(Number(input.value)===questions[i].a?1:0),0);
    const score=correct*10, passed=score>=PASSING_SCORE;
    document.querySelector('#scoreValue').textContent=score;
    document.querySelector('#resultTitle').textContent=passed?'Capacitación aprobada':'Aún puedes mejorar';
    document.querySelector('#resultMessage').textContent=passed?'Tu resultado quedó registrado. Puedes volver al portal.':`Obtuviste ${correct} de 10 respuestas correctas. Repasa el contenido y vuelve a intentarlo.`;
    document.querySelector('#retryButton').hidden=passed;
    document.querySelector('#exitButton').hidden=!passed;
    await saveResult(score); show(screens.length-1);
  });
  document.querySelector('#retryButton').addEventListener('click',()=>{quizForm.reset();show(screens.length-2)});
  const hash=location.hash.slice(1); const start=Math.max(0,screens.findIndex(s=>s.dataset.screen===hash)); show(start,false);
})();
