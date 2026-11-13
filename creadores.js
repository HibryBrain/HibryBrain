document.body.classList.add('creator-motion-ready');

const creatorPhotoModal = document.querySelector('#creator-photo-modal');
const creatorPhotoImage = document.querySelector('#creator-photo-modal-image');
const creatorPhotoTitle = document.querySelector('#creator-photo-modal-title');

function showCreatorPhoto(title, src) {
  if (!creatorPhotoModal || !creatorPhotoImage || !creatorPhotoTitle || !src) return;
  creatorPhotoImage.src = src;
  creatorPhotoImage.alt = `Imagen ampliada: ${title}`;
  creatorPhotoTitle.textContent = title;
  creatorPhotoModal.setAttribute('aria-hidden', 'false');
  if (typeof openModal === 'function') {
    openModal(creatorPhotoModal);
  } else {
    creatorPhotoModal.classList.remove('is-closing');
    creatorPhotoModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function hideCreatorPhoto() {
  if (!creatorPhotoModal) return;
  if (typeof closeModal === 'function') {
    closeModal(creatorPhotoModal);
  } else {
    creatorPhotoModal.classList.remove('open');
    creatorPhotoModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

document.querySelectorAll('.creator-photo-trigger').forEach((trigger) => {
  trigger.addEventListener('click', () => showCreatorPhoto(
    trigger.dataset.profile === 'carlos' ? 'Carlos Andres España Angulo' : 'Jhinsen Davan Castillo Castaño',
    trigger.querySelector('img')?.src || `imagenes/${trigger.dataset.profile}-creador.jpg`
  ));
});
document.querySelectorAll('.creator-gallery-item').forEach((trigger) => {
  trigger.addEventListener('click', () => showCreatorPhoto(trigger.dataset.galleryTitle || 'Proyecto creativo', trigger.dataset.gallerySrc));
});
document.querySelectorAll('#creator-photo-modal [data-close="true"]').forEach((item) => item.addEventListener('click', hideCreatorPhoto));

document.querySelectorAll('.creator-details-toggle').forEach((summary) => {
  const details = summary.closest('.creator-details-wrap');
  if (!details) return;
  summary.setAttribute('aria-expanded', details.open ? 'true' : 'false');
  summary.addEventListener('click', (event) => {
    event.preventDefault();
    const shouldOpen = !details.open;
    summary.setAttribute('aria-expanded', String(shouldOpen));
    summary.classList.remove('is-animating');
    void summary.offsetWidth;
    summary.classList.add('is-animating');
    if (shouldOpen) {
      details.classList.remove('is-closing');
      details.open = true;
    } else {
      details.classList.add('is-closing');
      window.setTimeout(() => {
        details.open = false;
        details.classList.remove('is-closing');
      }, 520);
    }
  });
});

const opinionForm = document.querySelector('#opinions-form');
if (opinionForm) {
  opinionForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(opinionForm);
    const name = String(data.get('Nombre') || '').trim();
    const favorite = String(data.get('Lo que más gustó') || '').trim();
    const message = String(data.get('Opinión') || '').trim();
    const subject = encodeURIComponent(`Opinión de ${name || 'una persona visitante'} sobre Otra forma de mirar`);
    const bodyText = `Hola, equipo de Otra forma de mirar:\n\nQuiero compartirles mi opinión sobre la página.\n\nMi nombre: ${name || 'Prefiero no indicarlo'}\nLa parte que más me gustó: ${favorite || 'No especificada'}\n\nMi mensaje:\n${message || 'Escribiré mi comentario aquí.'}\n\nGracias por crear este espacio.\n\nSaludos.`;
    const body = encodeURIComponent(bodyText);
    window.location.href = `mailto:hibridbrain23@gmail.com?subject=${subject}&body=${body}`;
  });
}

const revealItems = document.querySelectorAll('.creator-card, .simple-heading, .creator-opinions, .creator-back-link');
revealItems.forEach((item, index) => {
  item.classList.add('scroll-reveal');
  item.style.setProperty('--reveal-delay', `${Math.min(index * 70, 280)}ms`);
});
const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' }) : null;
if (revealObserver) revealItems.forEach((item) => revealObserver.observe(item));
else revealItems.forEach((item) => item.classList.add('is-visible'));
