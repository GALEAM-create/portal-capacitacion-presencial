const pages=[...document.querySelectorAll('.page')];
const previous=document.querySelector('#previous'),next=document.querySelector('#next'),counter=document.querySelector('#counter'),viewer=document.querySelector('#viewer');
let current=0,start=null;
function showPage(index,focus=true){
  current=Math.max(0,Math.min(pages.length-1,index));
  if(current===20&&!window.netExamFinished)current=19;
  pages.forEach((page,i)=>{page.hidden=i!==current});
  pages[current].scrollTop=0;
  previous.disabled=current===0;
  next.disabled=current===19&&!window.netExamFinished;
  next.textContent=current===pages.length-1?'Volver al inicio':'Siguiente →';
  counter.textContent=`${String(current+1).padStart(2,'0')} / ${pages.length}`;
  history.replaceState(null,'',`#${pages[current].id}`);
  if(focus)pages[current].querySelector('h1').focus({preventScroll:true});
}
previous.addEventListener('click',()=>showPage(current-1));
next.addEventListener('click',()=>showPage(current===pages.length-1?0:current+1));
document.querySelectorAll('[data-page]').forEach(button=>button.addEventListener('click',()=>showPage(Number(button.dataset.page))));
document.addEventListener('keydown',event=>{
  if(viewer.open||event.altKey||event.ctrlKey||event.metaKey)return;
  if(event.key==='ArrowRight'){event.preventDefault();showPage(current+1)}
  if(event.key==='ArrowLeft'){event.preventDefault();showPage(current-1)}
});
const course=document.querySelector('#course');
course.addEventListener('touchstart',event=>{start=event.touches.length===1?{x:event.touches[0].clientX,y:event.touches[0].clientY}:null},{passive:true});
course.addEventListener('touchend',event=>{
  if(!start||viewer.open)return;
  const touch=event.changedTouches[0],dx=touch.clientX-start.x,dy=touch.clientY-start.y;start=null;
  if(Math.abs(dx)>70&&Math.abs(dx)>Math.abs(dy)*1.8)showPage(current+(dx<0?1:-1));
},{passive:true});
course.addEventListener('touchcancel',()=>{start=null},{passive:true});
document.querySelectorAll('[data-image]').forEach(button=>button.addEventListener('click',()=>{viewer.querySelector('img').src=button.dataset.image;viewer.showModal()}));
document.querySelector('#close-viewer').addEventListener('click',()=>viewer.close());
showPage(0,false);

document.addEventListener("net-exam-finished",()=>{next.disabled=false});
