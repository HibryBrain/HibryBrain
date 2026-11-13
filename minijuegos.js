/* Navegación y preferencias de la página de minijuegos. */
(() => {
 const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('.main-nav');
 if(toggle&&nav)toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'Cerrar':'Menú'});
 const theme=document.querySelector('#contrast-toggle');
 if(theme){try{if(localStorage.getItem('otra-forma-de-mirar-theme')==='dark')document.body.classList.add('dark-mode')}catch(_){};const paint=()=>{const dark=document.body.classList.contains('dark-mode');theme.textContent=dark?'Modo claro':'Modo oscuro';theme.setAttribute('aria-pressed',String(dark))};paint();theme.addEventListener('click',()=>{document.body.classList.toggle('dark-mode');try{localStorage.setItem('otra-forma-de-mirar-theme',document.body.classList.contains('dark-mode')?'dark':'light')}catch(_){}paint()})}
})();

/* Juegos autónomos: memoria de trabajo, dibujo y atención flexible. */
function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}
// Coleccionables de juego: habilidades de apoyo cotidiano relacionadas con el TDAH.
const pixelCharacters = [
  {name:'Rem', image:'rem-pixel.png', note:'Ordena las ideas paso a paso.'},
  {name:'Senin', image:'senin-pixel.png', note:'Recuerda que cada quien tiene su propio ritmo.'},
  {name:'Rot', image:'rot-pixel.png', note:'Una pausa también es avanzar.'},
  {name:'Harper', image:'harper-pixel.png', note:'Expresa tu mundo a tu manera.'},
  {name:'Turn', image:'turn-pixel.png', note:'Pon tu energía en una cosa a la vez.'}
];
const powerItems = [
  {name:'Gota de enfoque', power:'Suma 12 segundos al reloj de este desafío.', image:'gota-enfoque.png', effect:'+12 segundos'},
  {name:'Brújula de ideas', power:'Revela una vez el siguiente símbolo de la secuencia.', image:'brujula-de-ideas.png', effect:'Pista de memoria'},
  {name:'Escudo de pausa', power:'Absorbe una respuesta incorrecta sin perder una vida.', image:'escudo-de-pausa.png', effect:'Protege 1 choque'},
  {name:'Llama de energía', power:'El reloj corre un 25 % más rápido, pero duplica los puntos de la ronda.', image:'llama-de-energia.png', effect:'Reloj turbo · XP doble'},
  {name:'Estrella de creatividad', power:'Revela los próximos dos símbolos de la secuencia.', image:'estrella-creatividad.png', effect:'Pista de 2 símbolos'},
  {name:'Nota de memoria', power:'Te deja barajar el tablero una vez sin perder tiempo ni vidas.', image:'nota-de-memoria.png', effect:'Baraja el tablero'},
  {name:'Rayo de movimiento', power:'Congela el reloj durante 5 segundos, una vez por ronda.', image:'rayo-de-movimiento.png', effect:'Pausa táctica · 5 s'},
  {name:'Sol de ánimo', power:'Si se agota el tiempo, recibes 10 segundos extra una vez.', image:'sol-de-animo.png', effect:'Última oportunidad · +10 s'},
  {name:'Mariposa flexible', power:'Salta un símbolo de la secuencia una vez.', image:'mariposa-flexible.png', effect:'Salta 1 símbolo'}
];
const collectionKey = 'tdah-minigames-powers-v1';
const activePowerKey = 'tdah-minigames-active-power-v1';
function readCollection() { try { const value = JSON.parse(localStorage.getItem(collectionKey) || '[]'); return Array.isArray(value) ? value.filter(i => Number.isInteger(i) && i >= 0 && i < powerItems.length) : []; } catch (_) { return []; } }
let collectedPowers = [...new Set(readCollection())];
function readEquippedPower() { try { const stored=localStorage.getItem(activePowerKey); if(stored===null)return collectedPowers.length?collectedPowers[0]:null; const value=Number(stored); return Number.isInteger(value)&&collectedPowers.includes(value)?value:null; } catch (_) { return null; } }
let activePowerId = readEquippedPower();
let audioContext = null;
function playVictoryTune() {
  try {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return;
    audioContext = audioContext || new Audio();
    if (audioContext.state === 'suspended') audioContext.resume();
    const now = audioContext.currentTime;
    [523.25,659.25,783.99,1046.5].forEach((frequency,index) => {
      const oscillator = audioContext.createOscillator(), gain = audioContext.createGain();
      oscillator.type = 'triangle'; oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(.0001, now + index * .13);
      gain.gain.exponentialRampToValueAtTime(.13, now + index * .13 + .025);
      gain.gain.exponentialRampToValueAtTime(.0001, now + index * .13 + .22);
      oscillator.connect(gain); gain.connect(audioContext.destination);
      oscillator.start(now + index * .13); oscillator.stop(now + index * .13 + .24);
    });
    const bell = audioContext.createOscillator(), bellGain = audioContext.createGain();
    bell.type='sine'; bell.frequency.setValueAtTime(1320,now+.57); bell.frequency.exponentialRampToValueAtTime(1760,now+.68);
    bellGain.gain.setValueAtTime(.0001,now+.57); bellGain.gain.exponentialRampToValueAtTime(.18,now+.59); bellGain.gain.exponentialRampToValueAtTime(.0001,now+.88);
    bell.connect(bellGain); bellGain.connect(audioContext.destination); bell.start(now+.57); bell.stop(now+.9);
  } catch (_) { /* El sonido es opcional si el navegador lo bloquea. */ }
}
function setActivePower(index) {
  if (!collectedPowers.includes(index)) return;
  activePowerId=index;
  try { localStorage.setItem(activePowerKey,String(index)); } catch (_) {}
  paintPowerCollection();
  if (typeof setPixelAvatar==='function') setPixelAvatar();
  if (typeof paintPixelControls==='function') paintPixelControls();
}
function paintPowerCollection() {
  const shelf=document.querySelector('#power-collection'), count=document.querySelector('#power-count');
  if (!shelf || !count) return;
  count.textContent=`${collectedPowers.length} / ${powerItems.length}`;
  shelf.innerHTML=powerItems.map((item,index)=>{
    const earned=collectedPowers.includes(index), equipped=earned && activePowerId===index;
    return `<article class="power-item ${earned?'is-earned':'is-locked'} ${equipped?'is-equipped':''}"><div class="power-icon-wrap"><img src="potenciadores/${item.image}" alt="${earned?item.name:'Potenciador por descubrir'}" loading="lazy"></div><h4>${earned?item.name:'???'}</h4><p>${earned?item.power:'Completa cualquiera de los retos para desbloquear este poder.'}</p><span class="power-state">${equipped?'EQUIPADO':earned?item.effect:'POR DESCUBRIR'}</span>${earned?`<button class="power-equip" type="button" data-power="${index}" aria-pressed="${equipped}">${equipped?'En uso':'Equipar'}</button>`:''}</article>`;
  }).join('');
  shelf.querySelectorAll('.power-equip').forEach(button=>button.addEventListener('click',()=>setActivePower(Number(button.dataset.power))));
}
function awardPower(source) {
  const next=powerItems.findIndex((_,index)=>!collectedPowers.includes(index));
  if (next < 0) { playVictoryTune(); showPixelPowerToast(null,source); return; }
  collectedPowers.push(next); activePowerId=next;
  try { localStorage.setItem(collectionKey,JSON.stringify(collectedPowers)); localStorage.setItem(activePowerKey,String(next)); } catch (_) {}
  paintPowerCollection(); playVictoryTune(); showPixelPowerToast(next,source);
}
function showPixelPowerToast(index,source) {
  const item=index===null?null:powerItems[index];
  const toast=document.createElement('div'); toast.className='power-toast'; toast.setAttribute('role','status');
  toast.innerHTML=item?`<img src="potenciadores/${item.image}" alt=""/><div><strong>¡${item.name} desbloqueado y equipado para el desafío!</strong><span>${item.effect} · ${item.power}</span><small>${source}</small></div><button type="button" aria-label="Cerrar aviso">×</button>`:`<img src="potenciadores/sol-de-animo.png" alt=""/><div><strong>¡Reto completado!</strong><span>Ya reuniste los nueve poderes. Puedes equipar otro para el desafío.</span><small>${source}</small></div><button type="button" aria-label="Cerrar aviso">×</button>`;
  document.body.appendChild(toast); requestAnimationFrame(()=>toast.classList.add('is-visible'));
  toast.querySelector('button').addEventListener('click',()=>toast.remove());
  window.setTimeout(()=>{toast.classList.remove('is-visible');window.setTimeout(()=>toast.remove(),450)},7000);
}
function paintPixelCrew() {
  const crew=document.querySelector('#pixel-crew'); if(!crew)return;
  let selected=''; try{selected=localStorage.getItem('tdah-minigames-companion')||''}catch(_){}
  crew.innerHTML=pixelCharacters.map((character,index)=>`<button type="button" class="pixel-companion ${selected===character.name?'is-selected':''}" aria-pressed="${selected===character.name}" data-name="${character.name}"><img src="personajes-pixel/${character.image}" alt="${character.name} en versión pixelada" loading="lazy"><strong>${character.name}</strong><span>${character.note}</span></button>`).join('');
  crew.querySelectorAll('.pixel-companion').forEach(button=>button.addEventListener('click',()=>{
    crew.querySelectorAll('.pixel-companion').forEach(item=>{item.classList.remove('is-selected');item.setAttribute('aria-pressed','false')});
    button.classList.add('is-selected');button.setAttribute('aria-pressed','true');try{localStorage.setItem('tdah-minigames-companion',button.dataset.name)}catch(_){}; if(typeof setPixelAvatar==='function')setPixelAvatar();
  }));
}
paintPixelCrew(); paintPowerCollection();
// Reto 01: repetir una secuencia breve para practicar memoria de trabajo.
const memoryArea = document.querySelector('#memory-game');
const memoryColors = [
  {name:'amarillo',hex:'#ffda37'},{name:'negro',hex:'#202020'},{name:'gris oscuro',hex:'#4a4a4a'},
  {name:'gris medio',hex:'#777777'},{name:'gris claro',hex:'#b8b8b8'},{name:'blanco',hex:'#ffffff'},
  {name:'dorado suave',hex:'#d0ae26'},{name:'grafito',hex:'#626262'},{name:'plata',hex:'#dedede'}
];
let memorySequence = [];
let memoryInput = [];
let memoryLocked = false;
let memoryDifficulty = 'medio';

function renderMemoryGame() {
  if (!memoryArea) return;
  const memoryLength = memoryDifficulty === 'facil' ? 3 : memoryDifficulty === 'desafio' ? 7 : 5;
  memorySequence = Array.from({ length: memoryLength }, () => Math.floor(Math.random() * 9));
  memoryInput = [];
  memoryLocked = true;
  memoryArea.innerHTML = '<p class="mini-game-status">Observa el patrón…</p>';
  const board = document.createElement('div');
  board.className = 'memory-board';

  for (let index = 0; index < 9; index += 1) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `memory-pad memory-pad-${index + 1}`;
    button.dataset.index = String(index);
    button.style.setProperty('--memory-color', memoryColors[index].hex);
    button.setAttribute('aria-label', `Cuadro ${index + 1}, ${memoryColors[index].name}`);
    button.addEventListener('click', () => {
      if (memoryLocked) return;
      const expected = memorySequence[memoryInput.length];
      memoryInput.push(index);
      button.classList.add('memory-hit');
      setTimeout(() => button.classList.remove('memory-hit'), 180);
      const status = memoryArea.querySelector('.mini-game-status');
      if (index !== expected) {
        status.textContent = 'Casi. Respira y prueba otro patrón.';
        memoryLocked = true;
        return;
      }
      if (memoryInput.length === memorySequence.length) {
        status.textContent = '¡Patrón completado! La práctica breve también cuenta.';
        memoryLocked = true;
        awardPower('Reto de memoria completado');
      }
    });
    board.appendChild(button);
  }

  memoryArea.appendChild(board);
  memorySequence.forEach((index, position) => {
    setTimeout(() => {
      const pad = board.children[index];
      if (!pad) return;
      pad.classList.add('memory-hit');
      setTimeout(() => pad.classList.remove('memory-hit'), 260);
      if (position === memorySequence.length - 1) {
        setTimeout(() => {
          memoryLocked = false;
          const status = memoryArea.querySelector('.mini-game-status');
          if (status) status.textContent = 'Ahora repite la secuencia.';
        }, 320);
      }
    }, 650 * (position + 1));
  });
}

// Reto 02: lienzo de dibujo con mouse o trackpad.
const drawingCanvas = document.querySelector('#drawing-canvas');
const drawingColor = document.querySelector('#drawing-color');
const drawingSize = document.querySelector('#drawing-size');
const drawingDifficulty = document.querySelector('#drawing-difficulty');
const drawingClear = document.querySelector('#drawing-clear');
const drawingEraser = document.querySelector('#drawing-eraser');
const drawingComplete = document.querySelector('#drawing-complete');
const drawingStatus = document.querySelector('#drawing-status');

if (drawingCanvas) {
  const drawingContext = drawingCanvas.getContext('2d');
  let drawing = false;
  let hasDrawing = false;
  let eraserEnabled = false;

  function drawingPoint(event) {
    const rect = drawingCanvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (drawingCanvas.width / rect.width),
      y: (event.clientY - rect.top) * (drawingCanvas.height / rect.height)
    };
  }

  function startDrawing(event) {
    drawing = true;
    const point = drawingPoint(event);
    drawingContext.beginPath();
    drawingContext.moveTo(point.x, point.y);
    drawingContext.globalCompositeOperation = eraserEnabled ? 'destination-out' : 'source-over';
    drawingContext.strokeStyle = eraserEnabled ? 'rgba(0,0,0,1)' : (drawingColor ? drawingColor.value : '#3d3d3d');
    drawingContext.lineWidth = drawingSize ? Number(drawingSize.value) : 5;
    drawingContext.lineCap = 'round';
    drawingContext.lineJoin = 'round';
    drawingCanvas.setPointerCapture(event.pointerId);
    if (drawingStatus) drawingStatus.textContent = 'Dibujando…';
  }

  function draw(event) {
    if (!drawing) return;
    const point = drawingPoint(event);
    drawingContext.lineTo(point.x, point.y);
    drawingContext.stroke();
    hasDrawing = true;
  }

  function stopDrawing(event) {
    if (!drawing) return;
    drawing = false;
    if (event && drawingCanvas.hasPointerCapture(event.pointerId)) drawingCanvas.releasePointerCapture(event.pointerId);
    if (drawingStatus) drawingStatus.textContent = hasDrawing ? 'Tu idea está tomando forma.' : 'El lienzo está listo.';
  }

  drawingCanvas.addEventListener('pointerdown', startDrawing);
  drawingCanvas.addEventListener('pointermove', draw);
  drawingCanvas.addEventListener('pointerup', stopDrawing);
  drawingCanvas.addEventListener('pointercancel', stopDrawing);
  drawingCanvas.addEventListener('pointerleave', event => {
    if (drawing && event.buttons === 0) stopDrawing(event);
  });

  if (drawingEraser) {
    drawingEraser.addEventListener('click', () => {
      eraserEnabled = !eraserEnabled;
      drawingEraser.setAttribute('aria-pressed', String(eraserEnabled));
      drawingEraser.classList.toggle('is-active', eraserEnabled);
      if (drawingStatus) drawingStatus.textContent = eraserEnabled ? 'Borrador activado.' : 'Lápiz activado.';
    });
  }
  if (drawingComplete) drawingComplete.addEventListener('click', () => {
    if (!hasDrawing) { if (drawingStatus) drawingStatus.textContent = 'Añade un trazo antes de completar el reto.'; return; }
    if (drawingStatus) drawingStatus.textContent = '¡Reto creativo completado! Tu idea ya cuenta.';
    awardPower('Reto creativo completado');
    hasDrawing = false;
  });
  if (drawingClear) {
    drawingClear.addEventListener('click', () => {
      drawingContext.globalCompositeOperation = 'source-over';
      drawingContext.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
      hasDrawing = false;
      if (drawingStatus) drawingStatus.textContent = 'Lienzo limpio. Puedes empezar de nuevo.';
    });
  }
}

// Retos creativos rotativos para motivar la expresión visual.
const drawingPrompt = document.querySelector('#drawing-prompt');
const drawingPromptNext = document.querySelector('#drawing-prompt-next');
const drawingPromptSets = { suave:['Dibuja una nube con zapatos.','Dibuja una fruta con una cara divertida.','Dibuja una línea que parezca una ola.'], explorador:['Dibuja un perro con la cola azul.','Inventa una casa para un personaje que necesita calma.','Dibuja un robot que ayude a ordenar una mochila.'], reto:['Dibuja un animal mitad pez y mitad bicicleta.','Crea una ciudad donde cada edificio tenga una emoción.','Dibuja un superhéroe con tres objetos inesperados.'] };
let drawingDifficultyValue = 'explorador';
let drawingPrompts = drawingPromptSets[drawingDifficultyValue];
let drawingPromptIndex = 0;
if (drawingPrompt && drawingPromptNext) drawingPromptNext.addEventListener('click', () => { drawingPromptIndex = (drawingPromptIndex + 1) % drawingPrompts.length; drawingPrompt.textContent = drawingPrompts[drawingPromptIndex]; });
if (drawingDifficulty) drawingDifficulty.addEventListener('change', event => { drawingDifficultyValue = event.target.value; drawingPrompts = drawingPromptSets[drawingDifficultyValue]; drawingPromptIndex = 0; drawingPrompt.textContent = drawingPrompts[0]; if (drawingSize) drawingSize.value = drawingDifficultyValue === 'suave' ? 7 : drawingDifficultyValue === 'reto' ? 3 : 5; });

// Reto 03: misión de atención flexible. Patrones por color y temporizador.
const challengeArea = document.querySelector('#focus-challenge');
const challengeColors = [
  {name:'amarillo dorado',hex:'#FFD21F'},
  {name:'amarillo limón',hex:'#F1F51F'},
  {name:'verde hoja',hex:'#35E06F'},
  {name:'verde turquesa',hex:'#00D7B0'},
  {name:'azul cielo',hex:'#19B5FF'},
  {name:'azul violeta',hex:'#536BFF'},
  {name:'rojo coral',hex:'#FF4058'},
  {name:'naranja suave',hex:'#FF852B'},
  {name:'violeta',hex:'#BB48F5'}
];
let challengeRound = 1;
let challengeSequence = [];
let challengeInput = [];
let challengeLocked = false;
let challengeTimerId = null;
let challengeTimeLeft = 0;
let challengeDifficulty = 'medio';
let focusPoints = Number(localStorage.getItem('tvah-focus-points') || 0);
let focusWins = Number(localStorage.getItem('tvah-focus-wins') || 0);

function stopChallengeTimer() {
  if (challengeTimerId) window.clearInterval(challengeTimerId);
  challengeTimerId = null;
}

function startChallengeTimer(status, nextButton) {
  stopChallengeTimer();
  const timeLimit = challengeDifficulty === 'facil' ? 45 : challengeDifficulty === 'desafio' ? 18 : 30;
  challengeTimeLeft = Math.max(challengeDifficulty === 'facil' ? 30 : 12, timeLimit - Math.max(0, challengeRound - 1) * 2);
  const timer = document.createElement('span');
  timer.className = 'challenge-timer';
  timer.setAttribute('role', 'timer');
  timer.setAttribute('aria-label', 'Tiempo restante');
  const statusRow = status.closest('.challenge-status-row') || status.parentElement || challengeArea;
  statusRow.appendChild(timer);
  const update = () => {
    timer.textContent = `Tiempo: ${challengeTimeLeft}s`;
    timer.classList.toggle('is-urgent', challengeTimeLeft <= 5);
  };
  update();
  challengeTimerId = window.setInterval(() => {
    challengeTimeLeft -= 1;
    update();
    if (challengeTimeLeft <= 0) {
      stopChallengeTimer();
      challengeLocked = true;
      status.textContent = 'Se acabó el tiempo. Reinicia la misión y vuelve a intentarlo.';
      if (nextButton) nextButton.remove();
      challengeArea.classList.add('challenge-timeout');
      window.setTimeout(() => challengeArea.classList.remove('challenge-timeout'), 500);
    }
  }, 1000);
}

function renderChallengeGame(resetRound = false) {
  if (!challengeArea) return;
  if (resetRound) challengeRound = 1;
  stopChallengeTimer();
  const settings = challengeDifficulty === 'facil' ? { cells: 12, sequence: 2 } : challengeDifficulty === 'desafio' ? { cells: 24, sequence: 4 } : { cells: 18, sequence: 3 };
  const cellCount = settings.cells;
  const sequenceLength = Math.min(7, settings.sequence + Math.floor((challengeRound - 1) / 2));
  challengeSequence = challengeColors.map((_, index) => index).sort(() => Math.random() - 0.5).slice(0, sequenceLength);
  challengeInput = [];
  challengeLocked = false;
  // Coloca las respuestas en casillas aleatorias: nunca quedan ordenadas al inicio.
  const cells = Array.from({ length: cellCount }, () => Math.floor(Math.random() * challengeColors.length));
  const shuffledPositions = Array.from({ length: cellCount }, (_, index) => index)
    .sort(() => Math.random() - 0.5);
  challengeSequence.forEach((colorIndex, index) => {
    cells[shuffledPositions[index]] = colorIndex;
  });

  challengeArea.innerHTML = '';
  const statusRow = document.createElement('div');
  statusRow.className = 'challenge-status-row';
  const status = document.createElement('p');
  status.className = 'mini-game-status';
  status.textContent = `Nivel ${challengeRound}: memoriza los colores y tócalos en orden.`;
  statusRow.appendChild(status);
  const score = document.createElement('span'); score.className = 'focus-score'; score.innerHTML = `★ <strong>${focusPoints}</strong> puntos`; score.setAttribute('aria-label', `${focusPoints} puntos ganados`); statusRow.appendChild(score);
  challengeArea.appendChild(statusRow);

  const target = document.createElement('div');
  target.className = 'challenge-target';
  target.setAttribute('aria-label', 'Patrón de colores objetivo');
  challengeSequence.forEach((colorIndex, index) => {
    const item = document.createElement('span');
    item.className = 'challenge-target-item';
    item.dataset.position = String(index);
    item.dataset.color = challengeColors[colorIndex].name;
    item.style.setProperty('--cell-color', challengeColors[colorIndex].hex);
    item.setAttribute('aria-label', `Color ${challengeColors[colorIndex].name}`);
    target.appendChild(item);
  });
  challengeArea.appendChild(target);

  const grid = document.createElement('div');
  grid.className = 'challenge-grid';
  cells.forEach((colorIndex, index) => {
    const color = challengeColors[colorIndex];
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'challenge-cell';
    button.dataset.color = color.name;
    button.style.setProperty('--cell-color', color.hex);
    button.setAttribute('aria-label', `Color ${color.name}, casilla ${index + 1}`);
    button.addEventListener('click', () => {
      if (challengeLocked || button.classList.contains('is-used')) return;
      const expected = challengeSequence[challengeInput.length];
      if (colorIndex !== expected) {
        challengeInput = [];
        grid.querySelectorAll('.challenge-cell').forEach(cell => cell.classList.remove('is-correct', 'is-used'));
        target.querySelectorAll('.challenge-target-item').forEach(item => item.classList.remove('is-complete'));
        status.textContent = 'Ese no era. El patrón se reinició; concéntrate y vuelve a intentarlo.';
        button.classList.add('is-wrong');
        window.setTimeout(() => button.classList.remove('is-wrong'), 300);
        return;
      }
      challengeInput.push(colorIndex);
      button.classList.add('is-correct', 'is-used');
      const targetItem = target.children[challengeInput.length - 1];
      if (targetItem) targetItem.classList.add('is-complete');
      if (challengeInput.length === challengeSequence.length) {
        challengeLocked = true;
        stopChallengeTimer();
        focusPoints += challengeDifficulty === 'facil' ? 5 : challengeDifficulty === 'desafio' ? 15 : 10; focusWins += 1; localStorage.setItem('tvah-focus-points', String(focusPoints)); localStorage.setItem('tvah-focus-wins', String(focusWins)); score.innerHTML = `★ <strong>${focusPoints}</strong> puntos`; score.classList.add('is-earned'); status.textContent = `¡Nivel ${challengeRound} superado! Ganaste puntos por completar el desafío. El próximo patrón será más difícil.`; awardPower(`Misión foco · nivel ${challengeRound} completado`);
        const nextButton = document.createElement('button');
        nextButton.type = 'button';
        nextButton.className = 'challenge-next';
        nextButton.textContent = 'Siguiente nivel';
        nextButton.addEventListener('click', () => { challengeRound += 1; renderChallengeGame(); });
        challengeArea.appendChild(nextButton);
      } else {
        status.textContent = `Bien. Busca el color ${challengeInput.length + 1} de ${challengeSequence.length}.`;
      }
    });
    grid.appendChild(button);
  });
  challengeArea.appendChild(grid);
  startChallengeTimer(status);
}


// Reto 04: secuencia visual bajo distractores. Solo esta actividad usa los potenciadores.
const pixelBoard=document.querySelector('#sequence-grid');
const pixelStatus=document.querySelector('#adventure-status');
const pixelStart=document.querySelector('#adventure-start');
const pixelReset=document.querySelector('#pixel-reset');
const pixelRetry=document.querySelector('#pixel-retry');
const pixelDifficulty=document.querySelector('#pixel-difficulty');
const pixelClock=document.querySelector('#adventure-clock');
const pixelLevelLabel=document.querySelector('#adventure-level');
const pixelScoreLabel=document.querySelector('#adventure-score');
const pixelLivesLabel=document.querySelector('#adventure-lives');
const pixelAvatar=document.querySelector('#adventure-player');
const pixelControls=document.querySelector('#adventure-controls');
const sequenceDisplay=document.querySelector('#sequence-display');
const cognitiveTokens=[
 {symbol:'●',tone:'light',name:'círculo claro'},{symbol:'▲',tone:'dark',name:'triángulo oscuro'},
 {symbol:'■',tone:'gold',name:'cuadrado amarillo'},{symbol:'◆',tone:'mid',name:'rombo gris'},
 {symbol:'★',tone:'light',name:'estrella clara'},{symbol:'⬟',tone:'dark',name:'hexágono oscuro'},
 {symbol:'✚',tone:'gold',name:'cruz amarilla'},{symbol:'☾',tone:'mid',name:'luna gris'},
 {symbol:'⬢',tone:'dark',name:'hexágono oscuro'},{symbol:'✦',tone:'gold',name:'destello amarillo'},
 {symbol:'⬤',tone:'mid',name:'círculo gris'},{symbol:'✿',tone:'light',name:'flor clara'},
 {symbol:'⬖',tone:'gold',name:'rombo amarillo'},{symbol:'⬥',tone:'mid',name:'diamante gris'},
 {symbol:'☼',tone:'dark',name:'sol oscuro'},{symbol:'⬛',tone:'light',name:'cuadro claro'},
 {symbol:'⬠',tone:'gold',name:'pentágono amarillo'},{symbol:'♣',tone:'mid',name:'trébol gris'},
 {symbol:'⬧',tone:'dark',name:'hexágono oscuro'},{symbol:'✳',tone:'gold',name:'asterisco amarillo'},
 {symbol:'⬡',tone:'light',name:'hexágono claro'},{symbol:'⬞',tone:'mid',name:'cuadro gris'},
 {symbol:'✺',tone:'gold',name:'estrella amarilla'},{symbol:'⬢',tone:'light',name:'hexágono claro'},
 {symbol:'✣',tone:'dark',name:'cruz oscura'}
];
let pixelLevel=1,pixelXP=0,pixelTimerId=null,pixelSeconds=0,pixelLives=3;
let pixelSequence=[],pixelStep=0,pixelRunning=false,pixelPowerUsed=false,pixelPause=0;
let pixelCalibration=false,pixelCalibMistakes=0,pixelCalibStarted=0,pixelRoundErrors=0;
let pixelGridSize=16;
function selectedCharacter(){try{const name=localStorage.getItem('tdah-minigames-companion')||'Rem';return pixelCharacters.find(c=>c.name===name)||pixelCharacters[0]}catch(_){return pixelCharacters[0]}}
function setPixelAvatar(){if(!pixelAvatar)return;const c=selectedCharacter();pixelAvatar.innerHTML=`<img src="personajes-pixel/${c.image}" alt=""><span>COMPAÑERO<br><strong>${c.name}</strong></span>`}
function difficultySettings(){const value=pixelCalibration?'suave':(pixelDifficulty?.value||'medio');const base=value==='suave'?{length:3,cells:12,time:65}:value==='experto'?{length:7,cells:25,time:34}:{length:5,cells:16,time:48};return {...base,length:base.length+Math.floor((pixelLevel-1)/2)}}
function timerDuration(){const s=difficultySettings();let n=Math.max(18,s.time-Math.max(0,pixelLevel-1)*2);if(!pixelCalibration&&activePowerId===0)n+=12;if(!pixelCalibration&&activePowerId===3)n=Math.max(14,Math.floor(n*.75));return n}
function stopPixelTimer(){if(pixelTimerId)window.clearInterval(pixelTimerId);pixelTimerId=null}
function updatePixelClock(){if(pixelClock){pixelClock.textContent=`${pixelSeconds} s`;pixelClock.classList.toggle('is-urgent',pixelSeconds<=8)}}
function updatePixelLives(){if(pixelLivesLabel)pixelLivesLabel.textContent=`${'♥ '.repeat(Math.max(0,pixelLives)).trim()} · ERRORES ${pixelRoundErrors}`}
function showSymbol(token,extra=''){if(!sequenceDisplay)return;sequenceDisplay.innerHTML=`<span class="sequence-caption">${extra||'RECUERDA ESTE SÍMBOLO'}</span><span class="sequence-flash token-${token.tone}">${token.symbol}</span>`}
function createBoard(){
 if(!pixelBoard)return;pixelBoard.innerHTML='';pixelBoard.style.setProperty('--grid-cols',String(Math.ceil(Math.sqrt(pixelGridSize))));
 const deck=[...pixelSequence];while(deck.length<pixelGridSize){deck.push(cognitiveTokens[Math.floor(Math.random()*cognitiveTokens.length)])}
 deck.sort(()=>Math.random()-.5);
 deck.forEach((token,i)=>{const b=document.createElement('button');b.type='button';b.className=`sequence-cell token-${token.tone}`;b.dataset.token=`${token.symbol}-${token.tone}`;b.setAttribute('aria-label',token.name);b.innerHTML=`<span>${token.symbol}</span>`;b.addEventListener('click',()=>selectSequenceToken(token,b));pixelBoard.appendChild(b)});
}
function showPowerHint(count=1){const upcoming=pixelSequence.slice(pixelStep,pixelStep+count);if(!upcoming.length)return;upcoming.forEach((token,i)=>window.setTimeout(()=>{showSymbol(token,`PISTA ${i+1} / ${upcoming.length}`);window.setTimeout(()=>{if(pixelRunning&&sequenceDisplay)sequenceDisplay.innerHTML='<span class="sequence-caption">¿RECUERDAS EL SIGUIENTE?</span><span class="sequence-question">?</span>'},850)},i*950))}
function pixelPowerAction(label,handler){const b=document.createElement('button');b.type='button';b.textContent=label;b.disabled=!pixelRunning;b.addEventListener('click',handler);pixelControls.appendChild(b);return b}
function paintPixelControls(){if(!pixelControls)return;pixelControls.innerHTML='';
 if(!pixelCalibration&&activePowerId===1)pixelPowerAction('⌖ Brújula · pista de 1 símbolo',()=>{if(pixelPowerUsed)return;pixelPowerUsed=true;showPowerHint(1);pixelStatus.textContent='La Brújula te muestra el siguiente símbolo una vez.'});
 if(!pixelCalibration&&activePowerId===4)pixelPowerAction('◎ Estrella · pista de 2 símbolos',()=>{if(pixelPowerUsed)return;pixelPowerUsed=true;showPowerHint(2);pixelStatus.textContent='La Estrella revela dos símbolos; memorízalos antes de que desaparezcan.'});
 if(!pixelCalibration&&activePowerId===5)pixelPowerAction('✳ Barajar tablero',()=>{if(pixelPowerUsed)return;pixelPowerUsed=true;createBoard();pixelStatus.textContent='Tablero reorganizado. La secuencia y tu avance se conservan.'});
 if(!pixelCalibration&&activePowerId===6)pixelPowerAction('Ⅱ Pausa táctica · 5 s',event=>{if(pixelPowerUsed)return;pixelPowerUsed=true;pixelPause=5;event.currentTarget.disabled=true;pixelStatus.textContent='Pausa táctica activada; el reloj está congelado.'});
 if(!pixelCalibration&&activePowerId===8)pixelPowerAction('» Saltar 1 símbolo',()=>{if(pixelPowerUsed)return;pixelPowerUsed=true;pixelStep=Math.min(pixelStep+1,pixelSequence.length);if(pixelStep>=pixelSequence.length)finishPixelRound(true);else pixelStatus.textContent='La Mariposa te ayudó a saltar un paso; continúa con el siguiente.'});
}
function startPixelTimer(){pixelSeconds=timerDuration();updatePixelClock();stopPixelTimer();pixelTimerId=window.setInterval(()=>{if(pixelPause>0){pixelPause--;pixelStatus.textContent=`Pausa táctica: ${pixelPause} s`;updatePixelClock();return}pixelSeconds--;updatePixelClock();if(pixelSeconds<=0&&!pixelCalibration&&activePowerId===7&&!pixelPowerUsed){pixelPowerUsed=true;pixelSeconds=10;pixelStatus.textContent='El Sol de ánimo añade 10 segundos.';updatePixelClock();return}if(pixelSeconds<=0)finishPixelRound(false,'Se agotó el tiempo. Reinicia la ronda o ajusta la dificultad.')},1000)}
function finishPixelRound(won,message=''){pixelRunning=false;stopPixelTimer();if(pixelStart){pixelStart.disabled=false;pixelStart.textContent='Iniciar desafío'}if(message)pixelStatus.textContent=message;if(won&&pixelCalibration){const elapsed=(Date.now()-pixelCalibStarted)/1000;const recommended=pixelCalibMistakes===0&&elapsed<9?'experto':pixelCalibMistakes<=1&&elapsed<16?'medio':'suave';pixelDifficulty.value=recommended;pixelStatus.textContent=`Calibración terminada: nivel recomendado ${recommended==='experto'?'Experta':recommended==='medio'?'Media':'Suave'}. Puedes cambiarlo cuando quieras.`;pixelCalibration=false;pixelStart.textContent='Iniciar desafío';return}if(won){const completed=pixelLevel;pixelXP+=100+(!pixelCalibration&&activePowerId===3?100:0);pixelLevel++;try{localStorage.setItem('tdah-pixel-cognitive-xp',String(pixelXP))}catch(_){};pixelScoreLabel.textContent=`${pixelXP} XP`;pixelLevelLabel.textContent=`RONDA ${completed} COMPLETADA`;if(!pixelCalibration)awardPower(`Desafío de memoria · ronda ${completed}`)}}
function selectSequenceToken(token,button){if(!pixelRunning||button.classList.contains('is-used'))return;const expected=pixelSequence[pixelStep];if(token.symbol===expected.symbol&&token.tone===expected.tone){pixelStep++;button.classList.add('is-used','is-correct');sequenceDisplay.innerHTML=`<span class="sequence-caption">${pixelStep} / ${pixelSequence.length} CORRECTOS</span><span class="sequence-question">${pixelStep===pixelSequence.length?'✓':'?'}</span>`;if(pixelStep>=pixelSequence.length)finishPixelRound(true,'¡Secuencia completa! Memoria y atención superadas.')}else{pixelRoundErrors++;if(pixelCalibration)pixelCalibMistakes++;updatePixelLives();button.classList.add('is-wrong');window.setTimeout(()=>button.classList.remove('is-wrong'),350);if(pixelCalibration){pixelStatus.textContent='Cuenta como un error, pero la prueba sigue para medir el nivel.';return}if(activePowerId===2&&!pixelPowerUsed){pixelPowerUsed=true;pixelStatus.textContent='El Escudo absorbió el error; tu secuencia sigue intacta.';return}pixelLives--;updatePixelLives();pixelStep=0;pixelBoard.querySelectorAll('.sequence-cell').forEach(x=>x.classList.remove('is-used','is-correct'));sequenceDisplay.innerHTML='<span class="sequence-caption">SECUENCIA REINICIADA</span><span class="sequence-question">?</span>';pixelStatus.textContent=`Ese símbolo no era el siguiente. Perdiste una vida, no la ronda. Te quedan ${pixelLives}.`;if(pixelLives<=0)finishPixelRound(false,'Se agotaron las vidas. Puedes reiniciar la actividad o bajar la dificultad.')}}
function startPixelChallenge(calibrate=false){if(!pixelBoard)return;pixelCalibration=calibrate;const settings=difficultySettings();pixelGridSize=settings.cells;pixelLives=3;pixelRoundErrors=0;pixelPowerUsed=false;pixelPause=0;pixelStep=0;pixelRunning=true;pixelSequence=[];while(pixelSequence.length<settings.length){let t=cognitiveTokens[Math.floor(Math.random()*cognitiveTokens.length)];if(!pixelSequence.some(x=>x.symbol===t.symbol&&x.tone===t.tone))pixelSequence.push(t)}pixelLevelLabel.textContent=`RONDA ${pixelLevel}`;setPixelAvatar();updatePixelLives();pixelStatus.textContent=`Memoriza ${settings.length} símbolos en orden. Después desaparecerán.`;if(pixelStart){pixelStart.disabled=true;pixelStart.textContent='Observa y recuerda…'}createBoard();paintPixelControls();let preview=[...pixelSequence];preview.forEach((t,i)=>setTimeout(()=>showSymbol(t,`MEMORIZA · ${i+1} / ${settings.length}`),900*i));setTimeout(()=>{if(!pixelRunning)return;sequenceDisplay.innerHTML='<span class="sequence-caption">REPRODUCE LA SECUENCIA</span><span class="sequence-question">?</span>';pixelBoard.classList.add('is-ready');pixelStatus.textContent='Selecciona los símbolos en el mismo orden. Hay distractores.';startPixelTimer()},settings.length*900+350)}
function resetPixelActivity(){stopPixelTimer();pixelRunning=false;pixelCalibration=false;pixelLevel=1;pixelXP=0;pixelLives=3;pixelRoundErrors=0;pixelPowerUsed=false;pixelStep=0;pixelSequence=[];try{localStorage.removeItem('tdah-pixel-cognitive-xp')}catch(_){};pixelScoreLabel.textContent='0 XP';pixelLevelLabel.textContent='RONDA 1';pixelDifficulty.value='medio';pixelStatus.textContent='Actividad reiniciada. Elige una dificultad y pulsa Iniciar desafío.';pixelStart.disabled=false;pixelStart.textContent='Iniciar desafío';sequenceDisplay.innerHTML='';pixelBoard.innerHTML='';pixelBoard.classList.remove('is-ready');updatePixelLives();paintPixelControls()}
function runCalibration(){pixelCalibMistakes=0;pixelCalibStarted=Date.now();pixelDifficulty.value='suave';pixelStatus.textContent='Prueba rápida: observa tres símbolos y repítelos; la recomendación se basa en aciertos y tiempo.';startPixelChallenge(true)}
if(pixelStart)pixelStart.addEventListener('click',()=>startPixelChallenge(false));if(pixelReset)pixelReset.addEventListener('click',resetPixelActivity);if(pixelRetry)pixelRetry.addEventListener('click',()=>startPixelChallenge(false));if(pixelDifficulty)pixelDifficulty.addEventListener('change',()=>{if(!pixelRunning)pixelStatus.textContent=`Dificultad ${pixelDifficulty.selectedOptions[0].text}. Pulsa Iniciar desafío.`});
setPixelAvatar();try{pixelXP=Number(localStorage.getItem('tdah-pixel-cognitive-xp')||0)}catch(_){};pixelScoreLabel.textContent=`${pixelXP} XP`;pixelLevelLabel.textContent=`RONDA ${pixelLevel}`;pixelLivesLabel.textContent='♥ ♥ ♥';pixelBoard.style.setProperty('--grid-cols','4');

document.querySelectorAll('.mini-game-reset').forEach(button => {
  button.addEventListener('click', () => {
    if (button.dataset.game === 'memory') renderMemoryGame();
    if (button.dataset.game === 'challenge') renderChallengeGame(true);
  });
});

document.querySelector('#memory-difficulty')?.addEventListener('change', event => {
  memoryDifficulty = event.target.value;
  renderMemoryGame();
});
document.querySelector('#challenge-difficulty')?.addEventListener('change', event => {
  challengeDifficulty = event.target.value;
  renderChallengeGame(true);
});

renderMemoryGame();
renderChallengeGame(true);
