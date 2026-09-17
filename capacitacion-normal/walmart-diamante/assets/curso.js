const pages=[...document.querySelectorAll('.page')];
const previous=document.querySelector('#previous'),next=document.querySelector('#next'),counter=document.querySelector('#counter'),course=document.querySelector('#course');
const examIndex=pages.findIndex(p=>p.id==='evaluacion');
const finishIndex=pages.findIndex(p=>p.id==='gracias');
let current=0,start=null;
window.diamanteExamFinished=false;
function showPage(index,focus=true){
  let target=Math.max(0,Math.min(pages.length-1,index));
  if(target===finishIndex&&!window.diamanteExamFinished)target=examIndex;
  current=target;
  pages.forEach((p,i)=>p.hidden=i!==current);
  pages[current].scrollTop=0;
  previous.disabled=current===0;
  next.disabled=current===examIndex&&!window.diamanteExamFinished;
  next.textContent=current===pages.length-1?'Volver al inicio':'Siguiente →';
  counter.textContent=`${String(current+1).padStart(2,'0')} / ${pages.length}`;
  history.replaceState(null,'',`#${pages[current].id}`);
  if(focus)pages[current].querySelector('h1')?.focus({preventScroll:true});
}
previous.addEventListener('click',()=>showPage(current-1));
next.addEventListener('click',()=>showPage(current===pages.length-1?0:current+1));
document.querySelectorAll('[data-page]').forEach(b=>b.addEventListener('click',()=>showPage(Number(b.dataset.page))));
document.addEventListener('keydown',e=>{if(e.altKey||e.ctrlKey||e.metaKey)return;if(e.key==='ArrowRight'){e.preventDefault();showPage(current+1)}if(e.key==='ArrowLeft'){e.preventDefault();showPage(current-1)}});
course.addEventListener('touchstart',e=>{start=e.touches.length===1?{x:e.touches[0].clientX,y:e.touches[0].clientY}:null},{passive:true});
course.addEventListener('touchend',e=>{if(!start)return;const t=e.changedTouches[0],dx=t.clientX-start.x,dy=t.clientY-start.y;start=null;if(Math.abs(dx)>70&&Math.abs(dx)>Math.abs(dy)*1.8)showPage(current+(dx<0?1:-1))},{passive:true});
course.addEventListener('touchcancel',()=>{start=null},{passive:true});
document.addEventListener('diamante-exam-finished',()=>{window.diamanteExamFinished=true;next.disabled=false});
showPage(0,false);
