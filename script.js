const body = document.body;
const root = document.documentElement;
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const themeToggle = document.querySelector('#contrast-toggle');

if (menuToggle && mainNav) {
  const menuHome = mainNav.parentNode;
  const menuHomeNext = mainNav.nextSibling;
  const menuBackdrop = document.createElement('button');
  menuBackdrop.type = 'button';
  menuBackdrop.className = 'mobile-menu-backdrop';
  menuBackdrop.setAttribute('aria-label', 'Cerrar menú');
  menuBackdrop.hidden = true;
  document.body.appendChild(menuBackdrop);
  const setMenuOpen = open => {
    if (open) document.body.appendChild(mainNav);
    mainNav.classList.toggle('open', open);
    menuBackdrop.hidden = !open;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.textContent = open ? 'Cerrar' : 'Menú';
    document.body.classList.toggle('mobile-menu-open', open);
    if (!open && mainNav.parentNode !== menuHome) menuHome.insertBefore(mainNav, menuHomeNext);
  };
  menuToggle.addEventListener('click', () => setMenuOpen(!mainNav.classList.contains('open')));
  menuBackdrop.addEventListener('click', () => setMenuOpen(false));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && mainNav.classList.contains('open')) { setMenuOpen(false); menuToggle.focus(); } });
  document.querySelectorAll('.main-nav a, .main-nav .contrast-button').forEach(link => link.addEventListener('click', () => setMenuOpen(false)));
  window.addEventListener('resize', () => { if (window.innerWidth > 760) setMenuOpen(false); });
}
// Tema visual: el sitio inicia en modo claro y recuerda la elección de la persona.
const THEME_STORAGE_KEY = 'otra-forma-de-mirar-theme';
let savedTheme = null;
try {
  savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
} catch (error) {
  savedTheme = null;
}
if (savedTheme === 'dark') body.classList.add('dark-mode');

function updateThemeButton() {
  if (!themeToggle) return;
  const darkMode = body.classList.contains('dark-mode');
  themeToggle.setAttribute('aria-pressed', String(darkMode));
  themeToggle.textContent = darkMode ? 'Modo claro' : 'Modo oscuro';
  themeToggle.setAttribute('aria-label', darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const darkMode = body.classList.toggle('dark-mode');
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, darkMode ? 'dark' : 'light');
    } catch (error) {
      // El tema sigue funcionando aunque el navegador bloquee localStorage.
    }
    updateThemeButton();
  });
}
updateThemeButton();

// Créditos del video: panel compacto para mantener limpia la composición.
const videoCreditsToggle = document.querySelector('#video-credits-toggle');
const videoCreditsPanel = document.querySelector('#video-credits-panel');
if (videoCreditsToggle && videoCreditsPanel) {
  videoCreditsToggle.addEventListener('click', () => {
    const isOpen = videoCreditsToggle.getAttribute('aria-expanded') === 'true';
    videoCreditsToggle.setAttribute('aria-expanded', String(!isOpen));
    videoCreditsToggle.classList.toggle('is-open', !isOpen);
    videoCreditsPanel.hidden = isOpen;
  });
}

const storyOrder = ["rem", "senin", "rot", "harper", "turn"];
const stories = {
  rem: {
    name: "Rem · La chispa del mapa",
    text: "En el colegio Arcoíris había un salón con una puerta que nadie lograba abrir. Un lunes, mientras la clase parecía llenarse de voces y tareas, una pequeña luz salió del cuaderno de una estudiante. Era REM, un diamante transparente que brillaba cada vez que alguien hacía una pregunta amable. «No tienes que resolverlo todo hoy», dijo. Con su luz, convirtió una tarea enorme en tres huellas pequeñitas: leer, elegir y comenzar. La puerta no se abrió todavía, pero en el suelo apareció un mapa. Rem decidió llevarlo al patio, donde alguien más podría ayudar.",
    hook: "Reto de Rem: elige una tarea y conviértela en tres pasos pequeños. ¿Cuál sería el primero?",
    tip: "Si una tarea parece gigante, dibuja tres huellas y empieza solo por la primera."
  },
  senin: {
    name: "Senin · El puente de la paciencia",
    text: "Al final del mapa, REM encontró a SENIN sentado junto al puente del patio. Su barba parecía una nube y su bastón tenía grabadas muchas rutas. «Los caminos no se apuran cuando quieren llegar lejos», explicó. SENIN escuchó lo que cada integrante necesitaba y propuso cruzar el puente de una manera distinta: con una pausa para respirar, una pregunta clara y una rutina que pudiera cambiar si el día se volvía difícil. Gracias a esa calma, el mapa dejó de temblar. En la otra orilla se escuchó un ruido fuerte, como si alguien necesitara compañía.",
    hook: "Brújula de Senin: ¿qué te ayudaría hoy: una pausa, una pregunta clara o una rutina flexible?",
    tip: "Antes de correr, pregunta: «¿Qué necesito para sentirme listo?»."
  },
  rot: {
    name: "Rot · El bosque de los mil ruidos",
    text: "El ruido venía de un bosque donde las hojas susurraban, los lápices rodaban y cada campana sonaba al mismo tiempo. Allí vivía ROT, con el cabello despeinado y los ojos cansados. No era un monstruo: era un amigo que había pasado tanto tiempo intentando atenderlo todo que ya no sabía qué escuchar primero. REM hizo brillar una sola huella del mapa. SENIN pidió silencio durante unos segundos. ROT eligió una hoja, luego otra, y descubrió que su mente podía regresar sin que nadie se burlara. Cuando volvió a mirar, encontró una llave escondida entre las ramas.",
    hook: "Pausa de Rot: identifica una distracción y prueba a reducirla durante un minuto. ¿Qué cambia?",
    tip: "Cuando haya demasiado ruido, elige una sola cosa, haz una pausa y vuelve a tu ritmo."
  },
  harper: {
    name: "Harper · La historia que encontró una voz",
    text: "La llave llevó al grupo a la biblioteca, donde HARPER escribía en un cuaderno verde. Tenía dieciséis años y guardaba allí las cosas que a veces costaba explicar: la presión de las expectativas, el miedo a equivocarse y también las ideas brillantes que aparecían de repente. Al escuchar a ROT, Harper no dijo «concéntrate»; preguntó «¿cómo puedo entenderte?». Después dibujó el bosque, escribió la calma de Senin y convirtió la luz de Rem en una historieta. Cada viñeta hizo que la llave creciera. Para abrir la puerta, aún faltaba una última cosa: encontrar una energía capaz de poner la historia en movimiento.",
    hook: "Desafío de Harper: cuenta esta situación con palabras, dibujos o movimiento. ¡Hay muchas formas de expresarse!",
    tip: "Puedes contar lo que sientes con palabras, dibujos, música o movimiento. Tu voz tiene más de una forma."
  },
  turn: {
    name: "Turn · La puerta para todos",
    text: "TURN apareció dando saltos, con una mochila llena de ideas y una pregunta urgente: «¿Qué habrá al otro lado?». A veces le costaba esperar, se distraía con cada descubrimiento y sentía un nudo en el pecho cuando las cosas no salían rápido. Pero esta vez no corrió solo. Harper le enseñó el cuaderno, Rot señaló el lugar tranquilo, Senin marcó un ritmo posible y Rem iluminó la última huella. Turn tomó aire, reunió sus fuerzas y puso la llave en la puerta. Al abrirla, no encontraron un premio: encontraron una mesa redonda con cinco sillas y espacio para muchas más. Comprendieron que la aventura nunca había tratado de ser iguales, sino de aprender a acompañarse. Desde ese día, cada persona que cruzaba la puerta podía dejar una nueva historia en el mapa.",
    hook: "Reto de Turn: imagina una forma de participar donde todas las personas del equipo tengan un lugar.",
    tip: "La aventura crece cuando compartes tu energía y dejas espacio para que otras personas también participen."
  }
};
function openModal(modal) {
  if (!modal) return;
  modal.classList.remove('is-closing');
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  const focusable = modal.querySelector('button');
  if (focusable) focusable.focus();
  body.style.overflow = 'hidden';
}
function closeModal(modal) {
  if (!modal || !modal.classList.contains('open')) return;
  modal.classList.add('is-closing');
  modal.setAttribute('aria-hidden', 'true');
  window.setTimeout(() => {
    modal.classList.remove('open', 'is-closing');
    body.style.overflow = '';
  }, 340);
}
let activeStoryId = 'rem';
function showCharacterStory(id, shouldFocus = false) {
  const story = stories[id];
  if (!story) return;
  activeStoryId = id;
  const position = storyOrder.indexOf(id);
  document.querySelector('#modal-kicker').textContent = story.name;
  document.querySelector('#modal-title').textContent = 'Una historia, cinco miradas';
  document.querySelector('#modal-text').textContent = story.text;
  document.querySelector('#modal-tip-text').textContent = story.tip;
  document.querySelector('#modal-hook').innerHTML = `<button type="button" class="modal-hook-button" id="modal-hook-button">${story.hook} <span aria-hidden="true">✦</span></button><p class="modal-hook-answer" id="modal-hook-answer" aria-live="polite"></p>`;
  document.querySelector('#modal-hook-button').addEventListener('click', (event) => {
    event.currentTarget.classList.toggle('is-open');
    document.querySelector('#modal-hook-answer').textContent = '¡Tú decides cómo continuar! Piensa, prueba y comparte tu propia respuesta.';
  });
  document.querySelector('#story-navigation').hidden = false;
  document.querySelector('#story-progress').textContent = `Personaje ${position + 1} de ${storyOrder.length}`;
  document.querySelector('#story-prev').disabled = position === 0;
  document.querySelector('#story-next').disabled = position === storyOrder.length - 1;
  if (shouldFocus) document.querySelector('#story-next').focus();
}
document.querySelectorAll('.guide-more').forEach(button => {
  button.addEventListener('click', () => {
    const answer = button.parentElement.querySelector('.guide-answer');
    const open = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!open));
    button.classList.toggle('is-open', !open);
    if (answer) answer.textContent = open ? '' : button.dataset.guideAnswer;
  });
});
document.querySelectorAll('.hook-button').forEach(button => {
  button.addEventListener('click', () => {
    const message = button.parentElement.querySelector('.hook-message');
    const isOpen = button.classList.toggle('is-open');
    if (message) {
      message.textContent = isOpen ? button.dataset.hookMessage : '';
      message.classList.toggle('is-visible', isOpen);
    }
    button.setAttribute('aria-expanded', String(isOpen));
  });
});
const photoModal = document.querySelector('#photo-modal');
const photoModalImage = document.querySelector('#photo-modal-image');
const photoModalTitle = document.querySelector('#photo-modal-title');
function openCharacterPhoto(trigger) {
  if (!photoModal || !photoModalImage) return;
  const name = trigger.dataset.photoName || 'Personaje';
  photoModalImage.src = trigger.dataset.photo;
  photoModalImage.alt = `Ilustración ampliada de ${name}`;
  photoModalTitle.textContent = name;
  openModal(photoModal);
}
document.querySelectorAll('.photo-expand-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => openCharacterPhoto(trigger));
  trigger.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openCharacterPhoto(trigger);
    }
  });
});
document.querySelectorAll('.character-open').forEach(button => {
  button.addEventListener('click', () => {
    showCharacterStory(button.dataset.id);
    openModal(document.querySelector('#story-modal'));
  });
});
const storyPrevButton = document.querySelector('#story-prev');
const storyNextButton = document.querySelector('#story-next');
if (storyPrevButton && storyNextButton) {
  storyPrevButton.addEventListener('click', () => {
    const position = storyOrder.indexOf(activeStoryId);
    if (position > 0) showCharacterStory(storyOrder[position - 1], true);
  });
  storyNextButton.addEventListener('click', () => {
    const position = storyOrder.indexOf(activeStoryId);
    if (position < storyOrder.length - 1) showCharacterStory(storyOrder[position + 1], true);
  });
}

document.querySelectorAll('[data-close="true"]').forEach(element => {
  element.addEventListener('click', () => closeModal(element.closest('.modal')));
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') document.querySelectorAll('.modal.open').forEach(closeModal);
});

let notesFilterSequence = 0;
document.querySelectorAll('.filter-button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter-button').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    const sequence = ++notesFilterSequence;
    const grid = document.querySelector('.article-grid');
    const cards = [...document.querySelectorAll('.article-card')];
    cards.forEach(card => {
      card.classList.remove('is-featured');
      if (!card.hidden) card.classList.add('is-leaving');
    });
    if (grid) grid.classList.remove('single-result');
    window.setTimeout(() => {
      if (sequence !== notesFilterSequence) return;
      cards.forEach(card => {
        const show = filter === 'todos' || card.dataset.category === filter;
        card.hidden = !show;
        card.classList.remove('is-leaving');
      });
      const visible = cards.filter(card => !card.hidden);
      if (visible.length === 1) {
        if (grid) grid.classList.add('single-result');
        visible[0].classList.add('is-featured');
      } else if (grid) {
        grid.classList.remove('single-result');
      }
      visible.forEach(card => card.classList.add('is-entering'));
      window.requestAnimationFrame(() => visible.forEach(card => card.classList.remove('is-entering')));
    }, 240);
  });
});
document.querySelectorAll('.article-open').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    document.querySelector('#modal-kicker').textContent = 'nota para conversar';
    document.querySelector('#modal-title').textContent = link.dataset.title;
    document.querySelector('#modal-text').textContent = link.dataset.text;
    document.querySelector('#modal-tip-text').textContent = 'Adapta estas ideas a la persona, conversa con ella y busca apoyos respetuosos en su entorno.';
    document.querySelector('#modal-hook').innerHTML = '';
    document.querySelector('#story-navigation').hidden = true;
    openModal(document.querySelector('#story-modal'));
  });
});

const videoButton = document.querySelector('#video-button');
if (videoButton) {
  videoButton.addEventListener('click', () => {
    const player = window.mainYoutubePlayer;
    if (player && player.playVideo) {
      player.playVideo();
      document.querySelector('.video-placeholder')?.scrollIntoView({ behavior:'smooth', block:'center' });
    } else {
      videoButton.textContent = 'Cargando video de YouTube…';
    }
  });
}

// YouTube IFrame API: preguntas sincronizadas, pausa al desbloquear y repetición obligatoria al fallar.
const videoQuizToggle = document.querySelector('#video-quiz-title');
const videoQuizPanel = document.querySelector('#video-quiz-panel');
let videoQuizCloseTimer = null;
function setVideoQuizOpen(open) {
  if (!videoQuizToggle || !videoQuizPanel) return;
  if (videoQuizCloseTimer) { window.clearTimeout(videoQuizCloseTimer); videoQuizCloseTimer = null; }
  videoQuizToggle.setAttribute('aria-expanded', String(open));
  if (open) {
    videoQuizPanel.hidden = false; videoQuizPanel.classList.remove('is-closing');
    window.requestAnimationFrame(() => videoQuizPanel.classList.add('is-open'));
  } else {
    videoQuizPanel.classList.remove('is-open'); videoQuizPanel.classList.add('is-closing');
    videoQuizCloseTimer = window.setTimeout(() => { videoQuizPanel.hidden = true; videoQuizPanel.classList.remove('is-closing'); videoQuizCloseTimer = null; }, 420);
  }
}
videoQuizToggle?.addEventListener('click', () => {
  setVideoQuizOpen(videoQuizToggle.getAttribute('aria-expanded') !== 'true');
});
const gateCards = [...document.querySelectorAll('#checkpoint-grid .checkpoint-card')];
const gateStatus = document.querySelector('#video-quiz-status');
const gateProgress = document.querySelector('.video-quiz-progress');
if (gateCards.length === 5) {
  const questions = [
    { time: 58, q: '¿Qué variante de TDAH dice tener el narrador?', a: ['La variante inatenta.', 'La variante hiperactiva.', 'Ambas por igual.', 'Dice que no tiene TDAH.'], ok: 0 },
    { time: 121, q: '¿Qué tipo de representación del TDAH critica en películas y televisión?', a: ['Una descripción realista de la vida diaria.', 'El estereotipo exagerado de distraerse con cualquier cosa.', 'La falta de personajes adultos.', 'Que siempre se muestre en una escuela.'], ok: 1 },
    { time: 190, q: '¿Qué le ocurre cuando va a buscar el chocolate que Kelly le pidió?', a: ['Lo deja en la cocina y vuelve sin él.', 'Se distrae y termina comiéndoselo él.', 'Se lo lleva a otra persona.', 'Lo guarda para después.'], ok: 1 },
    { time: 250, q: '¿Qué le pidieron hacer durante la prueba EEG?', a: ['Caminar durante media hora.', 'Leer un libro en voz alta.', 'Permanecer sentado y quieto durante 30 minutos.', 'Tomar una bebida con cafeína.'], ok: 2 },
    { time: 292, q: '¿Cómo se sintió al recibir el diagnóstico?', a: ['Aliviado al comprender sus dificultades de concentración.', 'Enojado porque no le dieron medicación.', 'Sorprendido de que la prueba fuera corta.', 'Seguro de que no necesitaba apoyo.'], ok: 0 }
  ];
  const unlocked = new Set(), answered = new Set();
  let replay = null, unlockNotice = null, lastTime = 0, playerReady = false;
  let pollHandle = null;
  const fmt = n => `${String(Math.floor(n / 60)).padStart(2,'0')}:${String(Math.floor(n % 60)).padStart(2,'0')}`;
  const say = text => { if (gateStatus) gateStatus.textContent = text; };
  const player = () => window.mainYoutubePlayer;
  const currentTime = () => playerReady ? player().getCurrentTime() : 0;
  const playing = () => playerReady && player().getPlayerState() === YT.PlayerState.PLAYING;
  const hideUnlockNotice = () => { if (unlockNotice) unlockNotice.hidden = true; };
  const updateProgress = () => {
    if (!gateProgress) return;
    gateProgress.setAttribute('aria-valuenow', String(answered.size));
    const fill = gateProgress.querySelector('span');
    if (fill) fill.style.width = `${answered.size * 20}%`;
  };
  const cardTop = i => `<div class="checkpoint-card-top"><span class="checkpoint-number">${String(i + 1).padStart(2,'0')}</span><span class="checkpoint-time">Momento ${fmt(questions[i].time)}</span></div>`;
  const lockCard = i => {
    gateCards[i].className = 'checkpoint-card is-locked';
    gateCards[i].setAttribute('aria-label', `Tarjeta ${i + 1}, bloqueada hasta ${fmt(questions[i].time)}`);
    gateCards[i].innerHTML = `<div class="checkpoint-lock"><span class="checkpoint-number">${String(i + 1).padStart(2,'0')}</span><span class="checkpoint-lock-label">Pendiente</span></div><p>Una pregunta te espera</p><div class="checkpoint-countdown"><span class="checkpoint-unlock-at">SE ACTIVA EN ${fmt(questions[i].time)}</span><strong data-time-left>${fmt(questions[i].time)}</strong><span class="checkpoint-countdown-track"><i data-time-progress></i></span><small data-time-caption>Reproduce el video para acercarte</small></div>`;
  };
  const updateCountdowns = now => gateCards.forEach((card,i)=>{if(unlocked.has(i))return;const remain=Math.max(0,questions[i].time-now),total=questions[i].time;const time=card.querySelector('[data-time-left]'),fill=card.querySelector('[data-time-progress]'),caption=card.querySelector('[data-time-caption]');if(time)time.textContent=remain<=0?'¡Ya casi!':fmt(remain);if(fill)fill.style.width=`${Math.min(100,Math.max(0,(now/total)*100))}%`;if(caption)caption.textContent=now<=0?'Inicia el video para activar el conteo':remain<10?'La pregunta aparece en unos segundos':`Has avanzado ${fmt(Math.min(now,total))} de ${fmt(total)}`});
  const seek = seconds => { if (playerReady) player().seekTo(seconds, true); };
  const renderQuestion = (i, feedbackText = 'Elige una opción y comprueba tu respuesta.') => {
    const item = questions[i], card = gateCards[i];
    card.className = 'checkpoint-card is-unlocked';
    card.setAttribute('aria-label', `Tarjeta ${i + 1}, pregunta disponible`);
    const options = item.a.map((text, n) => `<label class="checkpoint-answer"><input type="radio" name="answer-${i}" value="${n}" required><span>${text}</span></label>`).join('');
    card.innerHTML = `${cardTop(i)}<form class="checkpoint-form"><fieldset><legend>${item.q}</legend>${options}</fieldset><p class="checkpoint-feedback" role="status" aria-live="polite">${feedbackText}</p><button class="checkpoint-submit" type="submit">Comprobar respuesta</button></form>`;
    card.querySelector('form').addEventListener('submit', event => {
      event.preventDefault();
      if (replay?.i === i) return;
      const value = new FormData(event.currentTarget).get(`answer-${i}`);
      const feedback = card.querySelector('.checkpoint-feedback');
      if (value === null) { feedback.textContent = 'Selecciona una respuesta para continuar.'; card.classList.add('is-nudge'); return; }
      if (Number(value) === item.ok) {
        if (!answered.has(i)) { answered.add(i); updateProgress(); }
        card.className = 'checkpoint-card is-complete';
        card.setAttribute('aria-label', `Tarjeta ${i + 1}, respuesta correcta`);
        card.innerHTML = `${cardTop(i)}<div class="checkpoint-success-badge">¡Correcto!</div><h4>${item.q}</h4><p class="checkpoint-success">Muy bien. El video continúa.</p>`;
        say('¡Respuesta correcta! Volvemos al video.');
        hideUnlockNotice();
        document.querySelector('.video-placeholder')?.scrollIntoView({ behavior:'smooth', block:'center' });
        player().playVideo();
      } else {
        const start = Math.max(0, item.time - 24);
        replay = { i, start, end:item.time + 1.5, frontier:start, started:false };
        card.className = 'checkpoint-card is-wrong is-nudge';
        card.setAttribute('aria-label', `Tarjeta ${i + 1}, respuesta incorrecta, repetición requerida`);
        card.innerHTML = `${cardTop(i)}<div class="wrong-answer-panel"><div class="wrong-answer-mark">Vuelve a mirar</div><h4>¡Casi! Revisemos esta escena</h4><p>Para responder otra vez, reproduce este fragmento completo. La pregunta se habilitará al terminarlo.</p><button class="checkpoint-replay" type="button">Ver fragmento de nuevo</button><p class="checkpoint-feedback" role="status" aria-live="polite"></p></div>`;
        card.querySelector('.checkpoint-replay').addEventListener('click', () => {
          replay.started = true; replay.frontier = start;
          player().pauseVideo(); seek(start); lastTime = start;
          window.setTimeout(() => player().playVideo(), 300);
          say(`Reproduce desde ${fmt(start)} hasta terminar la escena para volver a responder.`);
        });
        player().pauseVideo();
        say('Respuesta incorrecta. Mira el fragmento para habilitar otro intento.');
      }
    });
  };
  const revealCard = i => {
    if (unlocked.has(i)) return;
    unlocked.add(i); renderQuestion(i); setVideoQuizOpen(true);
    if (unlockNotice) {
      unlockNotice.hidden = false; unlockNotice.dataset.card = String(i);
      unlockNotice.querySelector('[data-notice-message]').textContent = `La pregunta ${i + 1} está lista. Responde o continúa el video.`;
    }
    say(`Se abrió la pregunta ${i + 1}.`);
  };
  const resetActivity = () => {
    if (!playerReady) return;
    player().pauseVideo(); replay = null; unlocked.clear(); answered.clear(); hideUnlockNotice();
    gateCards.forEach((_, i) => lockCard(i)); updateProgress(); seek(0); lastTime = 0;
    say('Actividad reiniciada. Reproduce el video para descubrir las preguntas.');
    document.querySelector('.video-placeholder')?.scrollIntoView({ behavior:'smooth', block:'center' });
  };
  const resetButton = document.createElement('button');
  resetButton.type = 'button'; resetButton.className = 'quiz-reset-button'; resetButton.textContent = 'Reiniciar actividad'; resetButton.addEventListener('click', resetActivity);
  document.querySelector('#video-quiz')?.append(resetButton);
  gateCards.forEach((_, i) => lockCard(i)); updateCountdowns(0);
  if (gateStatus) {
    unlockNotice = document.createElement('div'); unlockNotice.className = 'quiz-unlock-notice';
    unlockNotice.setAttribute('role','status'); unlockNotice.setAttribute('aria-live','assertive'); unlockNotice.hidden = true;
    unlockNotice.innerHTML = '<span class="quiz-notice-icon">NUEVA</span><div class="quiz-notice-copy"><strong>Pregunta desbloqueada</strong><p data-notice-message></p></div><div class="quiz-notice-actions"><button type="button" data-notice-card>Ver pregunta</button><button type="button" data-notice-resume>Seguir video</button></div>';
    (document.querySelector('.video-placeholder') || gateStatus.parentElement).appendChild(unlockNotice);
    unlockNotice.querySelector('[data-notice-card]').addEventListener('click', () => {
      const card = gateCards[Number(unlockNotice.dataset.card)]; hideUnlockNotice();
      if (card) { document.querySelector('#video-quiz')?.scrollIntoView({ behavior:'smooth', block:'start' }); card.querySelector('input')?.focus({ preventScroll:true }); }
    });
    unlockNotice.querySelector('[data-notice-resume]').addEventListener('click', () => { hideUnlockNotice(); player()?.playVideo(); });
  }
  const poll = () => {
    if (!playerReady) return;
    const now = currentTime(), wasPlaying = playing(), previous = lastTime;
    updateCountdowns(now);
    if (!wasPlaying) { lastTime = now; return; }
    if (replay?.started) {
      if (now - replay.frontier > 1.6) { seek(replay.frontier); return; }
      replay.frontier = Math.max(replay.frontier, now);
      if (now >= replay.end) {
        const i = replay.i; replay = null; player().pauseVideo();
        renderQuestion(i, 'Fragmento visto completo. Ya puedes responder otra vez.');
        gateCards[i].classList.add('is-retry-ready'); say('Ya viste el fragmento. La respuesta está habilitada de nuevo.');
      }
      lastTime = now; return;
    }
    // Ignora saltos manuales; solo el avance continuo desbloquea momentos.
    if (now - previous > 1.6 || now < previous) { lastTime = now; return; }
    questions.forEach((item, i) => {
      const mark = item.time;
      if (!unlocked.has(i) && previous < mark && now >= mark) {
        revealCard(i); player().pauseVideo();
      }
    });
    lastTime = now;
  };
  window.onYouTubeIframeAPIReady = () => {
    const mount = document.querySelector('#main-youtube-player');
    if (!mount) return;
    const iframe = document.createElement('iframe');
    iframe.id = 'main-youtube-iframe';
    iframe.title = 'Video principal: experiencias con TDAH';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    const embed = new URL('https://www.youtube.com/embed/tPKwAcu_vPg');
    embed.searchParams.set('enablejsapi', '1');
    embed.searchParams.set('origin', window.location.origin);
    embed.searchParams.set('playsinline', '1');
    embed.searchParams.set('rel', '0');
    // Identifica la página que contiene el reproductor en navegadores compatibles.
    if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
      embed.searchParams.set('widget_referrer', window.location.href);
    }
    iframe.src = embed.toString();
    mount.replaceWith(iframe);
    window.mainYoutubePlayer = new YT.Player(iframe, {
      events:{
        onReady:() => { playerReady = true; lastTime = currentTime(); pollHandle = window.setInterval(poll, 250); if (videoButton) videoButton.textContent = 'Ver video de introducción'; },
        onStateChange:event => {
          if (event.data === YT.PlayerState.PLAYING) { lastTime = currentTime(); setVideoQuizOpen(true); }
        }
      }
    });
  };
  const apiScript = document.createElement('script'); apiScript.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(apiScript);
  updateProgress();
}
function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

// Reto 01: repetir una secuencia breve para practicar memoria de trabajo.
const memoryArea = document.querySelector('#memory-game');
let memorySequence = [];
let memoryInput = [];
let memoryLocked = false;

function renderMemoryGame() {
  if (!memoryArea) return;
  memorySequence = Array.from({ length: 6 }, () => Math.floor(Math.random() * 6));
  memoryInput = [];
  memoryLocked = true;
  memoryArea.innerHTML = '<p class="mini-game-status">Observa el patrón…</p>';
  const board = document.createElement('div');
  board.className = 'memory-board';

  for (let index = 0; index < 6; index += 1) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `memory-pad memory-pad-${index + 1}`;
    button.dataset.index = String(index);
    button.setAttribute('aria-label', `Cuadro ${index + 1}`);
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
const drawingClear = document.querySelector('#drawing-clear');
const drawingStatus = document.querySelector('#drawing-status');

if (drawingCanvas) {
  const drawingContext = drawingCanvas.getContext('2d');
  let drawing = false;
  let hasDrawing = false;

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
    drawingContext.strokeStyle = drawingColor ? drawingColor.value : '#3d3d3d';
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

  if (drawingClear) {
    drawingClear.addEventListener('click', () => {
      drawingContext.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
      hasDrawing = false;
      if (drawingStatus) drawingStatus.textContent = 'Lienzo limpio. Puedes empezar de nuevo.';
    });
  }
}

// Reto 03: misión de atención flexible. Patrones por color y temporizador.
const challengeArea = document.querySelector('#focus-challenge');
const challengeColors = [
  { name: 'coral', hex: '#ff715b' },
  { name: 'amarillo', hex: '#ffd166' },
  { name: 'turquesa', hex: '#54d2c8' },
  { name: 'azul', hex: '#5b8def' },
  { name: 'violeta', hex: '#a98bea' },
  { name: 'miel', hex: '#d8ae4b' }
];
let challengeRound = 1;
let challengeSequence = [];
let challengeInput = [];
let challengeLocked = false;
let challengeTimerId = null;
let challengeTimeLeft = 0;

function stopChallengeTimer() {
  if (challengeTimerId) window.clearInterval(challengeTimerId);
  challengeTimerId = null;
}

function startChallengeTimer(status, nextButton) {
  stopChallengeTimer();
  challengeTimeLeft = Math.max(12, 24 - (challengeRound * 2));
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
  const cellCount = Math.min(24, 16 + challengeRound * 2);
  const sequenceLength = Math.min(6, 3 + challengeRound);
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
        status.textContent = `¡Nivel ${challengeRound} superado! El próximo patrón será más difícil.`;
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

document.querySelectorAll('.mini-game-reset').forEach(button => {
  button.addEventListener('click', () => {
    if (button.dataset.game === 'memory') renderMemoryGame();
    if (button.dataset.game === 'challenge') renderChallengeGame(true);
  });
});

renderMemoryGame();
renderChallengeGame(true);
stopChallengeTimer();
const collectionCloseTimers = new WeakMap();
document.querySelectorAll('.section-collection-toggle').forEach(button => {
  const panel = document.getElementById(button.getAttribute('aria-controls'));
  if (!panel) return;
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true';
    const pending = collectionCloseTimers.get(panel);
    if (pending) window.clearTimeout(pending);
    collectionCloseTimers.delete(panel);
    button.setAttribute('aria-expanded', String(open));
    const title = button.querySelector('strong');
    if (title && panel.id === 'characters-panel') title.textContent = open ? 'Ocultar personajes' : 'Ver los cinco personajes';
    if (title && panel.id === 'minigames-panel') title.textContent = open ? 'Ocultar minijuegos' : 'Abrir minijuegos';
    button.querySelector('.collection-toggle-icon')?.classList.toggle('is-open', open);
    if (open) {
      panel.hidden = false; panel.classList.remove('is-closing');
      if (panel.id === 'characters-panel') {
        panel.style.maxHeight = '0px'; panel.style.opacity = '0'; panel.style.transform = 'translate3d(0,-8px,0)'; panel.style.overflow = 'hidden';
      }
      window.requestAnimationFrame(() => {
        if (button.getAttribute('aria-expanded') !== 'true') return;
        panel.classList.add('is-open');
        if (panel.id === 'characters-panel') {
          panel.style.maxHeight = `${panel.scrollHeight}px`; panel.style.opacity = '1'; panel.style.transform = 'translate3d(0,0,0)';
          const settleOpen = event => { if (event.propertyName !== 'max-height' || !panel.classList.contains('is-open')) return; panel.style.maxHeight = 'none'; panel.style.overflow = 'visible'; panel.removeEventListener('transitionend', settleOpen); };
          panel.addEventListener('transitionend', settleOpen);
          window.setTimeout(() => { if (button.getAttribute('aria-expanded') === 'true' && panel.classList.contains('is-open')) { panel.style.maxHeight = 'none'; panel.style.overflow = 'visible'; } }, 460);
        }
      });
    } else {
      panel.classList.remove('is-open'); panel.classList.add('is-closing');
      if (panel.id === 'characters-panel') {
        panel.style.maxHeight = `${panel.scrollHeight}px`; panel.style.opacity = '1'; panel.style.transform = 'translate3d(0,0,0)';
        void panel.offsetHeight;
        window.requestAnimationFrame(() => { if (button.getAttribute('aria-expanded') === 'true') return; panel.style.maxHeight = '0px'; panel.style.opacity = '0'; panel.style.transform = 'translate3d(0,-7px,0)'; });
      }
      collectionCloseTimers.set(panel, window.setTimeout(() => {
        panel.hidden = true; panel.classList.remove('is-closing'); collectionCloseTimers.delete(panel);
        if (panel.id === 'characters-panel') { panel.style.removeProperty('max-height'); panel.style.removeProperty('opacity'); panel.style.removeProperty('transform'); panel.style.removeProperty('overflow'); }
      }, 480));
    }
    if (panel.id === 'minigames-panel') {
      if (open) { renderMemoryGame(); renderChallengeGame(true); }
      else stopChallengeTimer();
    }
  });
});
// Animaciones al entrar en pantalla: movimiento sutil y accesible.
const animatedElements = document.querySelectorAll(
  '.section:not(#recorrido), .welcome-video-section, .section-heading-row:not(#recorrido .section-heading-row), .split-heading, .character-card, .article-card, .mini-game-card, .social-card, .expert-card, .interview-card'
);
const mobileRevealQuery = window.matchMedia('(max-width: 760px)');
let revealObserver = null;
function syncMobileRevealAnimations() {
  const isMobile = mobileRevealQuery.matches;
  if (revealObserver) { revealObserver.disconnect(); revealObserver = null; }
  animatedElements.forEach(element => {
    element.classList.toggle('mobile-scroll-reveal', isMobile);
    element.classList.add('reveal-on-scroll');
    element.classList.remove('is-visible');
  });
  if ('IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Una única entrada; no reiniciar filtros/animaciones al desplazarse.
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -32px' });
    animatedElements.forEach(element => revealObserver.observe(element));
  } else {
    animatedElements.forEach(element => element.classList.add('is-visible'));
  }
}
syncMobileRevealAnimations();
if (mobileRevealQuery.addEventListener) mobileRevealQuery.addEventListener('change', syncMobileRevealAnimations);

// Parallax global configurable: cambia data-parallax-image en <body> por la imagen deseada.
const configuredParallaxImage = (body.dataset.parallaxImage || '').trim();
if (configuredParallaxImage) {
  body.style.setProperty('--parallax-image', `url("${configuredParallaxImage.replace(/"/g, '\\"')}")`);
}

const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const parallaxSections = [
  { element: document.querySelector('.hero'), speed: 0.10 },
  { element: document.querySelector('.intro'), speed: 0.075 },
  { element: document.querySelector('.video-section'), speed: 0.06 },
  { element: document.querySelector('.characters'), speed: 0.09 },
  { element: document.querySelector('.blog'), speed: 0.065 },
  { element: document.querySelector('.photo-carousel-section'), speed: 0.055 },
  { element: document.querySelector('.minigames'), speed: 0.08 },
  { element: document.querySelector('.socials'), speed: 0.07 }
].filter(item => item.element);
let parallaxFrame = null;

function updateParallax() {
  parallaxFrame = null;
  if (reducedMotionQuery.matches) {
    document.documentElement.style.setProperty('--page-parallax-y', '0px');
    parallaxSections.forEach(({ element }) => element.style.setProperty('--parallax-y', '0px'));
    return;
  }

  const pageOffset = Math.max(-120, Math.min(0, window.scrollY * -0.08));
  document.documentElement.style.setProperty('--page-parallax-y', `${pageOffset.toFixed(1)}px`);
  const viewportCenter = window.innerHeight / 2;
  parallaxSections.forEach(({ element, speed }) => {
    const rect = element.getBoundingClientRect();
    if (rect.bottom < -180 || rect.top > window.innerHeight + 180) return;
    const distanceFromCenter = rect.top + rect.height / 2 - viewportCenter;
    const offset = Math.max(-34, Math.min(34, distanceFromCenter * speed * -1));
    element.style.setProperty('--parallax-y', `${offset.toFixed(1)}px`);
  });
}

function requestParallaxUpdate() {
  if (parallaxFrame !== null) return;
  parallaxFrame = window.requestAnimationFrame(updateParallax);
}

window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
window.addEventListener('resize', requestParallaxUpdate);
if (reducedMotionQuery.addEventListener) reducedMotionQuery.addEventListener('change', requestParallaxUpdate);
requestParallaxUpdate();

// Carrusel moderno de seis fotografías.
const carruselFotos = document.querySelector('[data-carousel]');
if (carruselFotos) {
  const pista = carruselFotos.querySelector('[data-carousel-track]');
  const diapositivas = [...carruselFotos.querySelectorAll('.carousel-slide')];
  const botonAnterior = carruselFotos.querySelector('[data-carousel-prev]');
  const botonSiguiente = carruselFotos.querySelector('[data-carousel-next]');
  const contenedorPuntos = carruselFotos.querySelector('[data-carousel-dots]');
  const contador = carruselFotos.querySelector('[data-carousel-counter]');
  let indiceFoto = 0;
  let touchStartX = null;
  let carouselAutoplay = null;
  let carouselResumeTimer = null;
  const stopCarouselAutoplay = () => {
    if (carouselAutoplay) { window.clearInterval(carouselAutoplay); carouselAutoplay = null; }
    if (carouselResumeTimer) { window.clearTimeout(carouselResumeTimer); carouselResumeTimer = null; }
  };
  const startCarouselAutoplay = () => {
    stopCarouselAutoplay();
    if (document.hidden || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    carouselAutoplay = window.setInterval(() => mostrarFoto(indiceFoto + 1), 6500);
  };
  const resumeCarouselSoon = () => {
    if (carouselResumeTimer) window.clearTimeout(carouselResumeTimer);
    carouselResumeTimer = window.setTimeout(startCarouselAutoplay, 1600);
  };
  carruselFotos.addEventListener('pointerenter', stopCarouselAutoplay);
  carruselFotos.addEventListener('pointerleave', resumeCarouselSoon);
  carruselFotos.addEventListener('focusin', stopCarouselAutoplay);
  carruselFotos.addEventListener('focusout', event => { if (!carruselFotos.contains(event.relatedTarget)) resumeCarouselSoon(); });
  carruselFotos.addEventListener('touchstart', event => {
    stopCarouselAutoplay();
    if (event.touches.length === 1) touchStartX = event.touches[0].clientX;
  }, { passive: true });
  carruselFotos.addEventListener('touchend', event => {
    if (touchStartX === null || !event.changedTouches.length) return;
    const deltaX = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(deltaX) >= 45) mostrarFoto(indiceFoto + (deltaX < 0 ? 1 : -1));
    touchStartX = null;
    resumeCarouselSoon();
  }, { passive: true });
  carruselFotos.addEventListener('touchcancel', () => { touchStartX = null; resumeCarouselSoon(); }, { passive: true });

  diapositivas.forEach((_, indice) => {
    const punto = document.createElement('button');
    punto.type = 'button';
    punto.className = 'carousel-dot';
    punto.setAttribute('aria-label', `Mostrar fotografía ${indice + 1}`);
    punto.addEventListener('click', () => mostrarFoto(indice));
    contenedorPuntos.appendChild(punto);
  });

  function mostrarFoto(indice) {
    indiceFoto = (indice + diapositivas.length) % diapositivas.length;
    pista.style.transform = `translate3d(-${indiceFoto * 100}%, 0, 0)`;
    diapositivas.forEach((diapositiva, posicion) => {
      diapositiva.classList.toggle('is-active', posicion === indiceFoto);
    });
    contenedorPuntos.querySelectorAll('.carousel-dot').forEach((punto, posicion) => {
      const estaActiva = posicion === indiceFoto;
      punto.classList.toggle('is-active', estaActiva);
      punto.setAttribute('aria-current', estaActiva ? 'true' : 'false');
    });
    if (contador) contador.textContent = `${String(indiceFoto + 1).padStart(2, '0')} / ${String(diapositivas.length).padStart(2, '0')}`;
  }

  if (botonAnterior) botonAnterior.addEventListener('click', () => mostrarFoto(indiceFoto - 1));
  if (botonSiguiente) botonSiguiente.addEventListener('click', () => mostrarFoto(indiceFoto + 1));
  carruselFotos.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') mostrarFoto(indiceFoto - 1);
    if (event.key === 'ArrowRight') mostrarFoto(indiceFoto + 1);
  });
  mostrarFoto(0);
  document.addEventListener('visibilitychange', () => document.hidden ? stopCarouselAutoplay() : startCarouselAutoplay());
  startCarouselAutoplay();
}

// Submenús: un único grupo abierto; al salir con el cursor se cierra inmediatamente.
const navGroups = [...document.querySelectorAll('.nav-group')];
function closeOtherNavGroups(active) {
  navGroups.forEach(group => { if (group !== active) { group.open = false; group.classList.remove('is-closing'); } });
}
navGroups.forEach(group => {
  const summary = group.querySelector('summary');
  let closeTimer = null;
  summary?.addEventListener('click', event => {
    event.preventDefault();
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
    if (group.open) {
      group.classList.add('is-closing');
      closeTimer = window.setTimeout(() => { group.open = false; group.classList.remove('is-closing'); closeTimer = null; }, 220);
    } else {
      closeOtherNavGroups(group);
      group.open = true;
      group.classList.remove('is-closing');
    }
  });
  group.addEventListener('pointerenter', event => {
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
    if (event.pointerType === 'touch' || !window.matchMedia('(hover: hover)').matches) return;
    closeOtherNavGroups(group);
    group.open = true;
  });
  group.addEventListener('pointerleave', event => {
    if (event.pointerType === 'touch' || !window.matchMedia('(hover: hover)').matches) return;
    if (!group.open) return;
    group.classList.add('is-closing');
    if (closeTimer) clearTimeout(closeTimer);
    closeTimer = window.setTimeout(() => { group.open = false; group.classList.remove('is-closing'); closeTimer = null; }, 220);
  });
  group.addEventListener('pointerenter', event => {
    if (event.pointerType === 'touch' || !window.matchMedia('(hover: hover)').matches) return;
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
    group.classList.remove('is-closing');
  });
  group.addEventListener('focusin', () => { closeOtherNavGroups(group); });
  group.addEventListener('focusout', event => { if (!group.contains(event.relatedTarget)) group.open = false; });
});
document.querySelectorAll('.nav-submenu a, .main-nav > a').forEach(link => link.addEventListener('click', () => {
  navGroups.forEach(group => { group.open = false; });
  if (mainNav?.classList.contains('open') && menuToggle) menuToggle.click();
  else {
    if (mainNav) mainNav.classList.remove('open');
    document.querySelector('.mobile-menu-backdrop')?.setAttribute('hidden', '');
    document.body.classList.remove('mobile-menu-open');
    if (menuToggle) { menuToggle.setAttribute('aria-expanded','false'); menuToggle.textContent = 'Menú'; }
  }
}));
// Parallax discreto y a demanda: usa transformaciones independientes y respeta movimiento reducido.
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const targets = [...document.querySelectorAll('.hero-art,.character-card,.expert-card,.article-card,.mini-game-card,.social-card,.photo-carousel')];
  targets.forEach(el => { el.dataset.parallax = ''; });
  let frame = 0;
  const updateParallax = () => {
    frame = 0;
    if (reduceMotion.matches) { targets.forEach(el => el.style.removeProperty('--parallax-y')); return; }
    const mobile = window.matchMedia('(max-width: 760px)').matches;
    const limit = mobile ? 3 : 12;
    for (const el of targets) {
      const r = el.getBoundingClientRect();
      if (r.bottom < -120 || r.top > innerHeight + 120) continue;
      const centerOffset = (r.top + r.height * .5 - innerHeight * .5) / Math.max(innerHeight, 1);
      const strength = el.classList.contains('hero-art') ? .028 : .012;
      const offset = Math.max(-limit, Math.min(limit, -centerOffset * innerHeight * strength));
      el.style.setProperty('--parallax-y', `${offset.toFixed(1)}px`);
    }
  };
  const requestUpdate = () => { if (!frame) frame = requestAnimationFrame(updateParallax); };
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  reduceMotion.addEventListener?.('change', requestUpdate);
  requestUpdate();
})();


// Controles de contenido ampliado: transiciones reversibles y cierres seguros.
const expandableCloseTimers = new WeakMap();
document.querySelectorAll('.content-expand-button').forEach(button => {
  const panel = document.getElementById(button.getAttribute('aria-controls'));
  if (!panel) return;
  const cardScope = button.closest('.article-card, .expert-card, .interview-card, .recommendations-grid article, .intro');
  const closePanel = otherButton => {
    const otherPanel = document.getElementById(otherButton.getAttribute('aria-controls'));
    if (!otherPanel || otherPanel === panel) return;
    const pending = expandableCloseTimers.get(otherPanel);
    if (pending) window.clearTimeout(pending);
    otherButton.setAttribute('aria-expanded', 'false'); otherButton.classList.remove('is-open');
    const label = otherButton.querySelector('span:last-child'); if (label) label.textContent = '+';
    otherPanel.classList.remove('is-open'); otherPanel.classList.add('is-closing');
    expandableCloseTimers.set(otherPanel, window.setTimeout(() => { otherPanel.hidden = true; otherPanel.classList.remove('is-closing'); expandableCloseTimers.delete(otherPanel); }, 460));
  };
  button.addEventListener('click', () => {
    const isOpen = button.getAttribute('aria-expanded') === 'true';
    if (!isOpen && cardScope) cardScope.querySelectorAll('.content-expand-button[aria-expanded="true"]').forEach(closePanel);
    button.setAttribute('aria-expanded', String(!isOpen)); button.classList.toggle('is-open', !isOpen);
    const label = button.querySelector('span:last-child'); if (label) label.textContent = isOpen ? '+' : '−';
    const pending = expandableCloseTimers.get(panel); if (pending) window.clearTimeout(pending); expandableCloseTimers.delete(panel);
    if (isOpen) {
      panel.classList.remove('is-open'); panel.classList.add('is-closing');
      expandableCloseTimers.set(panel, window.setTimeout(() => { panel.hidden = true; panel.classList.remove('is-closing'); expandableCloseTimers.delete(panel); }, 460));
    } else {
      panel.classList.remove('is-closing'); panel.hidden = false;
      window.requestAnimationFrame(() => panel.classList.add('is-open'));
    }
  });
});


// Video 02: panel expandible y tarjetas de preguntas con retroalimentación.
(()=>{const toggle=document.querySelector('#interactive-quiz-title'),panel=document.querySelector('#interactive-quiz-panel');if(!toggle||!panel)return;toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));toggle.querySelector('.video-quiz-toggle-icon')?.classList.toggle('is-open',!open);panel.hidden=open;if(!open)window.requestAnimationFrame(()=>panel.classList.add('is-open'));else panel.classList.remove('is-open')});document.querySelectorAll('.interactive-question-card').forEach(card=>{const options=[...card.querySelectorAll('.question-options button')],feedback=card.querySelector('.question-feedback');options.forEach(option=>option.addEventListener('click',()=>{options.forEach(item=>{item.classList.remove('is-correct','is-wrong');item.disabled=false});const correct=option.dataset.answer==='correct';option.classList.add(correct?'is-correct':'is-wrong');feedback.textContent=correct?'¡Muy bien! Esa idea aparece en el video.':'Casi. Vuelve a mirar ese momento y prueba otra opción.';feedback.classList.toggle('is-wrong',!correct);if(correct)options.forEach(item=>{item.disabled=true})}))})})();
const interactiveCreditsToggle=document.querySelector('#secondary-video-credits-toggle'),interactiveCreditsPanel=document.querySelector('#secondary-video-credits-panel');if(interactiveCreditsToggle&&interactiveCreditsPanel)interactiveCreditsToggle.addEventListener('click',()=>{const open=interactiveCreditsToggle.getAttribute('aria-expanded')==='true';interactiveCreditsToggle.setAttribute('aria-expanded',String(!open));interactiveCreditsToggle.classList.toggle('is-open',!open);interactiveCreditsPanel.hidden=open});


// Segundo video: mismo patrón de desbloqueo por avance continuo que el primer video.
(()=>{
  const toggle=document.querySelector('#video-quiz-second-title'), panel=document.querySelector('#video-quiz-second-panel'), cards=[...document.querySelectorAll('#checkpoint-grid-second .checkpoint-card')], status=document.querySelector('#video-quiz-second-status'), progress=document.querySelector('#video-quiz-second-progress');
  if(!toggle||!panel||cards.length!==8)return;
  toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));panel.hidden=open;if(!open)window.requestAnimationFrame(()=>panel.classList.add('is-open'));else panel.classList.remove('is-open')});
  const items=[
    {time:38,q:'¿Qué recomienda el video antes de tomar un medicamento?',a:['Consultar a un profesional de salud.','Probar varias dosis por cuenta propia.','Dejar de hablar del tema.'],ok:0},
    {time:70,q:'¿Cómo describe el narrador algunos de sus pensamientos?',a:['Como una lista perfectamente ordenada.','Como pensamientos que se sobreponen y generan caos.','Como algo que nunca cambia.'],ok:1},
    {time:134,q:'¿Con qué dosis de Adderall comienza?',a:['50 mg.','25 mg.','5 mg.'],ok:2},
    {time:199,q:'¿Qué tipo de tareas dice que podía completar con Adderall?',a:['Tareas físicas y tangibles, como limpiar.','Solo tareas imaginarias.','Ninguna actividad cotidiana.'],ok:0},
    {time:258,q:'¿Qué sucede cuando prueba Vyvanse?',a:['Olvida por completo cómo leer.','Se enfoca demasiado en investigar viajes espaciales y mecánica orbital.','Se queda dormido de inmediato.'],ok:1},
    {time:328,q:'¿Qué síntoma físico le preocupa especialmente?',a:['Dolor de oído.','Hambre constante.','Falta de aire y sensación de estar corriendo.'],ok:2},
    {time:366,q:'¿Qué resultado obtiene en la prueba de COVID?',a:['Positivo.','Negativo.','No se realiza ninguna prueba.'],ok:1},
    {time:418,q:'¿Cuál es la idea final del video?',a:['La productividad importa más que sentirse bien.','Hay que ocultar los efectos secundarios.','Si algo hace sentir mal, hay que hablar pronto con un profesional.'],ok:2}
  ];
  let player=null,ready=false,last=0,unlocked=new Set(),answered=new Set(),replay=null;
  const fmt=n=>`${String(Math.floor(n/60)).padStart(2,'0')}:${String(Math.floor(n%60)).padStart(2,'0')}`;
  const say=t=>{if(status)status.textContent=t}; const update=()=>{progress?.setAttribute('aria-valuenow',String(answered.size));const fill=progress?.querySelector('span');if(fill)fill.style.width=`${answered.size*12.5}%`};
  const lock=i=>{cards[i].className='checkpoint-card is-locked';cards[i].setAttribute('aria-label',`Tarjeta ${i+1}, se desbloquea en ${fmt(items[i].time)}`);cards[i].innerHTML=`<div class="checkpoint-lock"><span class="checkpoint-number">${String(i+1).padStart(2,'0')}</span><span class="checkpoint-lock-label">Pendiente</span></div><p>Una pregunta te espera</p><div class="checkpoint-countdown"><span class="checkpoint-unlock-at">SE ACTIVA EN ${fmt(items[i].time)}</span><strong data-second-time-left>${fmt(items[i].time)}</strong><span class="checkpoint-countdown-track"><i data-second-time-progress></i></span><small data-second-time-caption>Inicia el video para activar el conteo</small></div>`};
  const updateCountdowns=now=>cards.forEach((card,i)=>{if(unlocked.has(i))return;const remain=Math.max(0,items[i].time-now),left=card.querySelector('[data-second-time-left]'),fill=card.querySelector('[data-second-time-progress]'),caption=card.querySelector('[data-second-time-caption]');if(left)left.textContent=remain<=0?'¡Ya casi!':fmt(remain);if(fill)fill.style.width=`${Math.min(100,Math.max(0,now/items[i].time*100))}%`;if(caption)caption.textContent=now<=0?'Inicia el video para activar el conteo':remain<10?'La pregunta aparece en unos segundos':`Has avanzado ${fmt(Math.min(now,items[i].time))} de ${fmt(items[i].time)}`});
  const render=i=>{const item=items[i],card=cards[i],options=item.a.map((x,n)=>`<label class="checkpoint-answer"><input type="radio" name="second-answer-${i}" value="${n}" required><span>${x}</span></label>`).join('');card.className='checkpoint-card is-unlocked';card.innerHTML=`<div class="checkpoint-card-top"><span class="checkpoint-number">${String(i+1).padStart(2,'0')}</span><span class="checkpoint-time">Momento ${fmt(item.time)}</span></div><form class="checkpoint-form"><fieldset><legend>${item.q}</legend>${options}</fieldset><p class="checkpoint-feedback" role="status" aria-live="polite">Elige una opción y comprueba tu respuesta.</p><button class="checkpoint-submit" type="submit">Comprobar respuesta</button></form>`;card.querySelector('form').addEventListener('submit',e=>{e.preventDefault();const value=new FormData(e.currentTarget).get(`second-answer-${i}`);if(value===null)return;if(Number(value)===item.ok){answered.add(i);update();card.className='checkpoint-card is-complete';card.innerHTML=`<div class="checkpoint-card-top"><span class="checkpoint-number">${String(i+1).padStart(2,'0')}</span><span class="checkpoint-time">Momento ${fmt(item.time)}</span></div><div class="checkpoint-success-badge">¡Correcto!</div><h4>${item.q}</h4><p class="checkpoint-success">Muy bien. El video continúa.</p>`;player?.playVideo?.();say('¡Respuesta correcta! Volvemos al video.')}else{const start=Math.max(0,item.time-22);replay={i,start,end:item.time+1.5,frontier:start,started:false};card.className='checkpoint-card is-wrong is-nudge';card.innerHTML=`<div class="checkpoint-card-top"><span class="checkpoint-number">${String(i+1).padStart(2,'0')}</span><span class="checkpoint-time">Momento ${fmt(item.time)}</span></div><div class="wrong-answer-panel"><div class="wrong-answer-mark">Vuelve a mirar</div><h4>¡Casi! Revisemos esta escena</h4><p>Reproduce el fragmento completo para habilitar otro intento.</p><button class="checkpoint-replay" type="button">Ver fragmento de nuevo</button></div>`;card.querySelector('.checkpoint-replay').onclick=()=>{replay.started=true;player.pauseVideo();player.seekTo(start,true);setTimeout(()=>player.playVideo(),300);say(`Reproduce desde ${fmt(start)} hasta terminar la escena.`)};player?.pauseVideo?.();say('Respuesta incorrecta. Mira el fragmento para habilitar otro intento.')}})};
  const reveal=i=>{if(unlocked.has(i))return;unlocked.add(i);render(i);panel.hidden=false;toggle.setAttribute('aria-expanded','true');player?.pauseVideo?.();say(`Se abrió la pregunta ${i+1}.`)};
  const init=()=>{const mount=document.querySelector('#secondary-youtube-player');if(!mount||!window.YT)return;const iframe=document.createElement('iframe');iframe.id='secondary-youtube-iframe';iframe.title='Cómo es tener TDAH (medicado) | Fandub Latino';iframe.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';iframe.allowFullscreen=true;const u=new URL('https://www.youtube.com/embed/7ZBmm3m8-x0');u.searchParams.set('enablejsapi','1');u.searchParams.set('origin',location.origin);u.searchParams.set('playsinline','1');u.searchParams.set('rel','0');iframe.src=u.toString();mount.replaceWith(iframe);player=new YT.Player(iframe,{events:{onReady:()=>{ready=true;last=player.getCurrentTime()},onStateChange:e=>{if(e.data===YT.PlayerState.PLAYING)last=player.getCurrentTime()}}})};
  window.addEventListener('secondVideoApiReady',init);cards.forEach((_,i)=>lock(i));updateCountdowns(0);
  const reset=document.createElement('button');reset.type='button';reset.className='quiz-reset-button';reset.textContent='Reiniciar actividad';reset.onclick=()=>{if(!player)return;player.pauseVideo();player.seekTo(0,true);unlocked.clear();answered.clear();replay=null;cards.forEach((_,i)=>lock(i));update();say('Actividad reiniciada. Reproduce el segundo video para descubrir las preguntas.')};document.querySelector('#video-quiz-second')?.append(reset);update();
  window.setInterval(()=>{if(!ready||!player||!window.YT)return;const now=player.getCurrentTime();updateCountdowns(now);if(player.getPlayerState()!==YT.PlayerState.PLAYING)return;if(replay?.started){if(now-replay.frontier>1.6){player.seekTo(replay.frontier,true);return}replay.frontier=Math.max(replay.frontier,now);if(now>=replay.end){const i=replay.i;replay=null;player.pauseVideo();render(i);say('Ya viste el fragmento. La respuesta está habilitada de nuevo.')}last=now;return}if(now-last>1.6||now<last){last=now;return}items.forEach((item,i)=>{if(!unlocked.has(i)&&last<item.time&&now>=item.time)reveal(i)});last=now},250);
})();
// Encadena la inicialización del segundo reproductor a la API que usa el primer video.
(()=>{const previous=window.onYouTubeIframeAPIReady;window.onYouTubeIframeAPIReady=()=>{previous?.();window.dispatchEvent(new Event('secondVideoApiReady'))}})();
// Like flotante: cuenta interacciones de este navegador y las refleja en estadísticas.
(()=>{const button=document.querySelector('#floating-like'),stat=document.querySelector('#visit-likes-count');if(!button)return;const key='otra-forma-likes-total';let total=0;try{total=Math.max(0,Number(localStorage.getItem(key)||0)||0)}catch(e){}const paint=()=>{button.setAttribute('aria-label','Me gusta esta página');if(stat)stat.textContent=total.toLocaleString('es-CO')};button.addEventListener('click',()=>{total++;try{localStorage.setItem(key,String(total))}catch(e){}paint();button.classList.remove('is-liked');void button.offsetWidth;button.classList.add('is-liked');button.setAttribute('aria-pressed','true');window.setTimeout(()=>button.setAttribute('aria-pressed','false'),600)});paint()})();;
// Panel estadístico local, interactivo y exportable a Excel (.xlsx).
(()=>{const countEl=document.querySelector('#visit-count'),host=document.querySelector('#visit-bars'),download=document.querySelector('#visit-download');if(!countEl||!host)return;const storageKey='otra-forma-visitas-registro';let records=[];try{records=JSON.parse(localStorage.getItem(storageKey)||'[]');if(!Array.isArray(records))records=[]}catch(e){records=[]}records.push(new Date().toISOString());records=records.slice(-3000);try{localStorage.setItem(storageKey,JSON.stringify(records))}catch(e){};countEl.textContent=records.length.toLocaleString('es-CO');const atMidnight=date=>{const d=new Date(date);d.setHours(0,0,0,0);return d};const dayCounts=()=>{const map=new Map();records.forEach(t=>{const d=atMidnight(t),key=`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;map.set(key,(map.get(key)||0)+1)});return map};const counts=dayCounts(),today=atMidnight(new Date()),keyOf=d=>`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`,sumSince=days=>{let n=0;for(let i=0;i<days;i++){const d=new Date(today);d.setDate(d.getDate()-i);n+=counts.get(keyOf(d))||0}return n};const todayEl=document.querySelector('#visit-today'),weekEl=document.querySelector('#visit-week'),monthEl=document.querySelector('#visit-month'),bestEl=document.querySelector('#visit-best-day');if(todayEl)todayEl.textContent=String(counts.get(keyOf(today))||0);if(weekEl)weekEl.textContent=String(sumSince(7));if(monthEl)monthEl.textContent=String(sumSince(30));if(bestEl){const top=[...counts.entries()].sort((a,b)=>b[1]-a[1])[0];if(top){const [y,m,d]=top[0].split('-').map(Number);bestEl.textContent=`${d}/${m} · ${top[1]}`}}let range=7;const render=()=>{const days=[];for(let i=range-1;i>=0;i--){const d=new Date(today);d.setDate(d.getDate()-i);days.push({date:d,count:counts.get(keyOf(d))||0})}const max=Math.max(1,...days.map(x=>x.count));const weeks=[];for(let i=0;i<days.length;i+=7)weeks.push(days.slice(i,i+7));const startPad=(days[0].date.getDay()+6)%7;const cells=Array.from({length:startPad},()=>'<span class="visit-matrix-empty" aria-hidden="true"></span>');days.forEach((x,i)=>{const label=x.date.toLocaleDateString('es-CO',{day:'numeric',month:'short'});const level=x.count===0?0:Math.min(4,Math.ceil(x.count/max*4));cells.push(`<button type="button" class="visit-matrix-cell level-${level}" style="--cell-delay:${Math.min(i*22,650)}ms" aria-label="${x.date.toLocaleDateString('es-CO',{weekday:'long',day:'numeric',month:'long'})}: ${x.count} ${x.count===1?'visita':'visitas'}" data-tip="${x.date.toLocaleDateString('es-CO',{weekday:'long',day:'numeric',month:'long'})}: ${x.count} ${x.count===1?'visita':'visitas'}"><span>${range===7?x.date.toLocaleDateString('es-CO',{weekday:'short'}):label}</span><b>${x.count}</b></button>`)});while(cells.length%7)cells.push('<span class="visit-matrix-empty" aria-hidden="true"></span>');host.innerHTML=`<div class="visit-matrix-weekdays" aria-hidden="true"><span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span></div><div class="visit-matrix-grid">${cells.join('')}</div><div class="visit-matrix-legend"><span>Menos</span><i class="level-0"></i><i class="level-1"></i><i class="level-2"></i><i class="level-3"></i><i class="level-4"></i><span>Más visitas</span></div>`;host.querySelectorAll('.visit-matrix-cell').forEach(el=>{const show=()=>{const tip=document.querySelector('#visit-chart-tooltip');if(tip)tip.textContent=el.dataset.tip};el.addEventListener('mouseenter',show);el.addEventListener('focus',show);el.addEventListener('click',show)});const title=document.querySelector('#visit-chart-title');if(title)title.textContent=`Matriz de visitas · últimos ${range} días`;host.setAttribute('aria-label',`Matriz de visitas de los últimos ${range} días`)};document.querySelectorAll('.visit-range-button').forEach(button=>button.addEventListener('click',()=>{range=Number(button.dataset.range);document.querySelectorAll('.visit-range-button').forEach(b=>{b.classList.toggle('is-active',b===button);b.setAttribute('aria-pressed',String(b===button))});render()}));download?.addEventListener('click',()=>{const rows=[['Fecha','Visitas registradas'],...Array.from({length:30},(_,i)=>{const d=new Date(today);d.setDate(d.getDate()-(29-i));return [d.toLocaleDateString('es-CO'),counts.get(keyOf(d))||0]}),[],['Resumen','Valor'],['Visitas aproximadas registradas en este navegador',records.length],['Visitas hoy',counts.get(keyOf(today))||0],['Visitas últimos 7 días',sumSince(7)],['Visitas últimos 30 días',sumSince(30)],['Likes registrados en este navegador',Number(localStorage.getItem('otra-forma-likes-total')||0)],['Nota','Datos locales de este navegador; no son visitantes únicos ni un total global.']];if(window.XLSX){const ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:48},{wch:22}];const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Visitas');XLSX.writeFile(wb,'estadisticas-visitas.xlsx')}else{const csv='\ufeff'+rows.map(row=>row.map(x=>'"'+String(x??'').replaceAll('"','""')+'"').join(';')).join('\r\n');const a=document.createElement('a'),url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.href=url;a.download='estadisticas-visitas.csv';a.click();URL.revokeObjectURL(url);const tip=document.querySelector('#visit-chart-tooltip');if(tip)tip.textContent='Excel no se pudo cargar; descargamos una hoja compatible con Excel en formato CSV.'}});render()})();
// Partículas grandes y ligeras para todas las secciones, incluida la página de creadores.
(()=>{const sections=[...document.querySelectorAll('.section, .creators-page main section')];sections.forEach((section,index)=>{if(section.querySelector(':scope > .ambient-particles'))return;const layer=document.createElement('div');layer.className='ambient-particles';layer.setAttribute('aria-hidden','true');layer.innerHTML='<span>✦</span><span>•</span><span>✧</span><span>•</span><span>✦</span><span>✧</span><span>•</span><span>✦</span><span>✧</span><span>•</span><span>✦</span><span>•</span>';section.prepend(layer);section.style.position=section.style.position||'relative';section.style.isolation=section.style.isolation||'isolate';});})();
// Recorrido infantil, con explicaciones concretas y acceso directo a cada área.
(()=>{const dialog=document.querySelector('#child-tutorial'),open=document.querySelector('#open-child-tutorial');if(!dialog||!open)return;const steps=[{title:'¡Hola! Vamos a explorar',text:'Esta página es un espacio para aprender sobre el TDAH con respeto y curiosidad. Puedes avanzar a tu ritmo y pedir apoyo a una persona adulta.',href:'#que-es',label:'Conocer el tema'},{title:'¿Qué es el TDAH?',text:'Aquí encontrarás una explicación sencilla sobre el TDAH, cómo puede sentirse y por qué cada persona vive experiencias diferentes.',href:'#que-es',label:'Ir a ¿Qué es?'},{title:'Conoce a los personajes',text:'Los personajes muestran situaciones cotidianas en casa, la escuela y otros espacios. Sus historias ayudan a mirar desde distintas perspectivas.',href:'#personajes',label:'Ver personajes'},{title:'Mira y escucha los videos',text:'Hay videos con historias y preguntas interactivas. Mira con atención: las preguntas aparecen en momentos importantes y puedes volver a ver fragmentos.',href:'#recorrido',label:'Ir a los videos'},{title:'Explora las notas',text:'En las notas hay ideas y recursos para seguir aprendiendo. Lee con calma y conversa sobre lo que te parezca interesante.',href:'#blog',label:'Leer notas'},{title:'Explora los minijuegos',text:'Prueba actividades breves para practicar atención, organización y empatía. No es una competencia: equivocarse es parte de aprender.',href:'#minijuegos',label:'Jugar'},{title:'Pasea por la galería',text:'La galería reúne imágenes e historias de esta experiencia. Puedes recorrerla a tu ritmo y volver a tus favoritas.',href:'#galeria',label:'Abrir galería'},{title:'Escucha entrevistas',text:'En las entrevistas, profesionales conversan sobre distintas experiencias y maneras de acompañar.',href:'#entrevistas',label:'Ver entrevistas'},{title:'Pide orientación',text:'La sección de especialistas comparte información profesional. El contenido del sitio es educativo y no reemplaza una consulta de salud.',href:'#especialistas',label:'Ver especialistas'},{title:'Conoce a quienes crearon la página',text:'Visita la sección de creadores para conocer al equipo detrás de este proyecto y el propósito de la experiencia.',href:'creadores.html',label:'Conocer creadores'},{title:'Comparte y conversa',text:'También puedes encontrarnos en redes. Si eres menor de edad, visita esos enlaces con una persona adulta.',href:'#redes',label:'Ir a redes'}];let i=0;const title=dialog.querySelector('#child-tutorial-title'),copy=dialog.querySelector('#child-tutorial-copy'),count=dialog.querySelector('#tutorial-step-count'),bar=dialog.querySelector('#tutorial-progress-bar'),prev=dialog.querySelector('#tutorial-prev'),next=dialog.querySelector('#tutorial-next'),go=dialog.querySelector('#tutorial-go');const render=()=>{const step=steps[i];title.textContent=step.title;copy.textContent=step.text;count.textContent=`Paso ${i+1} de ${steps.length}`;bar.style.width=`${((i+1)/steps.length)*100}%`;prev.disabled=i===0;next.textContent=i===steps.length-1?'Terminar':'Siguiente';go.href=step.href;go.innerHTML=`${step.label} <span aria-hidden="true">↗</span>`};let closeTimer;const closeTutorial=()=>{if(!dialog.open)return;dialog.classList.remove('is-opening');dialog.classList.add('is-closing');window.clearTimeout(closeTimer);closeTimer=window.setTimeout(()=>{dialog.close();dialog.classList.remove('is-closing')},190)};open.addEventListener('click',()=>{i=0;render();dialog.classList.remove('is-closing');dialog.showModal();requestAnimationFrame(()=>dialog.classList.add('is-opening'))});dialog.querySelector('.child-tutorial-close').addEventListener('click',closeTutorial);dialog.addEventListener('cancel',e=>{e.preventDefault();closeTutorial()});prev.addEventListener('click',()=>{if(i>0){i--;render()}});next.addEventListener('click',()=>{if(i<steps.length-1){i++;render()}else closeTutorial()});go.addEventListener('click',e=>{e.preventDefault();const href=go.getAttribute('href')||'#';closeTutorial();window.setTimeout(()=>{if(href.startsWith('#')){const target=document.querySelector(href);if(target)target.scrollIntoView({behavior:'smooth',block:'start'})}else window.location.href=href},210)});dialog.addEventListener('click',e=>{if(e.target===dialog)closeTutorial()})})();

(()=>{const button=document.querySelector('#visit-graph-toggle'),panel=document.querySelector('#visit-graph-expand');if(!button||!panel)return;let timer;const setExpanded=expanded=>{window.clearTimeout(timer);button.setAttribute('aria-expanded',String(expanded));button.innerHTML=expanded?'Contraer gráficos <span aria-hidden="true">−</span>':'Expandir gráficos <span aria-hidden="true">＋</span>';button.classList.toggle('is-expanded',expanded);panel.inert=!expanded;panel.setAttribute('aria-hidden',String(!expanded));if(expanded){panel.classList.remove('is-collapsed');panel.style.maxHeight='0px';panel.style.opacity='0';panel.style.transform='translateY(-14px) scale(.99)';requestAnimationFrame(()=>{panel.style.maxHeight=panel.scrollHeight+'px';panel.style.opacity='1';panel.style.transform='translateY(0) scale(1)'})}else{panel.style.maxHeight=panel.scrollHeight+'px';panel.style.opacity='1';panel.style.transform='translateY(0) scale(1)';requestAnimationFrame(()=>{panel.classList.add('is-collapsed');panel.style.maxHeight='0px';panel.style.opacity='0';panel.style.transform='translateY(-14px) scale(.99)'})}};button.addEventListener('click',()=>setExpanded(button.getAttribute('aria-expanded')!=='true'));panel.addEventListener('transitionend',e=>{if(e.target!==panel||e.propertyName!=='max-height')return;if(button.getAttribute('aria-expanded')==='true'){panel.style.maxHeight='none';panel.style.transform='none'}else{panel.classList.add('is-collapsed')}});})();

// Encuesta para público escolar con mapa radar interactivo, progresivo y animado.
(()=>{
 const root=document.getElementById('tdah-survey');if(!root)return;
 const questions=[
 ['Cuando haces una tarea, ¿qué tan seguido se te escapan detalles o errores pequeños?','Atención'],['¿Qué tan seguido te cuesta seguir con una tarea hasta terminarla?','Atención'],['Cuando hay ruidos o cosas pasando cerca, ¿qué tan seguido te distraes?','Atención'],['Si alguien te interrumpe, ¿qué tan seguido te cuesta volver a lo que estabas haciendo?','Atención'],
 ['Cuando tienes varias cosas por hacer, ¿qué tan seguido te cuesta saber por cuál empezar?','Organización'],['¿Qué tan seguido se te hace difícil calcular cuánto tiempo te tomará una tarea?','Organización'],['¿Qué tan seguido olvidas llevar algo que necesitas para la escuela o una actividad?','Organización'],['¿Qué tan seguido dejas una tarea para justo antes de la fecha de entrega?','Organización'],
 ['Cuando alguien te da varios pasos, ¿qué tan seguido olvidas alguno?','Memoria cotidiana'],['¿Qué tan seguido se te olvida una fecha, una cita o algo que habías quedado en hacer?','Memoria cotidiana'],['¿Qué tan seguido vas a buscar algo y, al llegar, olvidas qué era?','Memoria cotidiana'],['¿Qué tan seguido necesitas que te recuerden una tarea o actividad del día?','Memoria cotidiana'],
 ['En momentos en que toca estar sentado/a, ¿qué tan seguido sientes ganas de moverte?','Inquietud e impulsos'],['En un juego o una conversación, ¿qué tan seguido se te hace difícil esperar tu turno?','Inquietud e impulsos'],['Cuando alguien hace una pregunta, ¿qué tan seguido empiezas a responder antes de que termine?','Inquietud e impulsos'],['¿Qué tan seguido haces algo de inmediato y luego piensas que quizá era mejor esperar?','Inquietud e impulsos']
 ];
 const groups=[{key:'Atención',label:'Atención',icon:'◎'},{key:'Organización',label:'Organización',icon:'▤'},{key:'Memoria',label:'Memoria',icon:'↻'},{key:'Inquietud',label:'Inquietud',icon:'↗'}],opts=['Nunca','Casi nunca','A veces','Muchas veces','Casi siempre'],answers=Array(questions.length).fill(null);let step=0,selected=0,shown=[0,0,0,0],raf=0,hover=-1;
 const host=document.getElementById('survey-questions'),prog=document.getElementById('survey-progress-bar'),label=document.getElementById('survey-progress-label'),prev=document.getElementById('survey-prev'),next=document.getElementById('survey-next'),canvas=document.getElementById('survey-radar'),ctx=canvas.getContext('2d'),legend=document.getElementById('radar-legend'),detail=document.getElementById('survey-chart-detail'),score=document.getElementById('survey-score'),intro=document.getElementById('survey-result-intro'),download=document.getElementById('survey-download'),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const dark=()=>document.body.classList.contains('dark-mode')||document.body.classList.contains('dark-theme');
 function groupIndices(g){return questions.map((q,i)=>q[1].startsWith(g.key)||(g.key==='Memoria'&&q[1]==='Memoria cotidiana')||(g.key==='Inquietud'&&q[1].startsWith('Inquietud'))?i:-1).filter(i=>i>=0)}
 function getValues(){return groups.map(g=>{const ids=groupIndices(g),given=ids.filter(i=>answers[i]!==null);return given.length?given.reduce((s,i)=>s+answers[i],0)/(given.length*4):0})}
 function sizeCanvas(){const d=Math.min(devicePixelRatio||1,2),w=Math.max(260,canvas.parentElement.clientWidth-24);canvas.width=w*d;canvas.height=Math.round(w*.78)*d;canvas.style.width=w+'px';canvas.style.height=Math.round(w*.78)+'px';ctx.setTransform(d,0,0,d,0,0);draw(shown)}
 function geometry(i,w,h,r){const a=-Math.PI/2+i*Math.PI/2;return{x:w/2+Math.cos(a)*r,y:h*.47+Math.sin(a)*r}}
 function draw(values){const w=canvas.clientWidth||340,h=canvas.clientHeight||265,cx=w/2,cy=h*.47,r=Math.min(w*.29,h*.33),isDark=dark();ctx.clearRect(0,0,w,h);
  // Concentric web, subtle segmented rings, plus five level markers.
  for(let ring=1;ring<=5;ring++){ctx.beginPath();groups.forEach((_,i)=>{const p=geometry(i,w,h,r*ring/5);i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y)});ctx.closePath();ctx.lineWidth=ring===5?1.6:1;ctx.strokeStyle=isDark?(ring===5?'#85857b':'#55554f'):(ring===5?'#9b9b94':'#d5d5cf');ctx.setLineDash(ring===5?[]:[3,4]);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle=isDark?'#bdbdb5':'#74746e';ctx.font='9px "DM Sans",sans-serif';ctx.textAlign='center';ctx.fillText(String(ring*20),cx+3,cy-r*ring/5+10)}
  groups.forEach((g,i)=>{const p=geometry(i,w,h,r);ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(p.x,p.y);ctx.strokeStyle=isDark?'#64645d':'#c7c7c0';ctx.lineWidth=1;ctx.stroke();const lp=geometry(i,w,h,r+17);ctx.fillStyle=(i===selected||i===hover)?(isDark?'#ffe15b':'#8a7000'):(isDark?'#efefea':'#343434');ctx.font=`${(i===selected||i===hover)?700:600} 10px "DM Sans",sans-serif`;ctx.textAlign=i===0||i===2?'center':i===1?'left':'right';ctx.textBaseline=i===0?'bottom':i===2?'top':'middle';ctx.fillText(g.label,lp.x,lp.y)});
  const ps=values.map((v,i)=>{const p=geometry(i,w,h,r*(.055+.945*v));return[p.x,p.y]});ctx.beginPath();ps.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();const gradient=ctx.createLinearGradient(cx-r,cy-r,cx+r,cy+r);gradient.addColorStop(0,isDark?'rgba(255,222,67,.68)':'rgba(255,216,54,.72)');gradient.addColorStop(1,isDark?'rgba(210,210,203,.25)':'rgba(80,80,76,.22)');ctx.fillStyle=gradient;ctx.fill();ctx.strokeStyle=isDark?'#ffdf4b':'#8f7300';ctx.lineWidth=3;ctx.lineJoin='round';ctx.shadowColor=isDark?'rgba(255,218,50,.4)':'rgba(193,157,0,.28)';ctx.shadowBlur=selected>=0?14:8;ctx.stroke();ctx.shadowBlur=0;ps.forEach((p,i)=>{ctx.beginPath();ctx.arc(p[0],p[1],i===selected?6:4.2,0,Math.PI*2);ctx.fillStyle=i===selected?'#f5d33a':(isDark?'#f8f8f3':'#fff');ctx.fill();ctx.strokeStyle=isDark?'#151515':'#252525';ctx.lineWidth=2;ctx.stroke();if(i===selected){ctx.beginPath();ctx.arc(p[0],p[1],9,0,Math.PI*2);ctx.strokeStyle=isDark?'rgba(255,220,55,.6)':'rgba(173,139,0,.5)';ctx.lineWidth=2;ctx.stroke()}})
 }
 function animate(){const from=shown.slice(),to=getValues();if(raf)cancelAnimationFrame(raf);if(reduce){shown=to;draw(shown);return}const start=performance.now();const tick=now=>{const t=Math.min(1,(now-start)/650),ease=1-Math.pow(1-t,3);shown=from.map((v,i)=>v+(to[i]-v)*ease);draw(shown);if(t<1)raf=requestAnimationFrame(tick)};raf=requestAnimationFrame(tick)}
 function select(i){selected=(i+groups.length)%groups.length;legend.querySelectorAll('.radar-chip').forEach((b,n)=>{b.classList.toggle('is-active',n===selected);b.setAttribute('aria-pressed',String(n===selected))});updateDetail();draw(shown)}
 function updateDetail(){const g=groups[selected],ids=groupIndices(g),given=ids.filter(i=>answers[i]!==null),avg=given.length?Math.round(given.reduce((s,i)=>s+answers[i],0)/(given.length*4)*100):null;detail.textContent=avg===null?`${g.label}: responde algunas preguntas para ver un resumen.`:`${g.label}: ${given.length} de ${ids.length} respuestas. Frecuencia media marcada: ${avg}%. Toca otra dimensión para explorarla.`}
 function buildLegend(){legend.innerHTML=groups.map((g,i)=>`<button class="radar-chip ${i===selected?'is-active':''}" type="button" data-chip="${i}" aria-pressed="${i===selected}"><i>${g.icon}</i><span>${g.label}</span><b data-chip-value>0%</b></button>`).join('');legend.querySelectorAll('.radar-chip').forEach(b=>b.addEventListener('click',()=>select(Number(b.dataset.chip))))}
 function updateSummary(){const given=answers.filter(x=>x!==null),pct=given.length?Math.round(given.reduce((s,x)=>s+x,0)/(given.length*4)*100):0;score.innerHTML=`${pct}<small>${given.length===questions.length?'mapa completado':`${given.length} de ${questions.length} respuestas`}</small>`;intro.textContent=given.length?'El mapa tipo telaraña se anima con cada respuesta. Selecciona una dimensión para explorarla; no es una calificación.':'Responde para ver cómo se dibuja tu mapa personal en tiempo real.';download.disabled=given.length!==questions.length;const vals=getValues();legend.querySelectorAll('.radar-chip').forEach((b,i)=>b.querySelector('[data-chip-value]').textContent=`${Math.round(vals[i]*100)}%`);updateDetail()}
 function render(){const q=questions[step];host.innerHTML=`<div class="survey-question"><div class="survey-question-top"><span class="survey-bubble">${String(step+1).padStart(2,'0')}</span><span class="survey-context">${q[1]}</span><span class="survey-spark" aria-hidden="true">✦</span></div><h3>${q[0]}</h3><p class="survey-hint">Piensa en la escuela, en casa y con tus amistades. No hay respuestas buenas o malas.</p><div class="survey-options" role="radiogroup" aria-label="Frecuencia de la experiencia">${opts.map((o,i)=>`<button type="button" class="survey-choice ${answers[step]===i?'is-selected':''}" role="radio" aria-checked="${answers[step]===i}" data-value="${i}"><span class="choice-dot">${i+1}</span><span>${o}</span><span class="choice-check" aria-hidden="true">✓</span></button>`).join('')}</div></div>`;host.querySelectorAll('.survey-choice').forEach(b=>b.addEventListener('click',()=>{answers[step]=Number(b.dataset.value);host.querySelectorAll('.survey-choice').forEach(x=>{x.classList.toggle('is-selected',x===b);x.setAttribute('aria-checked',String(x===b))});next.disabled=false;const gi=groups.findIndex(g=>q[1].startsWith(g.key)||(g.key==='Memoria'&&q[1]==='Memoria cotidiana')||(g.key==='Inquietud'&&q[1].startsWith('Inquietud')));if(gi>=0)select(gi);animate();updateSummary();root.classList.remove('survey-answer-pulse');void root.offsetWidth;root.classList.add('survey-answer-pulse');if(step<questions.length-1)setTimeout(()=>{if(answers[step]!==null&&step<questions.length-1){step++;render()}},380);else{next.textContent='Ver mi resultado';next.classList.add('is-finish')}}));const done=answers.filter(a=>a!==null).length;prog.style.width=`${done/questions.length*100}%`;label.textContent=`${done} de ${questions.length} respondidas · pregunta ${step+1}`;prev.disabled=step===0;next.disabled=answers[step]===null;next.textContent=step===questions.length-1?'Ver mi resultado':'Siguiente';next.classList.toggle('is-finish',step===questions.length-1)}
 prev.addEventListener('click',()=>{if(step>0){step--;render()}});next.addEventListener('click',()=>{if(answers[step]===null){host.classList.remove('survey-nudge');void host.offsetWidth;host.classList.add('survey-nudge');return}if(step<questions.length-1){step++;render()}else document.querySelector('.survey-result').scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'})});
 canvas.addEventListener('click',e=>{const rect=canvas.getBoundingClientRect(),x=e.clientX-rect.left-rect.width/2,y=e.clientY-rect.top-rect.height*.47;if(Math.hypot(x,y)>Math.min(rect.width*.38,rect.height*.45))return;let angle=Math.atan2(y,x)+Math.PI/2;while(angle<0)angle+=Math.PI*2;select(Math.round(angle/(Math.PI/2))%4)});canvas.addEventListener('pointermove',e=>{const rect=canvas.getBoundingClientRect(),x=e.clientX-rect.left-rect.width/2,y=e.clientY-rect.top-rect.height*.47;if(Math.hypot(x,y)>Math.min(rect.width*.38,rect.height*.45)){hover=-1;draw(shown);return}let a=Math.atan2(y,x)+Math.PI/2;while(a<0)a+=Math.PI*2;hover=Math.round(a/(Math.PI/2))%4;draw(shown)});canvas.addEventListener('pointerleave',()=>{hover=-1;draw(shown)});canvas.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowDown'){e.preventDefault();select(selected+1)}else if(e.key==='ArrowLeft'||e.key==='ArrowUp'){e.preventDefault();select(selected-1)}else if(e.key==='Enter'||e.key===' '){e.preventDefault();updateDetail()}});
 download.addEventListener('click',()=>{if(answers.some(x=>x===null))return;const out=document.createElement('canvas');out.width=1000;out.height=820;const c=out.getContext('2d');c.fillStyle='#fffdf3';c.fillRect(0,0,1000,820);c.fillStyle='#191919';c.font='bold 42px sans-serif';c.fillText('Mi mapa personal',62,74);c.font='19px sans-serif';c.fillStyle='#555';c.fillText('Respuestas orientativas · reflexión personal, no diagnóstica',62,112);c.drawImage(canvas,180,130,640,500);let y=695;groups.forEach((g,i)=>{const val=Math.round(getValues()[i]*100);c.fillStyle='#333';c.font='bold 15px sans-serif';c.fillText(g.label,64+i*225,y);c.fillStyle='#eee';c.fillRect(64+i*225,y+12,180,10);c.fillStyle='#e8c52e';c.fillRect(64+i*225,y+12,180*val/100,10)});c.fillStyle='#666';c.font='14px sans-serif';c.fillText('Si algo te preocupa, puedes conversarlo con una persona adulta de confianza.',62,780);out.toBlob(blob=>{const a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download='mi-mapa-personal-orientativo.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)})});
 document.getElementById('contrast-toggle')?.addEventListener('click',()=>setTimeout(()=>draw(shown),80));window.addEventListener('resize',sizeCanvas);buildLegend();sizeCanvas();render();updateSummary()
})();


// Aparición breve por sección, también en la página de creadores. Se ejecuta una vez.
(()=>{
 const sections=[...document.querySelectorAll('main > section')];
 if(!sections.length)return;
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
 if(reduce.matches||!('IntersectionObserver' in window)){sections.forEach(s=>s.classList.add('section-in-view'));return}
 const io=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(!entry.isIntersecting)return;
  entry.target.classList.add('section-in-view');io.unobserve(entry.target);
 }),{threshold:.08,rootMargin:'0px 0px -5% 0px'});
 sections.forEach(s=>io.observe(s));
 reduce.addEventListener?.('change',()=>{if(reduce.matches){sections.forEach(s=>s.classList.add('section-in-view'));io.disconnect()}});
})();
// Reflejo cristalino ligero en controles clave; conserva la función y los listeners existentes.
(()=>document.querySelectorAll('.button,.outline-button,.content-expand-button,.character-open,.expert-social-link,.creator-portfolio-link,.opinion-submit,.quiz-reset-button,.checkpoint-submit,.checkpoint-replay').forEach(el=>el.classList.add('liquid-glass-control')))();


// Estrellas ambientales en secciones que aún no tienen partículas propias.
(()=>{
 const targets=[...document.querySelectorAll('main > section, main section.video-quiz')];
 const symbols=['✦','✧','·','✦','•','✧','✦','·'];
 targets.forEach((section,sectionIndex)=>{
  if(section.querySelector('.floating-particles,.ambient-star-particles'))return;
  const layer=document.createElement('div');layer.className='ambient-star-particles';layer.setAttribute('aria-hidden','true');
  symbols.slice(0,starCount).forEach((symbol,i)=>{const star=document.createElement('span');star.textContent=symbol;star.style.setProperty('--star-x',`${5+((i*17+sectionIndex*9)%90)}%`);star.style.setProperty('--star-y',`${8+((i*23+sectionIndex*13)%82)}%`);star.style.setProperty('--star-delay',`${-((i*1.17+sectionIndex*.63)%8).toFixed(2)}s`);star.style.setProperty('--star-size',`${i%3===0?1.15:i%3===1?.85:.65}rem`);layer.append(star)});
  section.prepend(layer);
 });
})();

// Feedback cinético común para todos los botones que abren o pliegan información.
(()=>{
 const timers=new WeakMap();
 document.addEventListener('click',event=>{
  const control=event.target.closest('button[aria-expanded],summary,.creator-details-toggle,.creator-details-wrap>summary');
  if(!control)return;
  const pending=timers.get(control);if(pending)window.clearTimeout(pending);
  control.classList.remove('control-toggle-pop');void control.offsetWidth;control.classList.add('control-toggle-pop');
  const linkedPanelId=control.getAttribute('aria-controls');
  const linkedPanel=linkedPanelId?document.getElementById(linkedPanelId):null;
  if(linkedPanel){
   if(control.getAttribute('aria-expanded')==='true'){
    window.setTimeout(()=>{if(control.getAttribute('aria-expanded')==='true'&&!linkedPanel.hidden)linkedPanel.style.overflow='visible'},620);
   }else linkedPanel.style.overflow='hidden';
  }
  timers.set(control,window.setTimeout(()=>{control.classList.remove('control-toggle-pop');timers.delete(control)},520));
 },{passive:true});
})();
// globalDisclosureMotion
