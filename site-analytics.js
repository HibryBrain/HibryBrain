/* Métricas solo locales. No se envían datos a servidores ni se presentan como estadísticas globales. */
(() => {
  const key='otra-forma-mirar-local-analytics-v1';
  const names={index:'Portada',inicio:'Inicio','que-es-el-tdah':'¿Qué es el TDAH?',recorrido:'Recorrido',personajes:'Personajes',especialistas:'Especialistas',entrevistas:'Entrevistas',blog:'Notas',galeria:'Galería',minijuegos:'Minijuegos',encuestas:'Encuestas',redes:'Redes',estadisticas:'Estadísticas',creadores:'Creadores'};
  const path=location.pathname.split('/').pop()||'index.html';const page=path.replace(/\.html?$/i,'')||'index';
  let data={total:0,pages:{}};try{data=JSON.parse(localStorage.getItem(key)||'null')||data}catch(_){}
  if(!data||typeof data!=='object'||Array.isArray(data))data={total:0,pages:{}};
  if(!data.pages||typeof data.pages!=='object'||Array.isArray(data.pages))data.pages={};data.total=(Number(data.total)||0)+1;data.pages[page]=(Number(data.pages[page])||0)+1;
  try{localStorage.setItem(key,JSON.stringify(data))}catch(_){}
  const total=document.getElementById('local-stat-total'),unique=document.getElementById('local-stat-pages'),top=document.getElementById('local-stat-top'),topCount=document.getElementById('local-stat-top-count'),host=document.getElementById('local-stat-bars');
  if(!host)return;
  total.textContent=String(data.total);unique.textContent=String(Object.keys(data.pages).length);
  const ordered=Object.entries(data.pages).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));
  const most=ordered[0];top.textContent=most?(names[most[0]]||most[0]):'—';topCount.textContent=most?`${most[1]} ${most[1]===1?'visita':'visitas'}`:'0 visitas';
  const rows=ordered.slice(0,6),max=Math.max(1,...rows.map(([,n])=>n));
  host.replaceChildren();if(!rows.length){const empty=document.createElement('p');empty.textContent='Aún no hay recorridos guardados en este navegador.';host.append(empty)}else rows.forEach(([id,n])=>{const row=document.createElement('div');row.className='local-stat-bar';const label=document.createElement('span');label.textContent=names[id]||id;const track=document.createElement('div');track.className='local-stat-bar-track';const fill=document.createElement('span');fill.style.width=`${Math.max(5,n/max*100)}%`;track.append(fill);const count=document.createElement('strong');count.textContent=String(n);row.append(label,track,count);host.append(row)});
})();
