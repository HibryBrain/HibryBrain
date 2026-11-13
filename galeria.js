/* Navegación y tema visual compartidos por esta página individual. */
(() => {
 const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('.main-nav');
 if(toggle&&nav)toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'Cerrar':'Menú'});
 const theme=document.querySelector('#contrast-toggle');
 if(theme){try{if(localStorage.getItem('otra-forma-de-mirar-theme')==='dark')document.body.classList.add('dark-mode')}catch(_){};const paint=()=>{const dark=document.body.classList.contains('dark-mode');theme.textContent=dark?'Modo claro':'Modo oscuro';theme.setAttribute('aria-pressed',String(dark))};paint();theme.addEventListener('click',()=>{document.body.classList.toggle('dark-mode');try{localStorage.setItem('otra-forma-de-mirar-theme',document.body.classList.contains('dark-mode')?'dark':'light')}catch(_){}paint()})}
})();

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

