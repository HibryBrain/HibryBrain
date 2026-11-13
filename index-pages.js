/* Guía interactiva de la portada: filtros, progreso local y animación accesible. */
(() => {
  const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('.main-nav');
  if(toggle&&nav)toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'Cerrar':'Menú'});
  const theme=document.querySelector('#contrast-toggle');
  if(theme){try{if(localStorage.getItem('otra-forma-de-mirar-theme')==='dark')document.body.classList.add('dark-mode')}catch(_){};const paint=()=>{const dark=document.body.classList.contains('dark-mode');theme.textContent=dark?'Modo claro':'Modo oscuro';theme.setAttribute('aria-pressed',String(dark))};paint();theme.addEventListener('click',()=>{document.body.classList.toggle('dark-mode');try{localStorage.setItem('otra-forma-de-mirar-theme',document.body.classList.contains('dark-mode')?'dark':'light')}catch(_){}paint()})}
  const cards=[...document.querySelectorAll('.route-card')],stations=[...document.querySelectorAll('.route-station')],filters=[...document.querySelectorAll('.route-filter')];
  const progressFill=document.getElementById('route-progress-fill'),progressTrack=document.querySelector('.route-progress-track'),count=document.getElementById('visited-count');
  const key='otraformamirada-visited-sections';let visited=[];try{visited=JSON.parse(localStorage.getItem(key)||'[]').filter(id=>cards.some(card=>card.dataset.routeId===id))}catch(_){}
  const updateProgress=()=>{const total=cards.length,number=Math.min(total,new Set(visited).size),pct=number/total*100;if(count)count.textContent=String(number);if(progressFill)progressFill.style.width=pct+'%';if(progressTrack){progressTrack.setAttribute('aria-valuemax',String(total));progressTrack.setAttribute('aria-valuenow',String(number));progressTrack.setAttribute('aria-valuetext',`${number} de ${total} secciones visitadas`)}};
  cards.forEach(card=>{if(visited.includes(card.dataset.routeId))card.classList.add('has-visited');card.addEventListener('click',()=>{visited=[...new Set([...visited,card.dataset.routeId])];try{localStorage.setItem(key,JSON.stringify(visited))}catch(_){}updateProgress()})});updateProgress();
  let revealTimers=[];
  filters.forEach(button=>button.addEventListener('click',()=>{
    revealTimers.forEach(timer=>window.clearTimeout(timer));
    revealTimers=[];
    const category=button.dataset.filter;
    const emptyHint=document.querySelector('#route-empty-hint');if(emptyHint)emptyHint.hidden=true;
    filters.forEach(other=>{const active=other===button;other.classList.toggle('is-active',active);other.setAttribute('aria-pressed',String(active))});
    // Hide first, then reveal only the chosen station; "Todas" remains opt-in.
    stations.forEach(station=>{station.hidden=true;station.classList.remove('has-entered')});
    cards.forEach(card=>{card.hidden=true});
    const selected=category==='todas'?stations:stations.filter(station=>station.dataset.station===category);
    selected.forEach((station,index)=>revealTimers.push(window.setTimeout(()=>{
      station.hidden=false;
      station.querySelectorAll('.route-card').forEach(card=>{card.hidden=false});
      station.classList.add('has-entered');
    },category==='todas'?index*190:0)));
    document.querySelector('.route-guide')?.scrollIntoView({behavior:'smooth',block:'start'});
  }));
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!reduced&&'IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('has-entered');observer.unobserve(entry.target)}}),{threshold:.12});stations.forEach(station=>observer.observe(station))}
})();
